const LOT_KEY_PREFIX = "give-bazaar-lot-";
const DRAFT_KEY = "give-bazaar-draft";
const STORAGE_REFRESH_INTERVAL = 30000;
const LOT_LIMIT = 15;

const categoryDetails = {
  experiences: { label: "Experiences", glyph: "🎨", color: "#ff8a7f" },
  services: { label: "Services & skills", glyph: "🛠", color: "#f7ca45" },
  products: { label: "Art & products", glyph: "✎", color: "#8bb6ee" },
  food: { label: "Food & culture", glyph: "🍱", color: "#a7e5cb" },
  leadership: { label: "Leadership", glyph: "☕", color: "#f7a55c" },
  travel: { label: "Travel & getaways", glyph: "🧳", color: "#eba7bc" }
};

const seedContributions = [
  {
    id: "seed-1",
    title: "A private design-led home tour",
    category: "experiences",
    type: "Experience",
    city: "Hyderabad",
    description: "An intimate walkthrough of a thoughtfully designed home, its objects, stories and creative decisions.",
    contributor: "Nithin Ismail",
    quantity: 4,
    duration: "90 minutes",
    availability: "",
    logistics: "Hosted in Hyderabad on a mutually agreed weekend.",
    image: "",
    link: "",
    email: "",
    avatarEmail: "nithin.ismail@microsoft.com",
    status: "approved",
    isExample: true,
    createdAt: "2026-10-01T10:00:00.000Z"
  },
  {
    id: "seed-2",
    title: "Linocut workshop for three",
    category: "experiences",
    type: "Experience",
    city: "Hyderabad",
    description: "Learn the basics of carving, inking and printing a small linocut—and take your handmade print home.",
    contributor: "Vartika Agarwal",
    quantity: 3,
    duration: "2 hours",
    availability: "",
    logistics: "Materials included. Date to be agreed with the winners.",
    image: "",
    link: "",
    email: "",
    avatarEmail: "varagarwal@microsoft.com",
    status: "approved",
    isExample: true,
    createdAt: "2026-10-02T10:00:00.000Z"
  },
  {
    id: "seed-3",
    title: "Basavanagudi story walk",
    category: "travel",
    type: "Experience",
    city: "Bengaluru",
    description: "A guided neighbourhood walk through old Bengaluru, with architecture, local stories and a memorable snack stop.",
    contributor: "Mohan Kumar",
    quantity: 6,
    duration: "2.5 hours",
    availability: "",
    logistics: "Weekend morning. Participants meet at the starting point.",
    image: "",
    link: "",
    email: "",
    avatarEmail: "mgangappa@microsoft.com",
    status: "approved",
    isExample: true,
    createdAt: "2026-10-03T10:00:00.000Z"
  },
  {
    id: "seed-4",
    title: "Dinner at Ankur’s",
    category: "food",
    type: "Experience",
    city: "Noida",
    description: "A warm home-cooked dinner, generous conversation and an evening designed to feel like a gathering of old friends.",
    contributor: "Ankur Jhawar",
    quantity: 4,
    duration: "An evening",
    availability: "",
    logistics: "Hosted in Noida on a mutually agreed date.",
    image: "",
    link: "",
    email: "",
    avatarEmail: "ankur.jhawar@microsoft.com",
    status: "approved",
    isExample: true,
    createdAt: "2026-10-04T10:00:00.000Z"
  },
  {
    id: "seed-5",
    title: "Hand-bound A5 sketchbook",
    category: "products",
    type: "Physical item",
    city: "Hyderabad",
    description: "A one-of-a-kind handmade sketchbook with carefully selected paper, made for daily observations and ideas.",
    contributor: "Soumya Kasuganti",
    quantity: 1,
    duration: "",
    availability: "",
    logistics: "Can be handed over at the Hyderabad office.",
    image: "",
    link: "",
    email: "",
    avatarEmail: "skasuganti@microsoft.com",
    status: "approved",
    isExample: true,
    createdAt: "2026-10-05T10:00:00.000Z"
  },
  {
    id: "seed-6",
    title: "Original mixed-media painting",
    category: "products",
    type: "Physical item",
    city: "Bengaluru",
    description: "A vivid original artwork on canvas, slightly larger than A2, ready to become the centrepiece of a room.",
    contributor: "Sunanda Sahu",
    quantity: 1,
    duration: "",
    availability: "",
    logistics: "Pickup from the Bengaluru office or local delivery by arrangement.",
    image: "",
    link: "",
    email: "",
    avatarEmail: "sunandasahu@microsoft.com",
    status: "approved",
    isExample: true,
    createdAt: "2026-10-06T10:00:00.000Z"
  },
  {
    id: "seed-7",
    title: "Rare Indian aircraft photo prints",
    category: "products",
    type: "Physical item",
    city: "Noida",
    description: "A curated set of high-resolution prints featuring rare captures and stories of Indian military aircraft.",
    contributor: "Eemon Roy",
    quantity: 2,
    duration: "",
    availability: "",
    logistics: "Prints will be shipped to the winner.",
    image: "",
    link: "",
    email: "",
    avatarEmail: "eemonroy@microsoft.com",
    status: "approved",
    isExample: true,
    createdAt: "2026-10-07T10:00:00.000Z"
  },
  {
    id: "seed-8",
    title: "Coffee and a candid career conversation",
    category: "leadership",
    type: "Experience",
    city: "Remote",
    description: "An open one-to-one conversation about career choices, leadership, creative work—or anything under the sun.",
    contributor: "Ankur Jhawar",
    quantity: 3,
    duration: "45 minutes",
    availability: "",
    logistics: "Three separate sessions, online or in person where possible.",
    image: "",
    link: "",
    email: "",
    avatarEmail: "ankur.jhawar@microsoft.com",
    status: "approved",
    isExample: true,
    createdAt: "2026-10-08T10:00:00.000Z"
  },
  {
    id: "seed-9",
    title: "Portfolio review with a design leader",
    category: "services",
    type: "Service",
    city: "Remote",
    description: "A focused critique of your portfolio narrative, craft and presentation—with practical next steps.",
    contributor: "Studio+91 Leader",
    quantity: 2,
    duration: "60 minutes",
    availability: "",
    logistics: "Remote session on Teams.",
    image: "",
    link: "",
    email: "",
    status: "approved",
    isExample: true,
    createdAt: "2026-10-09T10:00:00.000Z"
  },
  {
    id: "seed-10",
    title: "A set of velvet-paper postcards",
    category: "products",
    type: "Physical item",
    city: "Hyderabad",
    description: "Four beautifully printed art postcards on tactile velvet paper—two complete sets are available.",
    contributor: "Ravi Tej Srireddy",
    quantity: 2,
    duration: "",
    availability: "",
    logistics: "Pickup at the Hyderabad office.",
    image: "",
    link: "",
    email: "",
    status: "approved",
    isExample: true,
    createdAt: "2026-10-10T10:00:00.000Z"
  },
  {
    id: "seed-11",
    title: "Hand-poured scented candle",
    category: "products",
    type: "Physical item",
    city: "Bengaluru",
    description: "A small-batch candle, handmade with a warm botanical fragrance and packed for gifting.",
    contributor: "Priya",
    quantity: 1,
    duration: "",
    availability: "",
    logistics: "Pickup from the Bengaluru office.",
    image: "",
    link: "",
    email: "",
    status: "approved",
    isExample: true,
    createdAt: "2026-10-11T10:00:00.000Z"
  },
  {
    id: "seed-12",
    title: "Personalised weekend itinerary",
    category: "travel",
    type: "Service",
    city: "Remote",
    description: "A custom two-day itinerary built around your interests, pace, food preferences and travel style.",
    contributor: "Studio+91 Explorer",
    quantity: 2,
    duration: "45-minute planning call",
    availability: "",
    logistics: "Delivered digitally after a short discovery call.",
    image: "",
    link: "",
    email: "",
    status: "approved",
    isExample: true,
    createdAt: "2026-10-12T10:00:00.000Z"
  }
];

const seedStartingBids = [2256, 1000, 800, 1500, 1500, 5000, 2169, 3000, 1200, 1499, 900, 1000];
seedContributions.forEach((item, index) => {
  item.lotNumber = index + 1;
  item.startingBid = seedStartingBids[index];
});

const elements = {
  tableBody: document.querySelector("#contributionTableBody"),
  entryHolder: document.querySelector("#entryCardHolder"),
  tableWrap: document.querySelector("#contributionTableWrap"),
  lotCapacity: document.querySelector("#lotCapacity"),
  lotCapacityText: document.querySelector("#lotCapacityText"),
  lotCapacityNote: document.querySelector("#lotCapacityNote"),
  lotCapacityBar: document.querySelector("#lotCapacityBar"),
  emptyState: document.querySelector("#emptyState"),
  cityFilterChips: document.querySelectorAll("[data-city-filter]"),
  storageBanner: document.querySelector("#storageBanner"),
  contributionDialog: document.querySelector("#contributionDialog"),
  successDialog: document.querySelector("#successDialog"),
  adminDialog: document.querySelector("#adminDialog"),
  auctionDialog: document.querySelector("#auctionDialog"),
  form: document.querySelector("#contributionForm"),
  nextButton: document.querySelector("#nextButton"),
  backButton: document.querySelector("#backButton"),
  submitButton: document.querySelector("#submitButton"),
  formError: document.querySelector("#formError"),
  description: document.querySelector("#description"),
  descriptionCount: document.querySelector("#descriptionCount"),
  imageInput: document.querySelector("#image"),
  imagePreview: document.querySelector("#imagePreview"),
  uploadLabel: document.querySelector("#uploadLabel"),
  adminList: document.querySelector("#adminList"),
  approvedCount: document.querySelector("#approvedCount"),
  pendingCount: document.querySelector("#pendingCount"),
  totalCount: document.querySelector("#totalCount"),
  toast: document.querySelector("#toast"),
  countdownDays: document.querySelector("#countdownDays"),
  auctionProgress: document.querySelector("#auctionProgress"),
  auctionVisual: document.querySelector("#auctionVisual"),
  auctionLotNumber: document.querySelector("#auctionLotNumber"),
  auctionGlyph: document.querySelector("#auctionGlyph"),
  auctionImage: document.querySelector("#auctionImage"),
  auctionTitle: document.querySelector("#auctionTitle"),
  auctionContributor: document.querySelector("#auctionContributor"),
  auctionDescription: document.querySelector("#auctionDescription"),
  auctionLocation: document.querySelector("#auctionLocation"),
  auctionQuantity: document.querySelector("#auctionQuantity"),
  auctionStartingBid: document.querySelector("#auctionStartingBid"),
  auctionBidFormat: document.querySelector("#auctionBidFormat"),
  auctionPrevious: document.querySelector("#auctionPrevious"),
  auctionNext: document.querySelector("#auctionNext"),
  auctionStartTimer: document.querySelector("#auctionStartTimer"),
  auctionSeconds: document.querySelector("#auctionSeconds")
};

