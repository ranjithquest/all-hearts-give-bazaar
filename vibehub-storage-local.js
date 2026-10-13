/**
 * VibeHub project-storage LOCAL DEV shim.
 *
 * Drop-in companion to `vibehub-storage.js` (the real, server-injected
 * production script). Mirrors the same `window.vibehub.storage` API surface,
 * but backed by `localStorage` so you can develop and test storage code on
 * `localhost:5173` (or any local dev server) without uploading to VibeHub.
 *
 * Usage:
 *
 *   <!-- Put this AT THE END of your HTML, after any other scripts -->
 *   <script src="/path/to/vibehub-storage-local.js"
 *           data-project-id="my-local-test"></script>
 *
 * Behavior:
 *   - If `window.vibehub.storage` already exists (i.e. the real VibeHub
 *     script ran first), this file no-ops. Means you can ship the same
 *     HTML to VibeHub and it Just Works.
 *   - Otherwise, installs an in-browser shim that mirrors the real API:
 *     `config.get`, `data.{get,set,delete,keys,all}`,
 *     `images.{get,set,delete,keys,list}` (IndexedDB-backed), `isPublicShare`,
 *     `projectId`, `viewerEmail`.
 *
 * What's emulated:
 *   - Full API surface (drop-in compatible)
 *   - Per-viewer namespacing (default viewer = `dev@local`)
 *   - Quotas (64 KB per value, 100 keys per viewer, 10 MB per project)
 *   - Per-image cap (20 MB) — but per-viewer/per-project image byte caps are
 *     intentionally skipped in dev (same "skip quotas for convenience" rule)
 *   - Reserved key prefix (`__vibehub_`)
 *   - Public-share mode (synchronous throws on `data.*` and `images.*`)
 *   - Same `{ error, code }` envelope on rejection — branch on `err.code`
 *     just like in production.
 *
 * What's NOT emulated (intentional):
 *   - Rate limiting (you're the only client, no point)
 *   - Server-side audit logs / "Wipe ALL viewers" workflow
 *   - Real cross-device persistence (localStorage is per-origin per-browser)
 *
 * Dev-only escape hatches via query string:
 *   ?devViewer=alice@example.com   override viewer email (test multi-user)
 *   ?devPublicShare=1              simulate public-share mode
 *   ?devReset=1                    wipe THIS project's local storage on load
 *
 * Auto-seeds the config from a sibling `vibehub.config.json` on every page
 * load. The JSON file is the source of truth in local dev — edit it, reload,
 * see the new config. If the file isn't there, whatever's in localStorage
 * sticks (so you can also hand-poke values via devtools).
 */
