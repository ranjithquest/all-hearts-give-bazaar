// Shows a spinner on photos while they load and a placeholder if they fail.
(() => {
  const BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  const STATIC_ART = /\.(png|svg|gif|webp)(\?|#|$)/i;

  function skip(img) {
    const src = img.getAttribute("src") || "";
    if (!src || src === BLANK || src.startsWith("data:") || src.startsWith("blob:")) return true;
    // Avatars fall back to initials, and transparent artwork shouldn't get a box behind it.
    if (img.hasAttribute("onerror") || img.closest("[data-no-img-loader]")) return true;
    return !src.startsWith("/api/") && !/^https?:/i.test(src) && STATIC_ART.test(src);
  }

  function fail(img) {
    img.classList.remove("is-img-loading");
    img.classList.add("is-img-broken");
    img.dataset.failedSrc = img.getAttribute("src") || "";
    img.src = BLANK;
  }

  function watch(img) {
    if (img.tagName !== "IMG") return;
    if (skip(img)) {
      if (img.getAttribute("src") !== BLANK) img.classList.remove("is-img-loading", "is-img-broken");
      return;
    }
    img.classList.remove("is-img-broken");
    if (img.complete) {
      if (!img.naturalWidth) fail(img);
      else img.classList.remove("is-img-loading");
      return;
    }
    img.classList.add("is-img-loading");
  }

  document.addEventListener("load", (event) => {
    const img = event.target;
    if (img.tagName === "IMG" && img.getAttribute("src") !== BLANK) img.classList.remove("is-img-loading");
  }, true);
  document.addEventListener("error", (event) => {
    const img = event.target;
    if (img.tagName === "IMG" && !skip(img)) fail(img);
  }, true);

  function scan(root) {
    if (root.tagName === "IMG") watch(root);
    root.querySelectorAll?.("img").forEach(watch);
  }

  new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === "attributes") watch(m.target);
      else m.addedNodes.forEach((node) => node.nodeType === 1 && scan(node));
    }
  }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["src"] });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => scan(document));
  else scan(document);
})();

// Avatar photos occasionally fail to load once; retry before falling back to initials.
window.avatarRetry = (img) => {
  const n = Number(img.dataset.retry || 0);
  if (n >= 2) { img.remove(); return; }
  img.dataset.retry = n + 1;
  const base = img.src.split("?")[0];
  setTimeout(() => { img.src = `${base}?r=${n + 1}`; }, 1200 * (n + 1));
};