let contributions = structuredClone(seedContributions);
let boardLoading = true;
let currentStep = 1;
let pendingImage = "";
let toastTimer;
let auctionIndex = 0;
let auctionSeconds = 40;
let auctionTimerId = null;
let auctionPreviewItems = null;
let inlineEntryOpen = true;
let editingDraftId = null;
let editingLiveLot = false;
let inlineDraftValues = null;
let inlineImages = [];
let inlineImagesBusy = false;
const MAX_LOT_IMAGES = 4;
let activeCity = "all";
let vibeStorage = null;
let viewerEmail = "";
let viewerName = "";
let storageReadOnly = false;
let storageRefreshTimer = null;
let storageRefreshRunning = false;
let storageLastError = null;

function formatViewerName(email) {
  if (!email) return "";
  return email
    .replace(/@.*$/, "")
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function setStorageBanner(message = "") {
  elements.storageBanner.textContent = message;
  elements.storageBanner.hidden = !message;
}

function storageErrorMessage(error, action) {
  if (error?.code === "LOTS_FULL") {
    return `All ${LOT_LIMIT} items are filled. Thank you for wanting to give!`;
  }
  if (error?.code === "PUBLIC_SHARE_BLOCKED") {
    return "Sign in with your Microsoft account to add or update an item.";
  }
  if (error?.code === "STORAGE_NOT_ENABLED") {
    return "Project Storage is not enabled yet. Turn it on in VibeHub Edit Project → Storage.";
  }
  if (error?.code === "RATE_LIMITED") {
    const seconds = Math.max(1, Math.ceil((error.retryAfterMs || 1000) / 1000));
    return `VibeHub is busy. Try ${action} again in ${seconds} seconds.`;
  }
  if (error?.code === "VALUE_TOO_LARGE" || error?.code === "PROJECT_QUOTA_EXCEEDED") {
    return "This contribution is too large for VibeHub storage. Remove the image or shorten the details.";
  }
  return `VibeHub could not ${action}. Please try again.`;
}

function contributionKey(id) {
  return `${LOT_KEY_PREFIX}${id}`;
}

function normalizeContribution(item) {
  if (!item || typeof item !== "object" || !item.id) return null;
  return {
    ...item,
    startingBid: Number(item.startingBid || 500),
    quantity: Number(item.quantity || 1),
    isExample: false,
    lotNumber: item.lotNumber ?? null
  };
}

async function readSharedContributions() {
  const sharedValues = await vibeStorage.shared.all();
  return Object.entries(sharedValues)
    .filter(([key]) => key.startsWith(LOT_KEY_PREFIX))
    .map(([, value]) => normalizeContribution(value))
    .filter(Boolean);
}

function mergeStoredContributions(sharedContributions, draft) {
  const sharedIds = new Set(sharedContributions.map((item) => item.id));
  const viewerDraft = normalizeContribution(draft);
  contributions = [
    ...sharedContributions,
    ...structuredClone(seedContributions)
  ];
}

async function refreshStoredContributions({ showError = false } = {}) {
  if (!vibeStorage || storageReadOnly || storageRefreshRunning || document.hidden) return false;
  storageRefreshRunning = true;
  try {
    const [sharedContributions, draft] = await Promise.all([
      readSharedContributions(),
      vibeStorage.data.get(DRAFT_KEY).catch(() => null)
    ]);
    mergeStoredContributions(sharedContributions, draft);
    boardLoading = false;
    renderBoard();
    renderAdmin();
    storageLastError = null;
    return true;
  } catch (error) {
    console.error("Could not refresh VibeHub contributions.", error);
    storageLastError = error;
    if (showError) showToast(storageErrorMessage(error, "refresh the sign-up board"));
    return false;
  } finally {
    storageRefreshRunning = false;
  }
}

function scheduleStorageRefresh() {
  clearTimeout(storageRefreshTimer);
  if (!storageReadOnly && !document.hidden) {
    storageRefreshTimer = setTimeout(async () => {
      await refreshStoredContributions();
      scheduleStorageRefresh();
    }, STORAGE_REFRESH_INTERVAL);
  }
}

async function initializeStorage() {
  vibeStorage = window.vibehub?.storage || null;
  if (!vibeStorage) {
    storageReadOnly = true;
    inlineEntryOpen = false;
    setStorageBanner("VibeHub storage is unavailable. The board is temporarily read-only.");
    renderBoard();
    return;
  }

  viewerEmail = vibeStorage.viewerEmail || "";
  viewerName = formatViewerName(viewerEmail);
  const rosterMatch = STUDIO_ROSTER.find(([, alias]) => alias === viewerEmail.split("@")[0].toLowerCase());
  if (rosterMatch) viewerName = rosterMatch[0];
  fetch("/api/me").then((r) => (r.ok ? r.json() : null)).then((me) => {
    if (me?.name && me.email?.toLowerCase() === viewerEmail.toLowerCase() && me.name !== viewerName) {
      viewerName = me.name;
      renderBoard();
    }
  }).catch(() => {});
  if (vibeStorage.isPublicShare || !viewerEmail) {
    storageReadOnly = true;
    inlineEntryOpen = false;
    setStorageBanner("This public view is read-only. Open the internal VibeHub link and sign in to contribute.");
    renderBoard();
    return;
  }

  try {
    const ready = await refreshStoredContributions({ showError: true });
    if (!ready) {
      storageReadOnly = true;
      inlineEntryOpen = false;
      setStorageBanner(storageErrorMessage(storageLastError, "load the sign-up board"));
      renderBoard();
      return;
    }
    scheduleStorageRefresh();
    try {
      const home = await vibeStorage.data.get(HOME_CITY_KEY);
      if (LOT_CITIES.includes(home) && !savedHomeCity) {
        savedHomeCity = home;
        const cityField = elements.entryHolder.querySelector('[data-inline-field="city"]');
        if (cityField && !editingLiveLot && cityField.form?.querySelector('[data-inline-field="contributorMode"]')?.value !== "team") {
          if (inlineDraftValues) inlineDraftValues.city = home;
          cityField.value = home;
          renderBoard();
        }
      }
    } catch {}
  } catch (error) {
    console.error("Could not initialize VibeHub storage.", error);
    storageReadOnly = true;
    inlineEntryOpen = false;
    setStorageBanner(storageErrorMessage(error, "load the sign-up board"));
    renderBoard();
  }
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function isContributionOwner(item) {
  return Boolean(
    viewerEmail
    && item.email
    && item.email.toLowerCase() === viewerEmail.toLowerCase()
    && !item.isExample
  );
}

function isFilledLot(item) {
  return !item.isExample && ["approved", "pending"].includes(item.status);
}

function rankFilledLots(list) {
  return list
    .filter(isFilledLot)
    .sort((a, b) => String(a.createdAt || "").localeCompare(String(b.createdAt || "")) || String(a.id).localeCompare(String(b.id)));
}

function lotsFullError() {
  return Object.assign(new Error("All items are filled."), { code: "LOTS_FULL" });
}

function renderLotCapacity(filledCount) {
  if (!elements.lotCapacity) return;
  const filled = Math.min(filledCount, LOT_LIMIT);
  const left = LOT_LIMIT - filled;
  elements.lotCapacity.classList.toggle("is-nearly-full", left > 0 && left <= 3);
  elements.lotCapacity.classList.toggle("is-full", left === 0);
  elements.lotCapacityText.textContent = left === 0
    ? `All ${LOT_LIMIT} items are filled`
    : `${filled} of ${LOT_LIMIT} items filled`;
  elements.lotCapacityNote.textContent = left === 0
    ? "Thank you! The Bazaar is full."
    : left <= 3
      ? `Only ${left} ${left === 1 ? "slot" : "slots"} left. Secure your item first and raise funds.`
      : `${left} slots left. Secure your item first and raise funds.`;
  elements.lotCapacityBar.style.width = `${(filled / LOT_LIMIT) * 100}%`;
  elements.lotCapacity.setAttribute("aria-valuenow", String(filled));
}

function createLotsFullMarkup() {
  return `
    <div class="entry-full">
      <strong>All ${LOT_LIMIT} items are filled. Thank you!</strong><span>See you at Kite All Hearts on 23 October.</span>
    </div>
  `;
}

function captureInlineValues() {
  const form = elements.entryHolder?.querySelector(".table-entry-row");
  if (!form) return;
  const values = {};
  form.querySelectorAll("[data-inline-field]").forEach((field) => { values[field.dataset.inlineField] = field.value; });
  inlineDraftValues = { ...(inlineDraftValues || {}), ...values };
}

function renderBoard() {
  captureInlineValues();
  const rankedLots = rankFilledLots(contributions);
  rankedLots.forEach((item, index) => { item.slotNumber = index + 1; });
  const lotsFull = rankedLots.length >= LOT_LIMIT;
  renderLotCapacity(rankedLots.length);
  const matchingContributions = contributions
    .filter((item) => ["approved", "pending", "draft"].includes(item.status))
    .filter((item) => activeCity === "all" || item.city === activeCity)
    .sort((a, b) => {
      if ((a.status === "draft") !== (b.status === "draft")) return a.status === "draft" ? -1 : 1;
      return String(b.createdAt || "").localeCompare(String(a.createdAt || ""))
        || (b.slotNumber || 0) - (a.slotNumber || 0);
    });
  const visibleContributions = matchingContributions.filter((item) => !item.isExample);

  const showEntry = inlineEntryOpen && !lotsFull;
  const showFull = lotsFull && !storageReadOnly;
  elements.entryHolder.innerHTML = `${showEntry ? createInlineEntryMarkup() : ""}${showFull ? createLotsFullMarkup() : ""}`;
  elements.tableBody.innerHTML = visibleContributions.map(createTableRowMarkup).join("");
  elements.emptyState.hidden = visibleContributions.length > 0;
  elements.tableWrap.hidden = visibleContributions.length === 0;
  const loader = document.querySelector("#boardLoading");
  if (loader) loader.hidden = !boardLoading;
  if (boardLoading) {
    elements.emptyState.hidden = true;
    elements.tableWrap.hidden = true;
  }
  fitLotList();
}

const VISIBLE_LOT_ROWS = 5;
function fitLotList() {
  const wrap = elements.tableWrap;
  const rows = elements.tableBody.rows;
  const isMobile = window.matchMedia("(max-width: 760px)").matches;
  if (isMobile || rows.length <= VISIBLE_LOT_ROWS || wrap.hidden) {
    wrap.classList.remove("is-capped");
    wrap.style.maxHeight = "";
    updateLotMoreHint();
    return;
  }
  wrap.classList.add("is-capped");
  wrap.style.maxHeight = "";
  const top = wrap.getBoundingClientRect().top;
  const bottom = rows[VISIBLE_LOT_ROWS - 1].getBoundingClientRect().bottom;
  const fiveRows = Math.ceil(bottom - top + 12);
  const headerHeight = document.querySelector(".site-header")?.offsetHeight || 0;
  const headingBlock = document.querySelector(".board-list-heading");
  const aboveList = headingBlock ? Math.max(0, top - headingBlock.getBoundingClientRect().top) : 0;
  const available = window.innerHeight - headerHeight - aboveList - 24;
  wrap.style.maxHeight = `${Math.max(260, Math.min(fiveRows, available))}px`;
  updateLotMoreHint();
}
function updateLotMoreHint() {
  const hint = document.querySelector("#lotMoreHint");
  if (!hint) return;
  const wrap = elements.tableWrap;
  if (!wrap.classList.contains("is-capped")) {
    hint.hidden = true;
    wrap.classList.remove("has-more");
    return;
  }
  const wrapBottom = wrap.getBoundingClientRect().bottom;
  const below = [...elements.tableBody.rows].filter((row) => row.getBoundingClientRect().bottom > wrapBottom + 4).length;
  hint.hidden = below === 0;
  wrap.classList.toggle("has-more", below > 0);
  document.querySelector("#lotMoreHintText").textContent = `Scroll for ${below} more item${below === 1 ? "" : "s"}`;
}
elements.tableWrap.addEventListener("scroll", updateLotMoreHint, { passive: true });
document.querySelector("#lotMoreHint")?.addEventListener("click", () => {
  const wrap = elements.tableWrap;
  wrap.scrollBy({ top: wrap.clientHeight * 0.8, behavior: "smooth" });
});
if (window.ResizeObserver) {
  new ResizeObserver(() => fitLotList()).observe(elements.tableBody);
}
window.addEventListener("resize", fitLotList);

function lotImages(item) {
  if (Array.isArray(item.images) && item.images.length) return item.images;
  return item.image ? [{ url: item.image }] : [];
}

function lotImageUrl(image) {
  if (!image) return "";
  const projectId = vibeStorage?.projectId;
  const isLocal = location.hostname === "localhost" || location.hostname === "127.0.0.1";
  if (image.key && image.viewer && projectId && !isLocal) {
    return `/api/projects/${encodeURIComponent(projectId)}/images/${encodeURIComponent(image.key)}?viewer=${encodeURIComponent(image.viewer)}`;
  }
  return image.url || "";
}

function resizeImageFile(file, maxSide = 1600) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Could not process image."))), "image/jpeg", 0.85);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("That file is not a readable image.")); };
    img.src = url;
  });
}