(function () {
  if (typeof window === 'undefined') return;

  // ---- 1. Production passthrough ------------------------------------------
  // The real script always installs `window.vibehub.storage`. If we see it,
  // we're on production VibeHub — get out of the way.
  if (window.vibehub && window.vibehub.storage) return;

  var scriptEl =
    document.currentScript ||
    document.querySelector('script[data-vibehub-storage-local]') ||
    document.querySelector('script[src*="vibehub-storage-local"]');

  var projectId = scriptEl ? scriptEl.getAttribute('data-project-id') : null;
  if (!projectId) projectId = 'local-dev';

  // ---- 2. Resolve dev viewer + mode from query string ---------------------
  var params;
  try { params = new URLSearchParams(window.location.search); }
  catch (_) { params = { get: function () { return null; } }; }

  var queryViewer = params.get('devViewer');
  var queryPublicShare = params.get('devPublicShare') === '1';
  var queryReset = params.get('devReset') === '1';

  var defaultViewer =
    (scriptEl && scriptEl.getAttribute('data-viewer-email')) ||
    'dev@local';
  var viewerEmail = queryPublicShare ? null : (queryViewer || defaultViewer);
  var isPublicShare = queryPublicShare;

  // ---- 3. Storage backend (localStorage with namespacing) -----------------
  var NS = 'vibehub-dev:' + projectId;
  var CONFIG_KEY = NS + ':config';
  // Single project-wide shared namespace (NOT per-viewer) — mirrors the real
  // `projectShared` table, which is shared across all viewers. In local dev
  // there's just one namespace holding a JSON object of key -> value.
  var SHARED_KEY = NS + ':shared';

  var MAX_VALUE_BYTES = 65536;            // matches server MAX_STORAGE_VALUE_BYTES
  var MAX_KEYS_PER_VIEWER = 100;          // matches server MAX_STORAGE_KEYS_PER_VIEWER
  var MAX_BYTES_PER_PROJECT = 10485760;   // matches server MAX_STORAGE_BYTES_PER_PROJECT
  var RESERVED_PREFIX = '__vibehub_';
  var KEY_PATTERN = /^[A-Za-z0-9._:/-]+$/;

  // Per-viewer prefix: vibehub-dev:<projectId>:viewer:<email>:<key>
  function viewerKey(email, key) {
    return NS + ':viewer:' + email + ':' + key;
  }
  function viewerKeyPrefix(email) {
    return NS + ':viewer:' + email + ':';
  }

  // Single source of truth for the per-viewer scoping discriminator used by
  // BOTH `data.*` (localStorage namespacing) and `images.*` (IndexedDB row
  // keys). Keeping them in lockstep means `data` writes can never collide
  // with `images` writes for the same key.
  function getViewerKey() {
    return viewerEmail;
  }

  // ---- 4. Optional reset --------------------------------------------------
  if (queryReset) {
    try {
      var toRemove = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf(NS + ':') === 0) toRemove.push(k);
      }
      toRemove.forEach(function (k) { localStorage.removeItem(k); });
      // eslint-disable-next-line no-console
      console.info('[vibehub-storage:dev] ?devReset=1 — wiped local storage for project "' + projectId + '"');
    } catch (_) { /* localStorage disabled */ }
  }

  // ---- 5. Helpers ---------------------------------------------------------
  function makeError(message, code, status) {
    var e = new Error(message);
    e.code = code;
    if (status) e.status = status;
    return e;
  }

  function rejectErr(message, code, status) {
    return Promise.reject(makeError(message, code, status));
  }

  function isValidKey(key) {
    if (typeof key !== 'string') return false;
    if (key.length < 1 || key.length > 256) return false;
    if (key.indexOf('\0') >= 0) return false;
    if (key.indexOf('..') >= 0) return false;
    return KEY_PATTERN.test(key);
  }

  function byteLength(str) {
    // UTF-8 byte length — the unit used for quota accounting (mirrors the
    // server's `size` field, which feeds the per-project byte budget).
    if (typeof TextEncoder !== 'undefined') {
      return new TextEncoder().encode(str).length;
    }
    return unescape(encodeURIComponent(str)).length;
  }

  // Azure Table string properties are UTF-16, so the real per-value ceiling is
  // 2 bytes per UTF-16 code unit. Mirrors `azureStoredByteLength` in
  // lib/projectStorageValidation.ts. Without this the shim would accept ~2x
  // what production can store, and a dev's app would break on deploy.
  function storedByteLength(str) {
    return str.length * 2;
  }

  function checkValueSize(serialized) {
    if (byteLength(serialized) > MAX_VALUE_BYTES) {
      return 'value exceeds ' + MAX_VALUE_BYTES + ' bytes (got ' + byteLength(serialized) + ')';
    }
    var stored = storedByteLength(serialized);
    if (stored > MAX_VALUE_BYTES) {
      return 'value exceeds ' + MAX_VALUE_BYTES + ' bytes when stored (got ' + stored +
        '); Azure Table strings are UTF-16, so the effective limit is ' +
        Math.floor(MAX_VALUE_BYTES / 2) + ' characters';
    }
    return null;
  }

  function listViewerKeys(email) {
    var prefix = viewerKeyPrefix(email);
    var out = [];
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf(prefix) === 0) {
        var bareKey = k.slice(prefix.length);
        if (bareKey.indexOf(RESERVED_PREFIX) !== 0) out.push(bareKey);
      }
    }
    out.sort();
    return out;
  }

  function projectTotalBytes() {
    var total = 0;
    var prefix = NS + ':viewer:';
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf(prefix) === 0) {
        total += byteLength(localStorage.getItem(k) || '');
      }
    }
    return total;
  }

  // ---- 6. Public-share short-circuit (synchronous) -----------------------
  function throwPublicShare() {
    throw makeError(
      'vibehub.storage.data is not available in public-share previews — log in to use storage',
      'PUBLIC_SHARE_BLOCKED'
    );
  }

  function throwImagesPublicShare() {
    throw makeError(
      'vibehub.storage.images is unavailable on public shares',
      'PUBLIC_SHARE_BLOCKED'
    );
  }

  function throwSharedPublicShare() {
    throw makeError(
      'vibehub.storage.shared is not available in public-share previews — log in to use storage',
      'PUBLIC_SHARE_BLOCKED'
    );
  }

  // ---- 7. Config API ------------------------------------------------------
  // The real script caches the GET promise. We do too, but only across a
  // single page load; localStorage IS the cache.
  var configPromise = null;
  // Holds the in-flight seed fetch (if any) so config.get() can await it.
  // Set by maybeSeedConfig(), which is called once at install time.
  var seedPromise = null;

  function getConfig() {
    if (configPromise) return configPromise;
    // Wait for the seed to complete before reading localStorage — otherwise
    // a get() right after page load would return null while the seed fetch
    // is still in flight, and the cached null would shadow the real config.
    configPromise = Promise.resolve(seedPromise).then(function () {
      var raw = localStorage.getItem(CONFIG_KEY);
      if (raw == null) return null;
      try { return JSON.parse(raw); }
      catch (_) { return null; }
    }).catch(function (err) {
      configPromise = null;
      throw err;
    });
    return configPromise;
  }

  // Auto-seed from a sibling vibehub.config.json. Runs on EVERY page load —
  // the JSON file is treated as the source of truth in local dev, so editing
  // it and reloading the page shows the new config immediately. We never set
  // a "seeded" sentinel because that would silently break the JSON-file-as-
  // source-of-truth contract (e.g., transient fetch failures would lock the
  // config forever). If the file isn't there, we leave whatever's in
  // localStorage alone (so devs can hand-poke values via devtools too).
  function maybeSeedConfig() {
    return fetch('vibehub.config.json', { credentials: 'omit', cache: 'no-store' })
      .then(function (res) {
        if (!res || !res.ok) return null;
        return res.text();
      })
      .then(function (text) {
        if (!text) return;
        var parsed;
        try {
          parsed = JSON.parse(text);
        } catch (_) {
          // eslint-disable-next-line no-console
          console.warn('[vibehub-storage:dev] vibehub.config.json is not valid JSON — skipping seed');
          return;
        }
        // Size-check and store the SERIALIZED form, exactly as production does
        // (`setProjectConfig` validates `JSON.stringify(parsed)`). Checking the
        // raw file text instead would reject pretty-printed configs whose
        // minified form fits comfortably under the cap.
        var normalized = JSON.stringify(parsed);
        if (checkValueSize(normalized)) {
          // eslint-disable-next-line no-console
          console.warn('[vibehub-storage:dev] vibehub.config.json is too large — skipping seed');
          return;
        }
        var prior = localStorage.getItem(CONFIG_KEY);
        if (prior === normalized) return; // no change, no noise
        localStorage.setItem(CONFIG_KEY, normalized);
        // eslint-disable-next-line no-console
        console.info('[vibehub-storage:dev] seeded config from vibehub.config.json');
      })
      .catch(function () {
        // File missing, network error, OR file:// origin blocking the fetch.
        // We can't tell them apart from inside fetch's opaque .catch — just
        // hint at the most common dev mistake.
        if (window.location.protocol === 'file:') {
          // eslint-disable-next-line no-console
          console.warn(
            '[vibehub-storage:dev] Browsers block fetch() on file:// origins, so vibehub.config.json could not be loaded. ' +
            'Run a local static server instead: `cd <project> && npx serve .` then open http://localhost:3000'
          );
        }
        /* otherwise: file missing or transient network error — keep existing config */
      });
  }

  // ---- 8. Data API (per-viewer) ------------------------------------------
  function dataGet(key) {
    return Promise.resolve().then(function () {
      if (!isValidKey(key)) throw makeError('invalid key: ' + key, 'INVALID_KEY', 400);
      var raw = localStorage.getItem(viewerKey(viewerEmail, key));
      if (raw == null) return null;
      try { return JSON.parse(raw); }
      catch (_) { return null; }
    });
  }

  function dataSet(key, value) {
    return Promise.resolve().then(function () {
      if (!isValidKey(key)) throw makeError('invalid key: ' + key, 'INVALID_KEY', 400);
      if (key.indexOf(RESERVED_PREFIX) === 0) {
        throw makeError(
          'key "' + key + '" uses reserved prefix "' + RESERVED_PREFIX + '"',
          'RESERVED_KEY',
          400
        );
      }

      var serialized;
      try { serialized = JSON.stringify(value); }
      catch (err) {
        throw makeError('value is not JSON-serializable: ' + err.message, 'INVALID_VALUE', 400);
      }
      if (serialized === undefined) {
        throw makeError('value cannot be undefined', 'INVALID_VALUE', 400);
      }
      var size = byteLength(serialized);
      var sizeErr = checkValueSize(serialized);
      if (sizeErr) {
        throw makeError(sizeErr, 'VALUE_TOO_LARGE', 413);
      }

      var fullKey = viewerKey(viewerEmail, key);
      var prior = localStorage.getItem(fullKey);
      var priorSize = prior == null ? 0 : byteLength(prior);
      var isNew = prior == null;

      // Per-viewer key cap (only counts non-reserved keys)
      if (isNew && key.indexOf(RESERVED_PREFIX) !== 0) {
        var existing = listViewerKeys(viewerEmail);
        if (existing.length >= MAX_KEYS_PER_VIEWER) {
          throw makeError(
            'viewer has ' + MAX_KEYS_PER_VIEWER + ' keys already',
            'KEY_LIMIT_REACHED',
            400
          );
        }
      }

      // Per-project byte cap
      var projectedTotal = projectTotalBytes() - priorSize + size;
      if (projectedTotal > MAX_BYTES_PER_PROJECT) {
        throw makeError(
          'project exceeds ' + MAX_BYTES_PER_PROJECT + ' bytes (would be ' + projectedTotal + ')',
          'PROJECT_QUOTA_EXCEEDED',
          400
        );
      }

      try { localStorage.setItem(fullKey, serialized); }
      catch (err) {
        // Out of localStorage quota (~5 MB per origin in most browsers)
        throw makeError(
          'localStorage write failed (likely browser quota): ' + err.message,
          'PROJECT_QUOTA_EXCEEDED',
          400
        );
      }

      return { ok: true, size: size, remaining: MAX_BYTES_PER_PROJECT - projectedTotal };
    });
  }

  function dataDelete(key) {
    return Promise.resolve().then(function () {
      if (!isValidKey(key)) throw makeError('invalid key: ' + key, 'INVALID_KEY', 400);
      localStorage.removeItem(viewerKey(viewerEmail, key));
      return null;
    });
  }

  function dataKeys() {
    return Promise.resolve(listViewerKeys(viewerEmail));
  }

  function dataAll() {
    return Promise.resolve().then(function () {
      var keys = listViewerKeys(viewerEmail);
      var out = {};
      for (var i = 0; i < keys.length; i++) {
        var raw = localStorage.getItem(viewerKey(viewerEmail, keys[i]));
        if (raw == null) continue;
        try { out[keys[i]] = JSON.parse(raw); }
        catch (_) { out[keys[i]] = null; }
      }
      return out;
    });
  }

  // ---- 8a. Shared API (project-wide, NOT per-viewer) ---------------------
  // Backed by a SINGLE localStorage namespace key (SHARED_KEY) holding a JSON
  // object of key -> value. The real store (`projectShared` table) is shared
  // across ALL viewers; in local dev there's just one namespace, so there is
  // no viewer dimension here. Client-side validation (key validity + 64 KB
  // value cap) mirrors `data.*` for parity.
  function readSharedStore() {
    var raw = localStorage.getItem(SHARED_KEY);
    if (raw == null) return {};
    try {
      var parsed = JSON.parse(raw);
      return (parsed && typeof parsed === 'object') ? parsed : {};
    } catch (_) { return {}; }
  }

  function writeSharedStore(store) {
    try { localStorage.setItem(SHARED_KEY, JSON.stringify(store)); }
    catch (err) {
      throw makeError(
        'localStorage write failed (likely browser quota): ' + err.message,
        'PROJECT_QUOTA_EXCEEDED',
        400
      );
    }
  }

  function sharedGet(key) {
    return Promise.resolve().then(function () {
      if (!isValidKey(key)) throw makeError('invalid key: ' + key, 'INVALID_KEY', 400);
      var store = readSharedStore();
      // Model the production route's found/missing result internally, including
      // a present JSON null, while preserving the public `value | null` API.
      var response = Object.prototype.hasOwnProperty.call(store, key)
        ? { found: true, value: store[key] }
        : { found: false, value: null };
      return response.found ? response.value : null;
    });
  }

  function sharedSet(key, value) {
    return Promise.resolve().then(function () {
      if (!isValidKey(key)) throw makeError('invalid key: ' + key, 'INVALID_KEY', 400);

      var serialized;
      try { serialized = JSON.stringify(value); }
      catch (err) {
        throw makeError('value is not JSON-serializable: ' + err.message, 'INVALID_VALUE', 400);
      }
      if (serialized === undefined) {
        throw makeError('value cannot be undefined', 'INVALID_VALUE', 400);
      }
      var size = byteLength(serialized);
      var sizeErr = checkValueSize(serialized);
      if (sizeErr) {
        throw makeError(sizeErr, 'VALUE_TOO_LARGE', 413);
      }

      var store = readSharedStore();
      store[key] = JSON.parse(serialized);
      writeSharedStore(store);
      return { ok: true, size: size };
    });
  }

  function sharedDelete(key) {
    return Promise.resolve().then(function () {
      if (!isValidKey(key)) throw makeError('invalid key: ' + key, 'INVALID_KEY', 400);
      var store = readSharedStore();
      if (Object.prototype.hasOwnProperty.call(store, key)) {
        delete store[key];
        writeSharedStore(store);
      }
      return null;
    });
  }

  function sharedKeys() {
    return Promise.resolve().then(function () {
      var store = readSharedStore();
      var out = Object.keys(store);
      out.sort();
      return out;
    });
  }

  function sharedAll() {
    return Promise.resolve().then(function () {
      return readSharedStore();
    });
  }

  // ---- 8b. Images API (per-viewer, IndexedDB-backed) ---------------------
  // Shape-compatible with the production helper script's `storage.images`:
  //   set(key, blob) -> { key, url, contentType, size, updatedAt }
  //   get(key)       -> same shape | null
  //   delete(key)    -> void
  //   keys()         -> string[]   (alphabetical, hides reserved prefix)
  //   list()         -> entries[]  (same shape as get(), alphabetical)
  //
  // Per-viewer/per-project byte caps are intentionally NOT enforced in dev
  // (per the file's "skip quotas for dev convenience" principle) but we DO
  // enforce a per-image cap so devs hit it early instead of pushing 200 MB
  // PNGs into IndexedDB.
  var IMAGES_DB_NAME = NS + ':images';
  var IMAGES_STORE = 'images';
  var MAX_IMAGE_BYTES = 20 * 1024 * 1024; // 20 MB
  var ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

  // Module-level singletons (one DB + URL cache per page load).
  var imagesDbPromise = null;
  var imageUrlCache = new Map(); // rowKey -> blob: URL
  var fileProtocolImagesWarned = false;

  function imageRowKey(viewer, key) {
    return viewer + '|' + key;
  }

  function openImagesDb() {
    if (imagesDbPromise) return imagesDbPromise;
    imagesDbPromise = new Promise(function (resolve, reject) {
      if (typeof indexedDB === 'undefined') {
        reject(makeError('IndexedDB is not available in this environment', 'INDEXEDDB_UNAVAILABLE'));
        return;
      }
      var req = indexedDB.open(IMAGES_DB_NAME, 1);
      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains(IMAGES_STORE)) {
          db.createObjectStore(IMAGES_STORE, { keyPath: 'rowKey' });
        }
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () {
        reject(req.error || makeError('failed to open IndexedDB', 'INDEXEDDB_ERROR'));
      };
      req.onblocked = function () {
        reject(makeError('IndexedDB open blocked by another connection', 'INDEXEDDB_BLOCKED'));
      };
    }).catch(function (err) {
      imagesDbPromise = null; // allow retry on transient failure
      throw err;
    });
    return imagesDbPromise;
  }

  function toImageResult(entry, opts) {
    var url = imageUrlCache.get(entry.rowKey);
    if (!url) {
      url = URL.createObjectURL(entry.blob);
      imageUrlCache.set(entry.rowKey, url);
    }
    var out = {
      key: entry.imageKey,
      url: url,
      contentType: entry.contentType,
      size: entry.size,
      updatedAt: entry.updatedAt,
      isPublic: !!entry.isPublic,
    };
    // listPublic decorates each row with the uploader's email so consumers
    // can attribute "posted by alice@…". Pulled from the stored `viewerKey`
    // column (set on every put — see imagesSet/imagesSetPublic).
    if (opts && opts.includeViewerEmail) {
      out.viewerEmail = entry.viewerKey || (entry.rowKey || '').split('|')[0] || '';
    }
    return out;
  }

  function revokeCachedUrl(rowKey) {
    var url = imageUrlCache.get(rowKey);
    if (url) {
      try { URL.revokeObjectURL(url); } catch (_) { /* ignore */ }
      imageUrlCache.delete(rowKey);
    }
  }

  function imagesGet(key) {
    return Promise.resolve().then(function () {
      if (!isValidKey(key)) throw makeError('invalid key: ' + key, 'INVALID_KEY', 400);
      return openImagesDb();
    }).then(function (db) {
      var rowKey = imageRowKey(getViewerKey(), key);
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(IMAGES_STORE, 'readonly');
        var req = tx.objectStore(IMAGES_STORE).get(rowKey);
        req.onsuccess = function () { resolve(req.result || null); };
        req.onerror = function () { reject(req.error); };
      });
    }).then(function (entry) {
      if (!entry) return null;
      return toImageResult(entry);
    });
  }

  function imagesSet(key, blob, opts) {
    // Synchronous validation — mirrors production behavior so callers can
    // wrap in try/catch and immediately know if the call will land.
    if (!isValidKey(key)) throw makeError('invalid key: ' + key, 'INVALID_KEY', 400);
    if (key.indexOf(RESERVED_PREFIX) === 0) {
      throw makeError(
        'key "' + key + '" uses reserved prefix "' + RESERVED_PREFIX + '"',
        'RESERVED_KEY',
        400
      );
    }
    if (typeof Blob === 'undefined' || !(blob instanceof Blob)) {
      throw new TypeError('vibehub.storage.images.set: value must be a Blob or File');
    }
    if (blob.size === 0) {
      throw makeError('image blob is empty', 'INVALID_VALUE', 400);
    }
    if (blob.size > MAX_IMAGE_BYTES) {
      throw makeError(
        'image exceeds ' + MAX_IMAGE_BYTES + ' bytes (got ' + blob.size + ')',
        'VALUE_TOO_LARGE',
        413
      );
    }
    var contentType = blob.type || '';
    if (ALLOWED_IMAGE_TYPES.indexOf(contentType) < 0) {
      throw makeError(
        'image MIME type "' + contentType + '" is not allowed — must be one of: ' +
          ALLOWED_IMAGE_TYPES.join(', '),
        'INVALID_CONTENT_TYPE',
        400
      );
    }

    // Whether the caller explicitly opted into / out of public — controls
    // whether we preserve the existing flag on overwrite or set a new one.
    var explicitPublic = !!(opts && typeof opts === 'object' &&
      Object.prototype.hasOwnProperty.call(opts, 'public'));
    var requestedPublic = explicitPublic ? !!opts.public : false;

    // file:// gotcha — one-shot warning, same pattern as the seed-fetch warning.
    if (!fileProtocolImagesWarned && window.location && window.location.protocol === 'file:') {
      fileProtocolImagesWarned = true;
      try {
        // eslint-disable-next-line no-console
        console.warn(
          '[vibehub-storage:dev] IndexedDB on file:// is unreliable across browsers. ' +
          'Run a local server instead: npx serve .'
        );
      } catch (_) { /* console missing */ }
    }

    return openImagesDb().then(function (db) {
      var viewer = getViewerKey();
      var rowKey = imageRowKey(viewer, key);
      // Look up the prior entry so we can preserve `isPublic` on overwrite
      // when the caller didn't pass `opts.public` — mirrors the server's
      // "header omitted = keep existing flag" semantics.
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(IMAGES_STORE, 'readonly');
        var req = tx.objectStore(IMAGES_STORE).get(rowKey);
        req.onsuccess = function () { resolve(req.result || null); };
        req.onerror = function () { reject(req.error); };
      }).then(function (prior) {
        var isPublic;
        if (explicitPublic) {
          isPublic = requestedPublic;
        } else if (prior) {
          isPublic = !!prior.isPublic;
        } else {
          isPublic = false; // new row default
        }
        var entry = {
          rowKey: rowKey,
          viewerKey: viewer,
          imageKey: key,
          blob: blob,
          contentType: contentType,
          size: blob.size,
          updatedAt: new Date().toISOString(),
          isPublic: isPublic,
        };
        return new Promise(function (resolve, reject) {
          var tx = db.transaction(IMAGES_STORE, 'readwrite');
          tx.objectStore(IMAGES_STORE).put(entry);
          tx.oncomplete = function () {
            // Overwrites invalidate the prior blob URL (underlying Blob is now
            // gone). Revoke BEFORE we mint a fresh one in toImageResult().
            revokeCachedUrl(rowKey);
            resolve(toImageResult(entry));
          };
          tx.onerror = function () { reject(tx.error); };
          tx.onabort = function () { reject(tx.error); };
        });
      });
    });
  }

  function imagesDelete(key) {
    return Promise.resolve().then(function () {
      if (!isValidKey(key)) throw makeError('invalid key: ' + key, 'INVALID_KEY', 400);
      return openImagesDb();
    }).then(function (db) {
      var rowKey = imageRowKey(getViewerKey(), key);
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(IMAGES_STORE, 'readwrite');
        tx.objectStore(IMAGES_STORE).delete(rowKey);
        tx.oncomplete = function () {
          revokeCachedUrl(rowKey);
          resolve();
        };
        tx.onerror = function () { reject(tx.error); };
        tx.onabort = function () { reject(tx.error); };
      });
    });
  }

  function imagesList() {
    return openImagesDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        var viewer = getViewerKey();
        var prefix = viewer + '|';
        // rowKey is `${viewerKey}|${imageKey}` — bound range gives us a clean
        // per-viewer scan without touching other viewers' rows.
        var range = IDBKeyRange.bound(prefix, prefix + '\uffff', false, true);
        var tx = db.transaction(IMAGES_STORE, 'readonly');
        var req = tx.objectStore(IMAGES_STORE).openCursor(range);
        var out = [];
        req.onsuccess = function () {
          var cursor = req.result;
          if (cursor) {
            var entry = cursor.value;
            if (entry.imageKey.indexOf(RESERVED_PREFIX) !== 0) {
              out.push(toImageResult(entry));
            }
            cursor.continue();
          } else {
            out.sort(function (a, b) {
              return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
            });
            resolve(out);
          }
        };
        req.onerror = function () { reject(req.error); };
      });
    });
  }

  function imagesKeys() {
    return imagesList().then(function (list) {
      return list.map(function (e) { return e.key; });
    });
  }

  // Flip the public flag on an existing image owned by the current dev viewer
  // without re-uploading bytes. Mirrors production's PATCH /images/[key].
  // Rejects with IMAGE_NOT_FOUND (mirrors server 404) if the key isn't owned
  // by this viewer.
  function imagesSetPublic(key, isPublic) {
    return Promise.resolve().then(function () {
      if (!isValidKey(key)) throw makeError('invalid key: ' + key, 'INVALID_KEY', 400);
      return openImagesDb();
    }).then(function (db) {
      var viewer = getViewerKey();
      var rowKey = imageRowKey(viewer, key);
      // Two-step within one rw transaction: get → mutate → put. We resolve on
      // tx.oncomplete (mirrors imagesDelete) so the write is durable before
      // the caller's continuation runs.
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(IMAGES_STORE, 'readwrite');
        var store = tx.objectStore(IMAGES_STORE);
        var updated = null;
        var getReq = store.get(rowKey);
        getReq.onsuccess = function () {
          var entry = getReq.result;
          if (!entry) {
            // Trigger the not-found rejection AFTER the transaction settles
            // so we don't leak an open tx. Aborting is the cleanest signal.
            tx.abort();
            reject(makeError(
              'image "' + key + '" not found for viewer ' + viewer,
              'IMAGE_NOT_FOUND',
              404
            ));
            return;
          }
          entry.isPublic = !!isPublic;
          entry.updatedAt = new Date().toISOString();
          updated = entry;
          store.put(entry);
        };
        getReq.onerror = function () { reject(getReq.error); };
        tx.oncomplete = function () {
          if (updated) resolve(toImageResult(updated));
        };
        tx.onerror = function () { reject(tx.error); };
        tx.onabort = function () {
          // The NOT_FOUND branch above already rejected and then called
          // tx.abort() to release the transaction — extra reject() is a
          // no-op (first settle wins). For unexpected aborts, surface error.
          reject(tx.error || makeError('aborted', 'INDEXEDDB_ERROR'));
        };
      });
    });
  }

  // Cross-viewer scan: return every public image in the project regardless of
  // who uploaded it. Pagination uses a simple offset slice — `continuationToken`
  // is accepted for API parity with production but ignored (dev datasets are
  // small enough that a full scan is fine).
  function imagesListPublic(opts) {
    var pageSize = (opts && opts.pageSize != null) ? Number(opts.pageSize) : 50;
    if (!isFinite(pageSize) || pageSize <= 0) pageSize = 50;
    return openImagesDb().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(IMAGES_STORE, 'readonly');
        // No range filter here — we walk every row across all viewers and
        // filter on `isPublic`. Reserved-prefix keys are still hidden.
        var req = tx.objectStore(IMAGES_STORE).openCursor();
        var out = [];
        req.onsuccess = function () {
          var cursor = req.result;
          if (cursor) {
            var entry = cursor.value;
            if (entry.isPublic && entry.imageKey.indexOf(RESERVED_PREFIX) !== 0) {
              out.push(toImageResult(entry, { includeViewerEmail: true }));
            }
            cursor.continue();
          } else {
            // Stable order so paginate-by-offset is deterministic across
            // calls: viewer ASC, then key ASC.
            out.sort(function (a, b) {
              var av = a.viewerEmail || '';
              var bv = b.viewerEmail || '';
              if (av !== bv) return av < bv ? -1 : 1;
              return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
            });
            resolve({ items: out.slice(0, pageSize) });
          }
        };
        req.onerror = function () { reject(req.error); };
      });
    });
  }

  // ---- 9. Wire up window.vibehub.storage ---------------------------------
  window.vibehub = window.vibehub || {};

  var api = {
    config: { get: getConfig },
    data: {},
    shared: {},
    images: {},
    isPublicShare: isPublicShare,
    projectId: projectId,
    viewerEmail: viewerEmail,
  };

  if (isPublicShare) {
    api.data.get = throwPublicShare;
    api.data.set = throwPublicShare;
    api.data.delete = throwPublicShare;
    api.data.keys = throwPublicShare;
    api.data.all = throwPublicShare;

    api.shared.get = throwSharedPublicShare;
    api.shared.set = throwSharedPublicShare;
    api.shared.delete = throwSharedPublicShare;
    api.shared.keys = throwSharedPublicShare;
    api.shared.all = throwSharedPublicShare;

    api.images.get = throwImagesPublicShare;
    api.images.set = throwImagesPublicShare;
    api.images.delete = throwImagesPublicShare;
    api.images.keys = throwImagesPublicShare;
    api.images.list = throwImagesPublicShare;
    api.images.setPublic = throwImagesPublicShare;
    api.images.listPublic = throwImagesPublicShare;
  } else {
    api.data.get = dataGet;
    api.data.set = dataSet;
    api.data.delete = dataDelete;
    api.data.keys = dataKeys;
    api.data.all = dataAll;

    api.shared.get = sharedGet;
    api.shared.set = sharedSet;
    api.shared.delete = sharedDelete;
    api.shared.keys = sharedKeys;
    api.shared.all = sharedAll;

    api.images.get = imagesGet;
    api.images.set = imagesSet;
    api.images.delete = imagesDelete;
    api.images.keys = imagesKeys;
    api.images.list = imagesList;
    api.images.setPublic = imagesSetPublic;
    api.images.listPublic = imagesListPublic;
  }

  window.vibehub.storage = api;

  // ---- 10. Kick off optional config seed ---------------------------------
  // Assign to the module-level `seedPromise` so config.get() can await it.
  seedPromise = maybeSeedConfig();

  // ---- 11. One-line banner so devs know they're on the shim --------------
  try {
    // eslint-disable-next-line no-console
    console.info(
      '%c[vibehub-storage:dev]%c active — projectId=' + projectId +
      ', viewer=' + (viewerEmail || '(public-share)') +
      '. Production no-ops this script.',
      'color:#7c3aed;font-weight:bold',
      'color:inherit'
    );
  } catch (_) { /* console missing */ }
})();