function inlineImagesMarkup() {
  const thumbs = inlineImages.map((image, index) => `
    <span class="entry-photo">
      <img src="${escapeHtml(lotImageUrl(image))}" alt="Photo ${index + 1}">
      <button type="button" data-remove-inline-image="${index}" aria-label="Remove photo ${index + 1}">×</button>
    </span>`).join("");
  const canAdd = inlineImages.length < MAX_LOT_IMAGES;
  return `${thumbs}${canAdd ? `
    <label class="entry-photo-add${inlineImagesBusy ? " is-busy" : ""}">
      <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple data-inline-images${inlineImagesBusy ? " disabled" : ""}>
      <span>${inlineImagesBusy ? "Uploading…" : `+ Add photos <small>${inlineImages.length}/${MAX_LOT_IMAGES}</small>`}</span>
    </label>` : ""}`;
}

function refreshInlineImages() {
  const holder = elements.entryHolder.querySelector("[data-inline-photos]");
  if (holder) holder.innerHTML = inlineImagesMarkup();
}

async function addInlineImages(files) {
  if (!vibeStorage || storageReadOnly) {
    showToast("Sign in through the internal VibeHub project to add photos.");
    return;
  }
  const room = MAX_LOT_IMAGES - inlineImages.length;
  const picked = [...files].filter((file) => file.type.startsWith("image/")).slice(0, room);
  if (files.length > room) showToast(`You can add up to ${MAX_LOT_IMAGES} photos per lot.`);
  if (!picked.length) return;
  inlineImagesBusy = true;
  refreshInlineImages();
  try {
    for (const file of picked) {
      const blob = await resizeImageFile(file);
      const key = `lot-photo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const meta = await vibeStorage.images.set(key, blob, { public: true });
      inlineImages.push({ key, viewer: viewerEmail, url: meta?.url || "" });
    }
  } catch (error) {
    console.error("Could not upload photo to VibeHub.", error);
    showToast(storageErrorMessage(error, "upload the photo"));
  } finally {
    inlineImagesBusy = false;
    refreshInlineImages();
  }
}

async function removeInlineImage(index) {
  const [image] = inlineImages.splice(index, 1);
  refreshInlineImages();
  if (image?.key && !contributions.some((item) => item.status !== "draft" && (item.images || []).some((img) => img.key === image.key))) {
    try { await vibeStorage?.images.delete(image.key); } catch (error) { console.error("Could not delete photo.", error); }
  }
}

function createTableRowMarkup(item) {
  const category = categoryDetails[item.category] || categoryDetails.experiences;
  const images = lotImages(item);
  const visual = images.length
    ? `<img src="${escapeHtml(lotImageUrl(images[0]))}" alt="" loading="lazy">${images.length > 1 ? `<em class="table-photo-count">+${images.length - 1}</em>` : ""}`
    : `<span aria-hidden="true">${category.glyph}</span>`;
  const supply = `${item.quantity} ${item.quantity === 1 ? "item / seat" : "items / seats"}${item.duration ? ` · ${escapeHtml(item.duration)}` : ""}`;

  return `
    <tr class="${item.status === "draft" ? "is-draft" : ""}">
      <td data-label="Lot"><span class="table-lot-number ${item.status === "draft" ? "table-lot-number--pending" : ""}">${item.status === "draft" ? "DRAFT" : (item.isExample ? "EG" : `#${escapeHtml(item.slotNumber || "—")}`)}</span></td>
      <td data-label="Contribution">
        <div class="table-contribution">
          <div class="table-contribution__visual" style="--row-color:${category.color}">${visual}</div>
          <div>
            <div class="table-contribution__labels">
              ${item.category ? `<span>${category.label}</span>` : ""}
              ${item.isExample ? `<span class="table-example">Example</span>` : ""}
              ${item.status === "draft" ? `<span class="table-pending">Saved draft</span>` : ""}
            </div>
            <strong>${escapeHtml(item.title)}</strong>
            <small>${escapeHtml(item.description)}</small>
          </div>
        </div>
      </td>
      <td data-label="Contributed by">
        <div class="table-contributor">
          <span>${escapeHtml(initials(contributorDisplay(item)))}${(item.avatarEmail || item.email) ? `<img src="/api/avatar/${encodeURIComponent((item.avatarEmail || item.email).toLowerCase())}" alt="" loading="lazy" onerror="this.remove()">` : ""}</span>
          <strong>${escapeHtml(contributorDisplay(item))}</strong>
        </div>
      </td>
      <td data-label="Location"><strong>${escapeHtml(item.city === "Remote" ? "Anywhere" : cityLabel(item.city))}</strong></td>
      <td data-label="Items or seats"><span>${supply}</span></td>
      <td data-label="Starting bid"><strong class="table-bid">₹${Number(item.startingBid || 500).toLocaleString("en-IN")}</strong></td>
      <td>
        <div class="table-row-actions">
          <button class="table-preview" type="button" data-preview-lot="${item.id}">Preview</button>
          ${item.status === "draft"
            ? `<button class="table-preview" type="button" data-edit-draft="${item.id}">Edit draft</button>`
            : ""}
          ${isContributionOwner(item) && item.status !== "draft"
            ? `<button class="table-preview" type="button" data-edit-own-lot="${item.id}">Edit</button>
              <button class="table-delete-own" type="button" data-delete-own-lot="${item.id}">Delete</button>`
            : ""}
        </div>
      </td>
    </tr>
  `;
}

function parseTeamMembers(value) {
  return String(value || "").split("|").map((m) => m.trim()).filter(Boolean);
}

function memberEmail(member) {
  return `${member.toLowerCase()}@microsoft.com`;
}

function normaliseAlias(value) {
  const alias = String(value || "").trim().toLowerCase().replace(/@microsoft\.com$/, "");
  return /^[a-z0-9._-]+$/.test(alias) ? alias : "";
}

// Studio+91 All Hands roster: [display name, alias]. Used for teammate suggestions.
const STUDIO_ROSTER = [["Aadith V A","vaaadith"],["Aaron Lepcha","aaronlepcha"],["Aarya Ghodke","aaryaghodke"],["Aarya Kabara","kabaraaarya"],["Abhijeet Singh","abhijeet.singh"],["Abhinav Mishra","abhinamishra"],["Abhishek Dutta","abhidutta"],["Abhishek Kshirsagar","abkshirsagar"],["Abhishek Ranjan","abhisranjan"],["Aditi Bhatt","aditibhatt"],["Aditya Laad","adityalaad"],["Ajay Agarwal","agarwalajay"],["Akhil Prakash","akhilprakash"],["Akshit Verma","akshitverma"],["Alivia Chaudhuri","alchaudhuri"],["Amalkrishna P S","aps"],["Amya Rai","amyarai"],["Anant Tambade","ananttambade"],["Ananya .","ananya"],["Anchal Bathla","anchalbathla"],["Anish Abraham","anishabraham"],["Ankur Gupta","ankurgu"],["Ankur Parihar","ankurparihar"],["Anshika Khola","kholaanshika"],["Anudish Koshal","akoshal"],["Anuja Kulkarni","anukulkarni"],["Apeksha Gadwal","agadwal"],["Apoorva Agrawal","apooragrawal"],["Arjit Bhagat","arjitbhagat"],["Armeen Kapadia Basavaraju","arbasavaraju"],["Arushi Tandon","arushitandon"],["Aryan Karkera","karkeraaryan"],["Ashley Lobo","loboashley"],["Atharva Vankundre","avankundre"],["Ayushi Singh","singhayushi"],["Chirag Bansal","chiragbansal"],["Deepika Dhupar","ddhupar"],["Deepika Nanda","deepikananda"],["Dhanya Viswanath","dhanyav"],["Eemon Roy","eemonroy"],["Fayaz PK","fayazpk"],["Harinie Ananth","hananth"],["Isha Agrawal","ishaagrawal"],["Jayawant Tewari","jayawant.tewari"],["Jui Sonawane","juisonawane"],["June Sardar","junesardar"],["Juraij Kaja Moideen","jkajamoideen"],["Justin Varacheril George","jgeorge"],["Kashish Mehta","kashishmehta"],["Kiran Nadendla","knadendla"],["Komal Singh","komalsingh"],["Krushna Shitap","kshitap"],["Manas Karambelkar","mkarambelkar"],["Manjiri Durge","manjiridurge"],["Meher Jangra","meherjangra"],["Mohamed Siddique","mosiddique"],["Mohan Kumar","mgangappa"],["Monika Nagar","monikanagar"],["Mrigank Haleangadi","mhaleangadi"],["Narayan Menon","narayan.menon"],["Naved Khan","navedkhan"],["Nebin Biju","nebinbiju"],["Neha Motghare","nemot"],["Neha Singh","nesingh"],["Ninad Kale","ninadkale"],["Nithin Chandra S R","nisr"],["Nithin Ismail","nithin.ismail"],["Param Ranjan","paramranjan"],["Poonam Savale","poonamsavale"],["Pradnya Patil","pradnyapatil"],["Pragati Bansal","pragati.bansal"],["Prathima Sharma","prathsharma"],["Pratik Sangeetha","psangeetha"],["Preeti Sahasrabuddhe","preetis"],["Priya .","priy"],["Priyanka Saha","priyankasaha"],["Pulak Anand","pulakanand"],["Puneeth Hegde","puneethhegde"],["Rachit Jain","rachitjain"],["Rahul Goradia","rahulgoradia"],["Raj Rajpara","rajrajpara"],["Ramanuj Nanhoriya","rnanhoriya"],["Ranjana Sharma","ransharma"],["Ranjith Ravi","ranjithravi"],["Rhea Gupta","guptarhea"],["Rohan Baruah","rohanbaruah"],["Ruchi Batra","batraruchi"],["Sarah Zaki","sazaki"],["Sargam Prakash","prakash.sargam"],["Sasha Cherian","sashacherian"],["Satya Srivastava","satyasriv"],["Saugata Pramanik","sapramanik"],["Saurabh Singh","singhsaur"],["Saurav Harsh","sauravharsh"],["Shivani Mate","shivanimate"],["Shravani Gaikwad","shgaikwad"],["Shubham Nikhara","shubham.nikhara"],["Shweta Ratanpura","sratanpura"],["Siddharth S Kumar","siskumar"],["Simran Singh","simransingh"],["Snigdha Srivastava","srivastavasn"],["Sonsy Mishra","sonsymishra"],["Soumya Kasuganti","skasuganti"],["Srihari Hulikal Muralidhar","sriharih"],["Stuti Kamboj","stutikamboj"],["Sunair D","sunairrajd"],["Tania Jain","jaintania"],["Tejus Nagdev","tejusnagdev"],["Thuli Chishi","thulichishi"],["Timothy Jayaraj","tjayaraj"],["Udayan Vidyanta","uvidyanta"],["Vartika Agarwal","varagarwal"],["Venkat Gopal","vevenka"],["Vidhi Bhati","vidhibhati"],["Vijayta Sharma","vijsharma"],["Vinod Mulky","vinodmulky"],["Vishwam Rajagopal","vrajagopal"],["Vivek Menon","vmuralidhar"],["Yamini Gupta","yaminigupta"]];

function rosterMatches(query, exclude = []) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const taken = new Set(exclude.map((m) => m.toLowerCase()));
  return STUDIO_ROSTER
    .filter(([name, alias]) => !taken.has(alias) && (alias.startsWith(q) || name.toLowerCase().split(/\s+/).some((part) => part.startsWith(q)) || name.toLowerCase().startsWith(q)))
    .slice(0, 6);
}

function contributorDisplay(item) {
  if (item.isExample) return item.contributor;
  if (item.team) return item.team.split(",").map((m) => rosterName(m.trim())).filter(Boolean).join(", ");
  const owner = String(item.email || "").split("@")[0].toLowerCase();
  const known = STUDIO_ROSTER.find(([, alias]) => alias === owner);
  return known ? known[0] : item.contributor;
}

function rosterName(alias) {
  return STUDIO_ROSTER.find(([, a]) => a === String(alias).toLowerCase())?.[0] || alias;
}

function teamMembersMarkup(value) {
  return parseTeamMembers(value).map((member, index) => {
    const email = memberEmail(member);
    return `<span class="entry-member" title="${escapeHtml(member)}"><span class="entry-member__avatar">${escapeHtml(initials(rosterName(member)))}${email ? `<img src="/api/avatar/${encodeURIComponent(email)}" alt="" onerror="this.remove()">` : ""}</span>${escapeHtml(rosterName(member))}<button type="button" data-remove-team-member="${index}" aria-label="Remove ${escapeHtml(member)}">×</button></span>`;
  }).join("");
}

function readInlineContributor(row) {
  const value = (name) => row.querySelector(`[data-inline-field="${name}"]`)?.value.trim() || "";
  if (value("contributorMode") !== "team") return { contributor: viewerName || "", team: "" };
  const members = parseTeamMembers(value("teamMembers"));
  return { contributor: members.map(rosterName).join(", "), team: members.join(", ") };
}

const LOT_CITIES = ["Hyderabad", "Bengaluru", "Noida"];
const HOME_CITY_KEY = "give-bazaar-home-city";
// Office locations from the work directory; people not listed get theirs remembered once they pick.
const KNOWN_HOME_CITIES = {
  ranjithravi: "Bengaluru",
  abhisranjan: "Bengaluru",
  asmitakumar: "Hyderabad",
  bmutum: "Bengaluru",
  mohakgulati: "Bengaluru",
  sratanpura: "Bengaluru",
  stutikamboj: "Noida"
};
let savedHomeCity = "";

function cityLabel(city) {
  return city === "Bengaluru" ? "Bangalore" : city;
}

function defaultCity() {
  if (LOT_CITIES.includes(savedHomeCity)) return savedHomeCity;
  let local = "";
  try { local = localStorage.getItem("giveBazaarCity") || ""; } catch {}
  if (LOT_CITIES.includes(local)) return local;
  const known = KNOWN_HOME_CITIES[(viewerEmail || "").split("@")[0].toLowerCase()];
  if (known) return known;
  const ownLot = contributions
    .filter((item) => isContributionOwner(item) && !item.team && LOT_CITIES.includes(item.city))
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))[0];
  return ownLot ? ownLot.city : "";
}

function rememberHomeCity(city) {
  if (!LOT_CITIES.includes(city) || city === savedHomeCity) return;
  savedHomeCity = city;
  try { localStorage.setItem("giveBazaarCity", city); } catch {}
  if (vibeStorage && !storageReadOnly) vibeStorage.data.set(HOME_CITY_KEY, city).catch(() => {});
}

function createInlineEntryMarkup() {
  const draft = inlineDraftValues || {};
  const entryTitle = document.getElementById("entryCardTitle");
  if (entryTitle) entryTitle.textContent = editingLiveLot ? "Edit your item" : "Add your item";
  const mode = draft.contributorMode === "team" ? "team" : "you";
  const homeCity = defaultCity();
  const city = draft.city || (mode === "you" ? homeCity : "");
  const selected = (name, value, fallback) => {
    const current = draft[name] || fallback;
    return current === value ? " selected" : "";
  };
  return `
    <form class="entry-form table-entry-row" onsubmit="return false" aria-labelledby="entryCardTitle">
      <div class="entry-card__grid">
        <div class="entry-field entry-field--full"><span>Contributed by</span>
          <input type="hidden" data-inline-field="contributorMode" value="${mode}">
          <input type="hidden" data-inline-field="teamMembers" value="${escapeHtml(draft.teamMembers || "")}">
          ${mode === "you" ? `
          <div class="entry-contributor entry-contributor--you">
            <span class="entry-contributor__avatar">${escapeHtml(initials(viewerName || "You"))}${viewerEmail ? `<img src="/api/avatar/${encodeURIComponent(viewerEmail.toLowerCase())}" alt="" onerror="this.remove()">` : ""}</span>
            <strong>${escapeHtml(viewerName || "You")}</strong>
            <button type="button" class="entry-link" data-contributor-mode="team">Change to group</button>
          </div>` : `
          <button type="button" class="entry-link entry-link--corner" data-contributor-mode="you">Change to just me</button>
          <div class="entry-team">
            <input data-team-member-input aria-label="Add teammate by name or Microsoft alias" placeholder="Type a name or alias, e.g. Abhishek" autocapitalize="off" spellcheck="false" autocomplete="off" role="combobox" aria-expanded="false" aria-controls="teamSuggest">
            <div class="entry-suggest" id="teamSuggest" role="listbox" data-team-suggest hidden></div>
            <div class="entry-members" data-team-members>${teamMembersMarkup(draft.teamMembers || "")}</div>
          </div>`}
        </div>
        <div class="entry-field entry-field--full"><span>Location</span>
          <input type="hidden" data-inline-field="city" value="${escapeHtml(city)}">
          <div class="entry-chips" role="radiogroup" aria-label="Location">
            ${[["Hyderabad", "Hyderabad"], ["Bengaluru", "Bangalore"], ["Noida", "Noida"]].sort(([a], [b]) => (b === homeCity) - (a === homeCity)).map(([value, label]) => `
              <button type="button" role="radio" class="entry-chip" data-entry-city="${value}" aria-checked="${city === value}">${label}</button>`).join("")}
          </div>
        </div>
        <label class="entry-field entry-field--full"><span>What are you auctioning?</span>
          <input data-inline-field="title" maxlength="70" placeholder="e.g. A Sunday pottery session" value="${escapeHtml(draft.title || "")}">
        </label>
        <label class="entry-field entry-field--full"><span>Short pitch</span>
          <textarea data-inline-field="description" maxlength="220" rows="2" placeholder="In one line, make it irresistible. e.g. Get your hands in the clay and take home a mug you made yourself">${escapeHtml(draft.description || "")}</textarea>
        </label>
        <label class="entry-field"><span>Starting bid (₹)</span>
          <input data-inline-field="startingBid" type="text" inputmode="numeric" autocomplete="off" placeholder="e.g. 500" value="${escapeHtml(draft.startingBid || "")}">
        </label>
        <label class="entry-field"><span>Items or seats</span>
          <input data-inline-field="quantity" type="text" inputmode="numeric" autocomplete="off" placeholder="e.g. 1" value="${escapeHtml(draft.quantity || "")}">
        </label>
        <div class="entry-field entry-field--full entry-field--photos"><span>Photos <small>(at least 1, up to ${MAX_LOT_IMAGES})</small></span>
          <div class="entry-photos" data-inline-photos>${inlineImagesMarkup()}</div>
        </div>
      </div>
      <div class="entry-card__actions">
        ${editingLiveLot ? `<button type="button" class="entry-delete" data-delete-own-lot="${escapeHtml(editingDraftId)}">Delete</button>` : ""}
        <span class="entry-card__spacer"></span>
        ${editingDraftId ? `<button type="button" data-inline-action="cancel">Cancel</button>` : ""}
        <button type="button" data-inline-action="preview">Preview</button>
        <button type="button" data-inline-action="submit">${editingLiveLot ? "Save changes" : "Submit item"}</button>
      </div>
    </form>
  `;
}

function showInlineEntry() {
  if (!elements.entryHolder.querySelector(".table-entry-row")) renderBoard();
  document.querySelector("#bazaar").scrollIntoView({ behavior: "smooth", block: "start" });
  requestAnimationFrame(() => elements.entryHolder.querySelector('[data-inline-field="title"]')?.focus());
}

function closeInlineEntry() {
  const wasEditing = Boolean(editingDraftId);
  const discarded = editingDraftId ? [] : inlineImages;
  editingDraftId = null;
  editingLiveLot = false;
  inlineDraftValues = null;
  elements.entryHolder.innerHTML = "";
  inlineImages = [];
  discarded.forEach((image) => vibeStorage?.images.delete(image.key).catch(() => {}));
  inlineEntryOpen = true;
  renderBoard();
  showToast(wasEditing ? "Edit cancelled. No changes saved." : "Form cleared.");
}

async function persistDraft(contribution) {
  if (!vibeStorage || storageReadOnly) {
    throw Object.assign(new Error("Storage is read-only."), { code: "PUBLIC_SHARE_BLOCKED" });
  }
  return vibeStorage.data.set(DRAFT_KEY, contribution);
}

async function persistSubmittedContribution(contribution, includePendingImage = false) {
  if (!vibeStorage || storageReadOnly) {
    throw Object.assign(new Error("Storage is read-only."), { code: "PUBLIC_SHARE_BLOCKED" });
  }

  const existingLots = rankFilledLots(await readSharedContributions());
  if (existingLots.length >= LOT_LIMIT && !existingLots.some((item) => item.id === contribution.id)) {
    throw lotsFullError();
  }
  contribution.status = "approved";

  let uploadedImageKey = "";
  try {
    if (includePendingImage && pendingImage) {
      uploadedImageKey = `lot-${contribution.id}`;
      const imageBlob = await fetch(pendingImage).then((response) => response.blob());
      const imageMeta = await vibeStorage.images.set(uploadedImageKey, imageBlob, { public: true });
      contribution.image = imageMeta.url;
      contribution.imageKey = uploadedImageKey;
    }
    await vibeStorage.shared.set(contributionKey(contribution.id), contribution);
    const rankedAfterSave = rankFilledLots(await readSharedContributions());
    const slot = rankedAfterSave.findIndex((item) => item.id === contribution.id) + 1;
    if (slot > LOT_LIMIT) {
      await vibeStorage.shared.delete(contributionKey(contribution.id));
      throw lotsFullError();
    }
    await vibeStorage.data.delete(DRAFT_KEY);
  } catch (error) {
    if (uploadedImageKey) {
      try {
        await vibeStorage.images.delete(uploadedImageKey);
      } catch (cleanupError) {
        console.error("Could not clean up an unlinked VibeHub image.", cleanupError);
      }
    }
    throw error;
  }
}

async function saveInlineEntry(targetStatus) {
  const row = elements.entryHolder.querySelector(".table-entry-row");
  if (!row || storageReadOnly) {
    showToast("Sign in through the internal VibeHub project to contribute.");
    return null;
  }
  const value = (name) => row.querySelector(`[data-inline-field="${name}"]`)?.value.trim() || "";
  const title = value("title");
  const description = value("description");
  const { contributor, team } = readInlineContributor(row);
  const startingBid = Number(value("startingBid").replace(/[^\d]/g, ""));
  const quantity = Number(value("quantity").replace(/[^\d]/g, ""));

  if (inlineImagesBusy) {
    showToast("Hang on, your photos are still uploading.");
    return null;
  }
  if (targetStatus === "pending" && !LOT_CITIES.includes(value("city"))) {
    showToast("Choose the location for this item.");
    return;
  }
  if (targetStatus === "pending" && title && description && contributor && startingBid && quantity && !inlineImages.length) {
    showToast("Add at least one photo of your item.");
    return;
  }
  if (targetStatus === "pending" && (!title || !description || !contributor || !startingBid || !quantity)) {
    showToast(value("contributorMode") === "team" && !contributor ? "Add at least one teammate alias." : "Complete the title, short pitch, starting bid, and items or seats.");
    return;
  }

  const contribution = {
    id: editingDraftId || `contribution-${Date.now()}`,
    title: title || "Untitled draft",
    description: description || "Details to be completed.",
    contributor: contributor || "Not added",
    category: "",
    type: "",
    city: value("city") || "",
    quantity: quantity || 1,
    startingBid: startingBid || 500,
    duration: "",
    availability: "",
    link: "",
    logistics: "",
    image: "",
    images: inlineImages.map(({ key, viewer, url }) => ({ key, viewer, url })),
    email: viewerEmail,
    team,
    status: targetStatus,
    isExample: false,
    lotNumber: null,
    createdAt: editingDraftId
      ? contributions.find((item) => item.id === editingDraftId)?.createdAt || new Date().toISOString()
      : new Date().toISOString()
  };

  if (!team) rememberHomeCity(contribution.city);
  const previousVersion = editingDraftId ? contributions.find((item) => item.id === editingDraftId) : null;
  const wasLiveEdit = editingLiveLot;
  row.querySelectorAll("button").forEach((button) => { button.disabled = true; });
  try {
    if (targetStatus === "draft") {
      await persistDraft(contribution);
    } else {
      await persistSubmittedContribution(contribution);
    }
  } catch (error) {
    console.error(`Could not save ${targetStatus} contribution to VibeHub.`, error);
    showToast(storageErrorMessage(error, targetStatus === "draft" ? "save the draft" : "submit the item"));
    row.querySelectorAll("button").forEach((button) => { button.disabled = false; });
    return null;
  }

  contributions = [
    contribution,
    ...contributions.filter((item) => item.id !== editingDraftId && item.id !== contribution.id)
  ];
  editingDraftId = null;
  editingLiveLot = false;
  inlineDraftValues = null;
  elements.entryHolder.innerHTML = "";
  inlineImages = [];
  inlineEntryOpen = true;
  renderBoard();
  if (wasLiveEdit && previousVersion) {
    const keptKeys = new Set(contribution.images.map((image) => image.key));
    (previousVersion.images || [])
      .filter((image) => image.key && !keptKeys.has(image.key))
      .forEach((image) => vibeStorage?.images.delete(image.key).catch(() => {}));
  }
  showToast(targetStatus === "draft"
    ? "Draft saved privately to your VibeHub account."
    : (wasLiveEdit ? "Item updated." : "Your item is on the board."));
  return contribution;
}

function editInlineDraft(id) {
  const draft = contributions.find((item) => item.id === id && item.status === "draft");
  if (!draft) {
    showToast("That draft could not be found.");
    return;
  }
  editingDraftId = id;
  inlineDraftValues = { ...draft };
  inlineImages = (draft.images || []).map((image) => ({ ...image }));
  renderBoard();
  document.querySelector("#bazaar").scrollIntoView({ behavior: "smooth", block: "start" });
  requestAnimationFrame(() => elements.entryHolder.querySelector('[data-inline-field="title"]')?.focus());
}

function editOwnLot(id) {
  const lot = contributions.find((item) => item.id === id && item.status !== "draft");
  if (!lot || !isContributionOwner(lot)) {
    showToast("Only the contributor can edit this item.");
    return;
  }
  const teamMembers = lot.team ? lot.team.split(",").map((m) => m.trim()).filter(Boolean).join("|") : "";
  editingDraftId = id;
  editingLiveLot = true;
  inlineDraftValues = {
    city: lot.city,
    title: lot.title,
    description: lot.description,
    startingBid: String(lot.startingBid || ""),
    quantity: String(lot.quantity || ""),
    contributorMode: teamMembers ? "team" : "you",
    teamMembers
  };
  inlineImages = (lot.images || []).map((image) => ({ ...image }));
  elements.entryHolder.innerHTML = "";
  renderBoard();
  document.querySelector("#bazaar").scrollIntoView({ behavior: "smooth", block: "start" });
  requestAnimationFrame(() => elements.entryHolder.querySelector('[data-inline-field="title"]')?.focus());
}

function openIdeaHelperFromInline() {
  const row = elements.entryHolder.querySelector(".table-entry-row");
  const read = (name) => row?.querySelector(`[data-inline-field="${name}"]`)?.value || "";
  const draft = {
    category: read("category"),
    title: read("title"),
    description: read("description"),
    contributor: read("contributor"),
    type: read("type"),
    city: read("city"),
    quantity: read("quantity"),
    startingBid: read("startingBid")
  };

  openContributionForm(draft.category);
  Object.entries(draft).forEach(([name, value]) => {
    if (value && elements.form.elements[name]) elements.form.elements[name].value = value;
  });
  elements.descriptionCount.textContent = draft.description.length;
}

function renderAdmin() {
  const approved = contributions.filter((item) => item.status === "approved").length;
  const pending = contributions.filter((item) => item.status === "pending").length;
  elements.approvedCount.textContent = approved;
  elements.pendingCount.textContent = pending;
  elements.totalCount.textContent = contributions.length;

  const sorted = [...contributions].sort((a, b) => {
    if (a.status !== b.status) return a.status === "pending" ? -1 : 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  elements.adminList.innerHTML = sorted.map((item) => `
    <article class="admin-item">
      <div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>
          <span class="status-pill ${item.status === "pending" ? "status-pill--pending" : ""}">${item.status}</span>
          ${escapeHtml(contributorDisplay(item))} · ${escapeHtml(cityLabel(item.city))} · ${categoryDetails[item.category]?.label || "Other"}
        </p>
      </div>
      <div class="admin-item__actions">
        ${item.status === "pending" ? `<button class="approve" type="button" data-admin-action="approve" data-id="${item.id}">Approve</button>` : ""}
      </div>
    </article>
  `).join("");
}

function setStep(step) {
  currentStep = step;
  document.querySelectorAll("[data-form-step]").forEach((panel) => {
    panel.classList.toggle("is-active", Number(panel.dataset.formStep) === step);
  });
  document.querySelectorAll("[data-progress-step]").forEach((item) => {
    item.classList.toggle("is-active", Number(item.dataset.progressStep) <= step);
  });
  elements.backButton.hidden = step === 1;
  elements.nextButton.hidden = step === 3;
  elements.submitButton.hidden = step !== 3;
  elements.formError.hidden = true;
  elements.form.scrollTo({ top: 0, behavior: "smooth" });
}

function validateStep(step) {
  const panel = document.querySelector(`[data-form-step="${step}"]`);
  const requiredFields = [...panel.querySelectorAll("[required]")];
  const invalid = requiredFields.find((field) => !field.checkValidity());

  if (invalid) {
    invalid.reportValidity();
    elements.formError.textContent = "Please complete the highlighted field before continuing.";
    elements.formError.hidden = false;
    return false;
  }

  elements.formError.hidden = true;
  return true;
}

function openContributionForm(category = "") {
  if (storageReadOnly) {
    showToast("Sign in through the internal VibeHub project to contribute.");
    return;
  }
  elements.form.reset();
  pendingImage = "";
  elements.imagePreview.hidden = true;
  elements.imagePreview.removeAttribute("src");
  elements.uploadLabel.textContent = "Choose a photo";
  elements.descriptionCount.textContent = "0";
  elements.form.elements.contributor.value = viewerName;
  elements.form.elements.email.value = viewerEmail;
  if (category) elements.form.elements.category.value = category;
  setStep(1);
  elements.contributionDialog.showModal();
}

function closeContributionForm() {
  elements.contributionDialog.close();
}

function createContribution(formData) {
  return {
    id: `contribution-${crypto.randomUUID?.() || Date.now()}`,
    title: formData.get("title").trim(),
    category: formData.get("category"),
    type: formData.get("type"),
    city: formData.get("city"),
    description: formData.get("description").trim(),
    contributor: formData.get("contributor").trim(),
    email: viewerEmail || formData.get("email").trim(),
    team: formData.get("team").trim(),
    quantity: Number(formData.get("quantity")),
    startingBid: Number(formData.get("startingBid")),
    duration: formData.get("duration").trim(),
    availability: formData.get("availability"),
    link: formData.get("link").trim(),
    logistics: formData.get("logistics").trim(),
    image: pendingImage,
    status: "approved",
    isExample: false,
    lotNumber: null,
    createdAt: new Date().toISOString()
  };
}

function getAuctionItems() {
  if (auctionPreviewItems) return auctionPreviewItems;
  const filledLots = rankFilledLots(contributions);
  if (filledLots.length) return filledLots.slice(0, LOT_LIMIT);
  return contributions
    .filter((item) => item.isExample && item.status === "approved")
    .sort((a, b) => (a.lotNumber || 9999) - (b.lotNumber || 9999));
}

function resetAuctionTimer() {
  clearInterval(auctionTimerId);
  auctionTimerId = null;
  auctionSeconds = 40;
  elements.auctionSeconds.textContent = auctionSeconds;
  elements.auctionStartTimer.textContent = "Start 40-second bidding";
}

function renderAuctionItem() {
  const items = getAuctionItems();
  if (!items.length) {
    showToast("There are no approved auction items yet.");
    return false;
  }

  auctionIndex = Math.max(0, Math.min(auctionIndex, items.length - 1));
  const item = items[auctionIndex];
  const category = categoryDetails[item.category] || categoryDetails.experiences;
  const lotNumber = item.slotNumber || item.lotNumber || (auctionPreviewItems ? "—" : auctionIndex + 1);
  const startingBid = Number(item.startingBid || 500);

  elements.auctionProgress.textContent = auctionPreviewItems ? "SLIDE PREVIEW" : `ITEM ${auctionIndex + 1} OF ${items.length}`;
  elements.auctionLotNumber.textContent = `#${lotNumber}`;
  elements.auctionTitle.textContent = item.title;
  elements.auctionContributor.textContent = contributorDisplay(item);
  elements.auctionDescription.textContent = item.description;
  elements.auctionLocation.textContent = item.city === "Remote" ? "Anywhere / remote" : cityLabel(item.city);
  elements.auctionQuantity.textContent = item.quantity;
  elements.auctionStartingBid.textContent = startingBid.toLocaleString("en-IN");
  elements.auctionBidFormat.textContent = `#${lotNumber === "—" ? "item" : lotNumber} - ${startingBid}`;
  elements.auctionVisual.style.background = category.color;
  elements.auctionGlyph.textContent = category.glyph;

  const slideImages = lotImages(item).slice(0, MAX_LOT_IMAGES);
  elements.auctionImage.hidden = true;
  elements.auctionImage.removeAttribute("src");
  elements.auctionVisual.querySelector(".auction-gallery")?.remove();
  if (slideImages.length) {
    const gallery = document.createElement("div");
    const multiple = slideImages.length > 1;
    gallery.className = `auction-gallery${multiple ? " auction-gallery--carousel" : ""}`;
    gallery.innerHTML = `<div class="auction-gallery__track">${slideImages
      .map((image, index) => `<img src="${escapeHtml(lotImageUrl(image))}" alt="${escapeHtml(item.title)} photo ${index + 1} of ${slideImages.length}">`)
      .join("")}</div>${multiple ? `
      <button class="auction-gallery__arrow auction-gallery__arrow--prev" type="button" data-gallery-step="-1" aria-label="Previous photo">‹</button>
      <button class="auction-gallery__arrow auction-gallery__arrow--next" type="button" data-gallery-step="1" aria-label="Next photo">›</button>
      <div class="auction-gallery__dots" aria-hidden="true">${slideImages.map(() => "<i></i>").join("")}</div>` : ""}`;
    elements.auctionVisual.appendChild(gallery);
    if (multiple) setGallerySlide(gallery, 0);
    elements.auctionGlyph.hidden = true;
  } else {
    elements.auctionGlyph.hidden = false;
  }

  elements.auctionPrevious.disabled = auctionIndex === 0;
  elements.auctionNext.disabled = auctionIndex === items.length - 1;
  resetAuctionTimer();
  return true;
}

function setGallerySlide(gallery, index) {
  const count = gallery.querySelectorAll(".auction-gallery__track img").length;
  const next = (index + count) % count;
  gallery.dataset.index = String(next);
  gallery.querySelector(".auction-gallery__track").style.transform = `translateX(-${next * 100}%)`;
  gallery.querySelectorAll(".auction-gallery__dots i").forEach((dot, i) => dot.classList.toggle("is-active", i === next));
}

document.addEventListener("click", (event) => {
  const arrow = event.target.closest("[data-gallery-step]");
  if (!arrow) return;
  const gallery = arrow.closest(".auction-gallery");
  setGallerySlide(gallery, Number(gallery.dataset.index || 0) + Number(arrow.dataset.galleryStep));
});

let galleryTouchX = null;
document.addEventListener("touchstart", (event) => {
  galleryTouchX = event.target.closest(".auction-gallery--carousel") ? event.touches[0].clientX : null;
}, { passive: true });
document.addEventListener("touchend", (event) => {
  const gallery = event.target.closest(".auction-gallery--carousel");
  if (!gallery || galleryTouchX === null) return;
  const dx = event.changedTouches[0].clientX - galleryTouchX;
  galleryTouchX = null;
  if (Math.abs(dx) > 40) setGallerySlide(gallery, Number(gallery.dataset.index || 0) + (dx < 0 ? 1 : -1));
});

function openAuctionMode(itemId = null, previewItem = null) {
  if (previewItem) {
    auctionPreviewItems = [previewItem];
  } else if (typeof itemId === "string") {
    const requestedItem = contributions.find((item) => item.id === itemId);
    auctionPreviewItems = requestedItem ? [requestedItem] : null;
  } else {
    auctionPreviewItems = null;
  }
  const items = getAuctionItems();
  auctionIndex = 0;
  if (!renderAuctionItem()) return;
  if (elements.adminDialog.open) elements.adminDialog.close();
  elements.auctionDialog.classList.toggle("is-slide-preview", Boolean(auctionPreviewItems));
  elements.auctionDialog.showModal();
}

function closeAuctionMode() {
  resetAuctionTimer();
  elements.auctionDialog.close();
  elements.auctionDialog.classList.remove("is-slide-preview");
  auctionPreviewItems = null;
}

function previewInlineEntry() {
  const row = elements.entryHolder.querySelector(".table-entry-row");
  if (!row) return;
  const value = (name) => row.querySelector(`[data-inline-field="${name}"]`)?.value.trim() || "";
  openAuctionMode(null, {
    id: "inline-preview",
    title: value("title") || "Your contribution title",
    description: value("description") || "Your short contribution pitch will appear here.",
    contributor: readInlineContributor(row).contributor || viewerName || "Your name",
    team: readInlineContributor(row).team,
    category: "",
    type: "",
    city: value("city") || "Hyderabad",
    quantity: Number(value("quantity").replace(/[^\d]/g, "")) || 1,
    startingBid: Number(value("startingBid").replace(/[^\d]/g, "")) || 500,
    image: "",
    images: inlineImages.map((image) => ({ ...image })),
    status: "preview",
    isExample: false,
    lotNumber: null
  });
}

function startAuctionTimer() {
  if (auctionTimerId) {
    clearInterval(auctionTimerId);
    auctionTimerId = null;
    elements.auctionStartTimer.textContent = "Resume bidding";
    return;
  }

  if (auctionSeconds === 0) auctionSeconds = 40;
  elements.auctionStartTimer.textContent = "Pause timer";
  auctionTimerId = setInterval(() => {
    auctionSeconds -= 1;
    elements.auctionSeconds.textContent = auctionSeconds;
    if (auctionSeconds <= 0) {
      clearInterval(auctionTimerId);
      auctionTimerId = null;
      elements.auctionStartTimer.textContent = "Bidding closed · Restart";
      showToast("Time! Bidding is closed for this item.");
    }
  }, 1000);
}

function showToast(message) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  toastTimer = setTimeout(() => elements.toast.classList.remove("is-visible"), 3200);
}

function updateCountdown() {
  if (!elements.countdownDays) return;
  const eventDay = Date.UTC(2026, 9, 23) / 86400000;
  const todayIst = Math.floor((Date.now() + 5.5 * 3600000) / 86400000);
  const days = Math.max(0, eventDay - todayIst);
  elements.countdownDays.textContent = days;
}
setInterval(updateCountdown, 60000);

document.querySelectorAll("[data-open-form]").forEach((button) => {
  button.addEventListener("click", showInlineEntry);
});

document.querySelectorAll("[data-prefill-category]").forEach((button) => {
  button.addEventListener("click", () => openContributionForm(button.dataset.prefillCategory));
});

document.querySelectorAll("[data-suggestion-title]").forEach((button) => {
  button.addEventListener("click", () => {
    elements.form.elements.category.value = button.dataset.suggestionCategory;
    elements.form.elements.type.value = button.dataset.suggestionType;
    elements.form.elements.title.value = button.dataset.suggestionTitle;
    elements.form.elements.description.focus();
    showToast("Starter idea added. Make it personal in your own words.");
  });
});

document.querySelectorAll("[data-close-dialog]").forEach((button) => {
  button.addEventListener("click", closeContributionForm);
});

document.querySelectorAll("[data-open-admin]").forEach((button) => {
  button.addEventListener("click", () => {
    renderAdmin();
    elements.adminDialog.showModal();
  });
});

document.querySelectorAll("[data-open-auction], [data-launch-auction]").forEach((button) => {
  button.addEventListener("click", () => openAuctionMode());
});

document.querySelectorAll("[data-close-auction]").forEach((button) => {
  button.addEventListener("click", closeAuctionMode);
});

document.querySelectorAll("[data-close-admin]").forEach((button) => {
  button.addEventListener("click", () => elements.adminDialog.close());
});

document.querySelectorAll("[data-close-success]").forEach((button) => {
  button.addEventListener("click", () => {
    elements.successDialog.close();
    document.querySelector("#bazaar").scrollIntoView({ behavior: "smooth" });
  });
});

document.querySelectorAll("[data-add-another]").forEach((button) => {
  button.addEventListener("click", () => {
    elements.successDialog.close();
    openContributionForm();
  });
});

elements.nextButton.addEventListener("click", () => {
  if (validateStep(currentStep)) setStep(currentStep + 1);
});

elements.backButton.addEventListener("click", () => setStep(currentStep - 1));

elements.description.addEventListener("input", () => {
  elements.descriptionCount.textContent = elements.description.value.length;
});

elements.imageInput.addEventListener("change", () => {
  const file = elements.imageInput.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    elements.imageInput.value = "";
    elements.formError.textContent = "Please choose an image smaller than 2 MB.";
    elements.formError.hidden = false;
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    pendingImage = reader.result;
    elements.imagePreview.src = pendingImage;
    elements.imagePreview.hidden = false;
    elements.uploadLabel.textContent = file.name;
    elements.formError.hidden = true;
  });
  reader.addEventListener("error", () => {
    console.error("The selected image could not be read.");
    elements.formError.textContent = "The selected image could not be read. Please choose another file.";
    elements.formError.hidden = false;
  });
  reader.readAsDataURL(file);
});

elements.form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!validateStep(3)) return;

  const contribution = createContribution(new FormData(elements.form));
  elements.submitButton.disabled = true;
  try {
    await persistSubmittedContribution(contribution, true);
  } catch (error) {
    console.error("Could not submit the contribution to VibeHub.", error);
    elements.formError.textContent = storageErrorMessage(error, "submit the item");
    elements.formError.hidden = false;
    elements.submitButton.disabled = false;
    return;
  }

  contributions.unshift(contribution);
  pendingImage = "";
  renderBoard();
  closeContributionForm();
  elements.successDialog.showModal();
  elements.submitButton.disabled = false;
});

elements.cityFilterChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    activeCity = chip.dataset.cityFilter;
    elements.cityFilterChips.forEach((item) => {
      item.setAttribute("aria-pressed", String(item === chip));
    });
    renderBoard();
  });
});

const handleBoardChange = (event) => {
  const input = event.target.closest("[data-inline-images]");
  if (input?.files?.length) addInlineImages(input.files);
};
elements.tableBody.addEventListener("change", handleBoardChange);
elements.entryHolder.addEventListener("change", handleBoardChange);

function updateTeamMembers(form, members) {
  form.querySelector('[data-inline-field="teamMembers"]').value = members.join("|");
  const box = form.querySelector("[data-team-members]");
  box.querySelectorAll(".entry-member").forEach((el) => el.remove());
  box.insertAdjacentHTML("afterbegin", teamMembersMarkup(members.join("|")));
}

function addTeamMemberFromInput(input) {
  const form = input.closest(".table-entry-row");
  const raw = input.value.split(/[,;\s]+/).map((m) => m.trim()).filter(Boolean);
  const additions = raw.map(normaliseAlias).filter(Boolean);
  if (raw.length && additions.length < raw.length) showToast("Use Microsoft aliases only, e.g. mgangappa.");
  if (!additions.length) return;
  const members = parseTeamMembers(form.querySelector('[data-inline-field="teamMembers"]').value);
  additions.forEach((m) => { if (!members.some((x) => x.toLowerCase() === m.toLowerCase())) members.push(m); });
  input.value = "";
  updateTeamMembers(form, members.slice(0, 12));
}

function renderTeamSuggestions(input) {
  const form = input.closest(".table-entry-row");
  const box = form.querySelector("[data-team-suggest]");
  if (!box) return;
  const members = parseTeamMembers(form.querySelector('[data-inline-field="teamMembers"]').value);
  const matches = rosterMatches(input.value, members);
  box.innerHTML = matches.map(([name, alias], index) => `
    <button type="button" role="option" class="entry-suggest__item${index === 0 ? " is-active" : ""}" data-suggest-alias="${escapeHtml(alias)}">
      <span class="entry-member__avatar">${escapeHtml(initials(name))}<img src="/api/avatar/${encodeURIComponent(`${alias}@microsoft.com`)}" alt="" onerror="this.remove()"></span>
      <span><strong>${escapeHtml(name)}</strong><small>${escapeHtml(alias)}</small></span>
    </button>`).join("");
  box.hidden = !matches.length;
  input.setAttribute("aria-expanded", String(matches.length > 0));
}

function pickTeamSuggestion(input, alias) {
  const form = input.closest(".table-entry-row");
  const members = parseTeamMembers(form.querySelector('[data-inline-field="teamMembers"]').value);
  if (!members.some((m) => m.toLowerCase() === alias)) members.push(alias);
  input.value = "";
  updateTeamMembers(form, members.slice(0, 12));
  renderTeamSuggestions(input);
  input.focus();
}

elements.entryHolder.addEventListener("input", (event) => {
  const input = event.target.closest("[data-team-member-input]");
  if (input) renderTeamSuggestions(input);
});
elements.entryHolder.addEventListener("mousedown", (event) => {
  const option = event.target.closest("[data-suggest-alias]");
  if (!option) return;
  event.preventDefault();
  const input = option.closest(".table-entry-row").querySelector("[data-team-member-input]");
  pickTeamSuggestion(input, option.dataset.suggestAlias);
});

elements.entryHolder.addEventListener("keydown", (event) => {
  const input = event.target.closest("[data-team-member-input]");
  if (!input) return;
  const box = input.closest(".table-entry-row").querySelector("[data-team-suggest]");
  const options = box && !box.hidden ? [...box.querySelectorAll("[data-suggest-alias]")] : [];
  if ((event.key === "ArrowDown" || event.key === "ArrowUp") && options.length) {
    event.preventDefault();
    const current = options.findIndex((o) => o.classList.contains("is-active"));
    const next = (current + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length;
    options.forEach((o, i) => o.classList.toggle("is-active", i === next));
    return;
  }
  if (event.key === "Escape" && options.length) {
    box.hidden = true;
    return;
  }
  if ((event.key === "Enter" || event.key === "Tab") && options.length && input.value.trim()) {
    event.preventDefault();
    pickTeamSuggestion(input, (options.find((o) => o.classList.contains("is-active")) || options[0]).dataset.suggestAlias);
    return;
  }
  if (event.key === "Enter" || event.key === ",") {
    event.preventDefault();
    addTeamMemberFromInput(input);
  } else if (event.key === "Backspace" && !input.value) {
    const form = input.closest(".table-entry-row");
    const members = parseTeamMembers(form.querySelector('[data-inline-field="teamMembers"]').value);
    members.pop();
    updateTeamMembers(form, members);
  }
});
elements.entryHolder.addEventListener("focusout", (event) => {
  const input = event.target.closest("[data-team-member-input]");
  if (!input) return;
  const box = input.closest(".table-entry-row")?.querySelector("[data-team-suggest]");
  if (box) box.hidden = true;
  const typed = normaliseAlias(input.value);
  if (typed && STUDIO_ROSTER.some(([, alias]) => alias === typed)) addTeamMemberFromInput(input);
  else if (typed && !/\s/.test(input.value.trim())) addTeamMemberFromInput(input);
});

const handleBoardClick = async (event) => {
  const modeChip = event.target.closest("[data-contributor-mode]");
  if (modeChip) {
    const form = modeChip.closest(".table-entry-row");
    form.querySelector('[data-inline-field="contributorMode"]').value = modeChip.dataset.contributorMode;
    const membersField = form.querySelector('[data-inline-field="teamMembers"]');
    const myAlias = normaliseAlias((viewerEmail || "").split("@")[0]);
    if (modeChip.dataset.contributorMode === "team" && !membersField.value && myAlias) membersField.value = myAlias;
    if (!editingLiveLot) {
      form.querySelector('[data-inline-field="city"]').value = modeChip.dataset.contributorMode === "team" ? "" : defaultCity();
    }
    renderBoard();
    if (modeChip.dataset.contributorMode === "team") {
      requestAnimationFrame(() => elements.entryHolder.querySelector("[data-team-member-input]")?.focus());
    }
    return;
  }
  const removeMember = event.target.closest("[data-remove-team-member]");
  if (removeMember) {
    const form = removeMember.closest(".table-entry-row");
    const members = parseTeamMembers(form.querySelector('[data-inline-field="teamMembers"]').value);
    members.splice(Number(removeMember.dataset.removeTeamMember), 1);
    updateTeamMembers(form, members);
    return;
  }
  const cityChip = event.target.closest("[data-entry-city]");
  if (cityChip) {
    const form = cityChip.closest(".table-entry-row");
    form.querySelector('[data-inline-field="city"]').value = cityChip.dataset.entryCity;
    form.querySelectorAll("[data-entry-city]").forEach((chip) => chip.setAttribute("aria-checked", String(chip === cityChip)));
    if (form.querySelector('[data-inline-field="contributorMode"]').value !== "team") rememberHomeCity(cityChip.dataset.entryCity);
    return;
  }
  const removeImage = event.target.closest("[data-remove-inline-image]");
  if (removeImage) {
    await removeInlineImage(Number(removeImage.dataset.removeInlineImage));
    return;
  }
  const inlineButton = event.target.closest("[data-inline-action]");
  if (inlineButton) {
    if (inlineButton.dataset.inlineAction === "preview") previewInlineEntry();
    if (inlineButton.dataset.inlineAction === "draft") await saveInlineEntry("draft");
    if (inlineButton.dataset.inlineAction === "submit") await saveInlineEntry("pending");
    if (inlineButton.dataset.inlineAction === "cancel") closeInlineEntry();
    if (inlineButton.dataset.inlineAction === "ideas") openIdeaHelperFromInline();
    return;
  }

  const editDraftButton = event.target.closest("[data-edit-draft]");
  if (editDraftButton) {
    editInlineDraft(editDraftButton.dataset.editDraft);
    return;
  }

  const editOwnButton = event.target.closest("[data-edit-own-lot]");
  if (editOwnButton) {
    editOwnLot(editOwnButton.dataset.editOwnLot);
    return;
  }

  const previewButton = event.target.closest("[data-preview-lot]");
  if (previewButton) openAuctionMode(previewButton.dataset.previewLot);

  const deleteButton = event.target.closest("[data-delete-own-lot]");
  if (deleteButton) {
    const contribution = contributions.find((item) => item.id === deleteButton.dataset.deleteOwnLot);
    if (!contribution || !isContributionOwner(contribution)) {
      showToast("Only the contributor can delete this item.");
      return;
    }
    if (!window.confirm(`Delete “${contribution.title}”? This cannot be undone.`)) return;
    deleteButton.disabled = true;
    try {
      await vibeStorage.shared.delete(contributionKey(contribution.id));
      if (contribution.imageKey) await vibeStorage.images.delete(contribution.imageKey);
      for (const image of contribution.images || []) {
        if (image.key) await vibeStorage.images.delete(image.key).catch(() => {});
      }
      contributions = contributions.filter((item) => item.id !== contribution.id);
      if (editingDraftId === contribution.id) {
        editingDraftId = null;
        editingLiveLot = false;
        inlineDraftValues = null;
        inlineImages = [];
        elements.entryHolder.innerHTML = "";
      }
      renderBoard();
      renderAdmin();
      showToast(`Deleted “${contribution.title}”.`);
    } catch (error) {
      console.error("Could not delete the contribution from VibeHub.", error);
      showToast(storageErrorMessage(error, "delete the item"));
      deleteButton.disabled = false;
    }
  }
};
elements.tableBody.addEventListener("click", handleBoardClick);
elements.entryHolder.addEventListener("click", handleBoardClick);

elements.adminList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-admin-action]");
  if (!button) return;
  const contribution = contributions.find((item) => item.id === button.dataset.id);
  if (!contribution) {
    showToast("That contribution could not be found.");
    return;
  }

  try {
    if (button.dataset.adminAction === "approve") {
      contribution.status = "approved";
      const existingNumbers = contributions.map((item) => Number(item.lotNumber) || 0);
      contribution.lotNumber = Math.max(0, ...existingNumbers) + 1;
      if (!contribution.isExample) {
        await vibeStorage.shared.set(contributionKey(contribution.id), contribution);
      }
      showToast(`Approved “${contribution.title}”.`);
    }
  } catch (error) {
    console.error("Could not update the VibeHub contribution.", error);
    showToast(storageErrorMessage(error, "update the item"));
    await refreshStoredContributions();
    return;
  }

  renderAdmin();
  renderBoard();
});

document.querySelector("#resetDemo").addEventListener("click", async () => {
  const confirmed = window.confirm("Clear your saved draft? Submitted items in VibeHub will not be removed.");
  if (!confirmed) return;
  try {
    await vibeStorage.data.delete(DRAFT_KEY);
    await refreshStoredContributions({ showError: true });
    showToast("Your saved draft was cleared.");
  } catch (error) {
    console.error("Could not clear the VibeHub draft.", error);
    showToast(storageErrorMessage(error, "clear the draft"));
  }
});

[elements.contributionDialog, elements.successDialog, elements.adminDialog].forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});

elements.auctionPrevious.addEventListener("click", () => {
  auctionIndex -= 1;
  renderAuctionItem();
});

elements.auctionNext.addEventListener("click", () => {
  auctionIndex += 1;
  renderAuctionItem();
});

elements.auctionStartTimer.addEventListener("click", startAuctionTimer);

elements.auctionDialog.addEventListener("click", (event) => {
  if (event.target === elements.auctionDialog) closeAuctionMode();
});
elements.auctionDialog.addEventListener("close", resetAuctionTimer);

document.addEventListener("visibilitychange", async () => {
  if (document.hidden) {
    clearTimeout(storageRefreshTimer);
    return;
  }
  await refreshStoredContributions();
  scheduleStorageRefresh();
});

renderBoard();
updateCountdown();
if (boardLoading) {
  document.querySelector("#boardLoading")?.removeAttribute("hidden");
  elements.emptyState.hidden = true;
  elements.tableWrap.hidden = true;
}
initializeStorage().finally(() => {
  boardLoading = false;
  renderBoard();
});

const lastYearBids = [
  [1500], [2000], [1500, 2000], [1200], [1600], [3000], [3500], [5000],
  [3256, 3500, 3000, 3500], [7000, 5000, 6000], [4000], [4500], [3500], [6000], [3000], [16000]
];

const lastYearLots = [
  "Origami Puppy", "Hang in there", "Lino Cut Workshop", "Figuring things out",
  "The flower lady", "Chai pe Charcha with Ankur", "2013 The Mystery Machine from Scooby Doo",
  "2024 Spring Edition Mini Cooper", "Oblivion Express", "Living in Monochrome",
  "Handmade sketchbook", "Mig21", "Postcard Set", "Tropical Escape",
  "Nodes of Wisdom", "Crimson Moon Over the Silent Frontier"
].map((title, index) => {
  const number = String(index + 1).padStart(2, "0");
  const bids = lastYearBids[index] || [];
  const raised = bids.reduce((sum, bid) => sum + bid, 0);
  return { title, bids, raised, thumb: `last-year/lot-${number}-s.jpg`, full: `last-year/lot-${number}.jpg` };
});
const lastYearTotal = lastYearLots.reduce((sum, lot) => sum + lot.raised, 0);
const formatRupees = (value) => `₹${value.toLocaleString("en-IN")}`;
const raisedLabel = (lot) => lot.bids.length > 1
  ? `Sold for ${formatRupees(lot.raised)} · ${lot.bids.length} winning bids`
  : `Sold for ${formatRupees(lot.raised)}`;

const memoryTrack = document.querySelector("#memoryTrack");
const memoryLightbox = document.querySelector("#memoryLightbox");
const memoryLightboxImage = document.querySelector("#memoryLightboxImage");
const memoryLightboxCaption = document.querySelector("#memoryLightboxCaption");
const memoryLightboxRaised = document.querySelector("#memoryLightboxRaised");
let memoryIndex = 0;

function renderMemories() {
  if (!memoryTrack) return;
  const cards = (copy) => lastYearLots.map((lot, index) => `
    <button class="memory-card" type="button" data-memory-index="${index}"${copy ? ' aria-hidden="true" tabindex="-1"' : ""}>
      <img src="${lot.thumb}" alt="${copy ? "" : `${escapeHtml(lot.title)}, an item from GIVE Bazaar 2025`}" width="560" height="315">
      ${lot.raised ? `<span class="memory-card__raised">Sold for ${formatRupees(lot.raised)}${lot.bids.length > 1 ? ` <small>× ${lot.bids.length} bids</small>` : ""}</span>` : ""}
    </button>
  `).join("");
  memoryTrack.innerHTML = cards(false) + cards(true);
  const memoriesTitle = document.querySelector("#memoriesTitle");
  if (memoriesTitle) memoriesTitle.innerHTML = `Last year’s Studio+91 GIVE Bazaar raised <strong>₹1,79,112</strong> with Microsoft match`;
}

function showMemory(index) {
  memoryIndex = (index + lastYearLots.length) % lastYearLots.length;
  const lot = lastYearLots[memoryIndex];
  memoryLightboxImage.src = lot.full;
  memoryLightboxImage.alt = `${lot.title}, an item from GIVE Bazaar 2025`;
  memoryLightboxCaption.textContent = `${lot.title} · ${memoryIndex + 1} of ${lastYearLots.length}`;
  memoryLightboxRaised.hidden = !lot.raised;
  memoryLightboxRaised.innerHTML = lot.raised ? `Sold for ${formatRupees(lot.raised)}${lot.bids.length > 1 ? ` <small>× ${lot.bids.length} bids</small>` : ""}` : "";
  if (!memoryLightbox.open) memoryLightbox.showModal();
}

memoryTrack?.addEventListener("click", (event) => {
  const card = event.target.closest("[data-memory-index]");
  if (card) showMemory(Number(card.dataset.memoryIndex));
});
memoryLightbox?.addEventListener("click", (event) => {
  const step = event.target.closest("[data-memory-step]");
  if (step) return showMemory(memoryIndex + Number(step.dataset.memoryStep));
  if (event.target.closest("[data-close-memory]") || event.target === memoryLightbox) memoryLightbox.close();
});
memoryLightbox?.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") showMemory(memoryIndex + 1);
  if (event.key === "ArrowLeft") showMemory(memoryIndex - 1);
});
renderMemories();

document.querySelectorAll("[data-hero-add-lot]").forEach((button) => button.addEventListener("click", () => {
  document.querySelector("#bazaar .donate-message")?.scrollIntoView({ behavior: "smooth", block: "start" });
  setTimeout(() => elements.entryHolder.querySelector('[data-inline-field="title"]')?.focus({ preventScroll: true }), 600);
}));
