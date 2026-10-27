const LOT_KEY_PREFIX = "give-bazaar-lot-";
const LOT_LETTER_PATTERNS = [
  ["A", /beaded flower/], ["B", /post ?cards/], ["C", /chapter zero/], ["D", /what still matters/],
  ["E", /debangshu/], ["F", /lifafa/], ["G", /north indian dinner/], ["H", /weekend getaway/],
  ["I", /raceverse/], ["J", /bengaluru book|namma bengaluru/], ["K", /pickleball/], ["L", /drifting/],
  ["M", /hot wheels (mystery )?box/], ["N", /photo ?shoot/], ["O", /bird photowalk/], ["P", /bowling/], ["Z", /^test item/],
];
const lotLetter = (title = "") => LOT_LETTER_PATTERNS.find(([, re]) => re.test(String(title).toLowerCase()))?.[0] || "";
const EVENT_EXTRA_LOTS = [{
  id: "event-lot-m-hot-wheels-box",
  title: "Hot Wheels box",
  category: "collectibles",
  type: "Item",
  city: "Bengaluru",
  description: "Looking to add some thrill to your die-cast collection or grab an easy gift? Pick up a mystery assortment of 5 mainline Hot Wheels cars. Ideal for track racing, unboxing fun, or kickstarting a collection. 5 randomly selected, carded mainline Hot Wheels cars.",
  contributor: "Ramanuj Nanhoriya",
  avatarEmail: "rnanhoriya@microsoft.com",
  quantity: 2,
  startingBid: 800,
  images: [{ url: "hot-wheels-box.jpg" }],
  status: "approved",
  createdAt: "2026-10-23T08:00:00.000Z",
}];
let boardLots = [];
let vibeStorage = null;
let donations = new Map();
const DONATION_KEY_PREFIX = "give-bazaar-donation-";
const winnerSlug = (name) => String(name).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
const donationKey = (letter, name) => `${(letter || "x").toLowerCase()}-${winnerSlug(name)}`;
let openPanel = "";
let panelReplacing = false;
const STUDIO_ROSTER = [["Aadith V A","vaaadith"],["Aaron Lepcha","aaronlepcha"],["Aarya Ghodke","aaryaghodke"],["Aarya Kabara","kabaraaarya"],["Abhijeet Singh","abhijeet.singh"],["Abhinav Mishra","abhinamishra"],["Abhishek Dutta","abhidutta"],["Abhishek Kshirsagar","abkshirsagar"],["Abhishek Ranjan","abhisranjan"],["Aditi Bhatt","aditibhatt"],["Aditya Laad","adityalaad"],["Ajay Agarwal","agarwalajay"],["Akhil Prakash","akhilprakash"],["Akshit Verma","akshitverma"],["Alivia Chaudhuri","alchaudhuri"],["Amalkrishna P S","aps"],["Amya Rai","amyarai"],["Anant Tambade","ananttambade"],["Ananya .","ananya"],["Anchal Bathla","anchalbathla"],["Anish Abraham","anishabraham"],["Ankur Gupta","ankurgu"],["Ankur Parihar","ankurparihar"],["Anshika Khola","kholaanshika"],["Anudish Koshal","akoshal"],["Anuja Kulkarni","anukulkarni"],["Apeksha Gadwal","agadwal"],["Apoorva Agrawal","apooragrawal"],["Arjit Bhagat","arjitbhagat"],["Armeen Kapadia Basavaraju","arbasavaraju"],["Arushi Tandon","arushitandon"],["Aryan Karkera","karkeraaryan"],["Ashley Lobo","loboashley"],["Atharva Vankundre","avankundre"],["Ayushi Singh","singhayushi"],["Chirag Bansal","chiragbansal"],["Deepika Dhupar","ddhupar"],["Deepika Nanda","deepikananda"],["Dhanya Viswanath","dhanyav"],["Eemon Roy","eemonroy"],["Fayaz PK","fayazpk"],["Harinie Ananth","hananth"],["Isha Agrawal","ishaagrawal"],["Jayawant Tewari","jayawant.tewari"],["Jui Sonawane","juisonawane"],["June Sardar","junesardar"],["Juraij Kaja Moideen","jkajamoideen"],["Justin Varacheril George","jgeorge"],["Kashish Mehta","kashishmehta"],["Kiran Nadendla","knadendla"],["Komal Singh","komalsingh"],["Krushna Shitap","kshitap"],["Manas Karambelkar","mkarambelkar"],["Manjiri Durge","manjiridurge"],["Meher Jangra","meherjangra"],["Mohamed Siddique","mosiddique"],["Mohan Kumar","mgangappa"],["Monika Nagar","monikanagar"],["Mrigank Haleangadi","mhaleangadi"],["Narayan Menon","narayan.menon"],["Naved Khan","navedkhan"],["Nebin Biju","nebinbiju"],["Neha Motghare","nemot"],["Neha Singh","nesingh"],["Ninad Kale","ninadkale"],["Nithin Chandra S R","nisr"],["Nithin Ismail","nithin.ismail"],["Param Ranjan","paramranjan"],["Poonam Savale","poonamsavale"],["Pradnya Patil","pradnyapatil"],["Pragati Bansal","pragati.bansal"],["Prathima Sharma","prathsharma"],["Pratik Sangeetha","psangeetha"],["Preeti Sahasrabuddhe","preetis"],["Priya .","priy"],["Priyanka Saha","priyankasaha"],["Pulak Anand","pulakanand"],["Puneeth Hegde","puneethhegde"],["Rachit Jain","rachitjain"],["Rahul Goradia","rahulgoradia"],["Raj Rajpara","rajrajpara"],["Ramanuj Nanhoriya","rnanhoriya"],["Ranjana Sharma","ransharma"],["Ranjith Ravi","ranjithravi"],["Rhea Gupta","guptarhea"],["Rohan Baruah","rohanbaruah"],["Ruchi Batra","batraruchi"],["Sarah Zaki","sazaki"],["Sargam Prakash","prakash.sargam"],["Sasha Cherian","sashacherian"],["Satya Srivastava","satyasriv"],["Saugata Pramanik","sapramanik"],["Saurabh Singh","singhsaur"],["Saurav Harsh","sauravharsh"],["Shivani Mate","shivanimate"],["Shravani Gaikwad","shgaikwad"],["Shubham Nikhara","shubham.nikhara"],["Shweta Ratanpura","sratanpura"],["Siddharth S Kumar","siskumar"],["Simran Singh","simransingh"],["Snigdha Srivastava","srivastavasn"],["Sonsy Mishra","sonsymishra"],["Soumya Kasuganti","skasuganti"],["Srihari Hulikal Muralidhar","sriharih"],["Stuti Kamboj","stutikamboj"],["Sunair D","sunairrajd"],["Tania Jain","jaintania"],["Tejus Nagdev","tejusnagdev"],["Thuli Chishi","thulichishi"],["Timothy Jayaraj","tjayaraj"],["Udayan Vidyanta","uvidyanta"],["Vartika Agarwal","varagarwal"],["Venkat Gopal","vevenka"],["Vidhi Bhati","vidhibhati"],["Vijayta Sharma","vijsharma"],["Vinod Mulky","vinodmulky"],["Vishwam Rajagopal","vrajagopal"],["Vivek Menon","vmuralidhar"],["Yamini Gupta","yaminigupta"]];

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

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

async function loadBoardLots() {
  vibeStorage = window.vibehub?.storage || null;
  if (!vibeStorage?.shared) return;
  try {
    const values = await vibeStorage.shared.all();
    boardLots = Object.entries(values)
      .filter(([key, value]) => key.startsWith(LOT_KEY_PREFIX) && value && typeof value === "object")
      .map(([, value]) => value);
    EVENT_EXTRA_LOTS.forEach((extra) => {
      if (!boardLots.some((lot) => lotLetter(lot.title) === lotLetter(extra.title))) boardLots.push(extra);
    });
    donations = new Map(Object.entries(values)
      .filter(([key, value]) => key.startsWith(DONATION_KEY_PREFIX) && value && typeof value === "object")
      .map(([key, value]) => [key.slice(DONATION_KEY_PREFIX.length), value]));
    renderWinners();
    renderHero();
  } catch (error) {
    console.warn("Could not load board items for winner photos.", error);
  }
}

// Post-event: causes and winning bids (All Hearts 2026)
const DONATION_CAUSES = [
  { name: "WeDoGood India Foundation", url: "https://benevity.go.link/3Ny4Q", qr: "qr/wedogood.png" },
  { name: "Impact Guru Foundation", url: "https://benevity.go.link/7kfF0", qr: "qr/impactguru.png" },
  { name: "Grace Cancer Foundation", url: "https://benevity.go.link/2Adue", qr: "qr/gracecancer.png" },
  { name: "Browse more NGOs in India", url: "https://microsoft.benevity.org/search/causes/list/?page=1&query=india&location=22.35284424,79.36334991&location_name=India&locale=en&layout=list", qr: "qr/browse-india.png", cta: "Browse" },
];

const WINNING_BIDS = [
  ["An exclusive photo shoot for you or your family", "Kishore Chamua, CS Jasweth, S Dhondye", "Hyderabad", [["Deepak Menon", 100000], ["Shveta Verma", 80000]]],
  ["Hand-illustrated festive lifafa set", "Tanuja", "Bangalore", [["Sarah Zaki", 10000], ["Amit Patil", 3000], ["Ankur Jhawar", 3000]]],
  ["A Debangshu Moulik 1/15 Limited Ed. Print", "Eemon Roy", "All locations", [["Mohak Gulati", 6000]]],
  ["Bengaluru Book Collection", "Anant Tambade", "Bangalore", [["Ninad", 5500]]],
  ["Signed copy of Book: What still matters", "Amit Patil", "Bangalore", [["Shveta Verma", 5000], ["Prakash Arjunan", 4500]]],
  ["Chapter Zero & Break them apart", "Saurav Harsh", "Hyderabad", [["Pradnya Patil", 3500], ["Deepak Menon", 3000], ["Kishor Chamua", 3000], ["Shveta Verma", 3000], ["Akshit Verma", 1500]]],
  ["Beaded Flower Workshop", "Vartika Agarwal", "Hyderabad", [["Soumya Kasuganti", 3000], ["Chirag Bansal", 2500], ["Srishty Banga", 2000]]],
  ["Drifting Session in a Mercedes", "Abhijeet Singh", "Hyderabad", [["Atharva Vankundre", 3500]]],
  ["A bird photowalk session", "Kishor Chamua", "Hyderabad", [["Abhijeet Singh", 3500]]],
  ["Set of 10 Postcards", "Saugata Pramanik", "Bangalore", [["Shveta Verma", 3000], ["Anudish", 2500], ["Vidhi Bhati", 2200]]],
  ["A four-course North Indian dinner for 3", "Tanuja", "Bangalore", [["Shweta Ratanpura", 3000], ["Srishty Banga", 3000]]],
  ["Coffee and Pickleball with Ankur", "Ankur Jhawar", "Noida", [["Aarya Kabara", 3000]]],
  ["Bowling, Bites & Bragging Rights", "Kashish Bhumbri", "Noida", [["Ankur Jhawar", 2500]]],
  ["Hot Wheels mystery Box", "Ramanuj Nanhoriya", "Bangalore", [["Adithya Holehonnur", 2500], ["Anandhi Hariharan", 2000]]],
];

const formatBidRupees = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const titleWords = (text) => new Set(String(text).toLowerCase().replace(/post ?cards?/g, "postcards").replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !["the", "and", "for", "with", "you", "your", "set"].includes(w)));

function findBoardLot(item, by) {
  const lots = boardLots.filter((lot) => !lot.isExample && lot.status === "approved");
  const want = titleWords(item);
  const byNames = by.toLowerCase().split(/[,&]/).map((n) => n.trim().split(/\s+/)[0]).filter((n) => n.length > 2);
  let best = null;
  let bestScore = 0;
  lots.forEach((lot) => {
    const have = titleWords(lot.title);
    const overlap = [...want].filter((w) => have.has(w)).length / Math.max(1, Math.min(want.size, have.size));
    const sameContributor = byNames.some((n) => String(lot.contributor || "").toLowerCase().includes(n));
    const score = overlap + (sameContributor ? 0.5 : 0);
    if (score > bestScore) { best = lot; bestScore = score; }
  });
  if (bestScore >= 0.6) return best;
  const byContributor = lots.filter((lot) => byNames.some((n) => String(lot.contributor || "").toLowerCase().includes(n)));
  return byContributor.length === 1 ? byContributor[0] : null;
}

function initials(name = "") {
  return String(name).split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase() || "♥";
}

const EXTRA_EMAILS = {
  "ankur jhawar": "ankur.jhawar@microsoft.com",
  "deepak menon": "deepak.menon@microsoft.com",
  "shveta verma": "shveta.verma@microsoft.com",
  "mohak gulati": "mohakgulati@microsoft.com",
  "prakash arjunan": "prakash.arjunan@microsoft.com",
  "srishty banga": "srishtybanga@microsoft.com",
  "anandhi hariharan": "anandhi.hariharan@microsoft.com",
  "adithya holehonnur": "adithyah@microsoft.com",
  "anudish": "akoshal@microsoft.com",
  "ninad": "ninadkale@microsoft.com",
};

function emailFor(name) {
  const key = String(name).trim().toLowerCase();
  if (EXTRA_EMAILS[key]) return EXTRA_EMAILS[key];
  const exact = STUDIO_ROSTER.find(([full]) => full.toLowerCase() === key);
  if (exact) return `${exact[1]}@microsoft.com`;
  const fromBoard = boardLots.find((lot) => String(lot.contributor || "").trim().toLowerCase() === key && (lot.avatarEmail || lot.email));
  if (fromBoard) return (fromBoard.avatarEmail || fromBoard.email).toLowerCase();
  if (!key.includes(" ")) {
    const byFirst = STUDIO_ROSTER.filter(([full]) => full.toLowerCase().split(" ")[0] === key);
    if (byFirst.length === 1) return `${byFirst[0][1]}@microsoft.com`;
  }
  return "";
}

function viewerEmail() {
  return String((vibeStorage || window.vibehub?.storage)?.viewerEmail || "").toLowerCase();
}

const PROOF_LABEL_EMPTY = `<strong><u>Browse files</u> or drag and drop</strong><small>Your Benevity payment screenshots (PNG or JPG). Add one for each donation.</small>`;
const PROOF_LABEL_MORE = `<strong><u>Add another screenshot</u></strong><small>Donated to more than one NGO? Add each receipt.</small>`;
const MAX_PROOFS = 6;
const proofList = (record) => (record?.proofs?.length ? record.proofs : record?.proof ? [record.proof] : []);
const proofTotal = (record) => (Array.isArray(record?.amounts) && !record.legacy ? record.amounts.reduce((sum, a) => sum + (Number(a) || 0), 0) : null);
const MAX_SAVED_PROOFS = 10;
// Records from before amounts were tracked count as fully donated; newer ones only once the screenshots add up to the bid.
function donationState(key) {
  const record = donations.get(key);
  if (!record) return { record: null, done: false, partial: false, total: 0, bid: 0 };
  if (!proofList(record).length) return { record, done: true, partial: false, total: 0, bid: Number(record.amount) || 0 };
  const bid = Number(record.amount ?? findBid(key)?.amount) || 0;
  const total = proofTotal(record);
  const done = total == null || total >= bid;
  return { record, done, partial: !done, total: total || 0, bid };
}
const isDonated = (key) => donationState(key).done;

// Reads the "Donation amount" from a Benevity screenshot in the browser (Tesseract.js, loaded on first use).
const OCR_SCRIPT = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
let ocrWorkerPromise = null;
function ocrWorker() {
  ocrWorkerPromise ||= new Promise((resolve, reject) => {
    if (window.Tesseract) return resolve();
    const script = document.createElement("script");
    script.src = OCR_SCRIPT;
    script.onload = resolve;
    script.onerror = () => reject(new Error("Could not load the screenshot reader."));
    document.head.appendChild(script);
  }).then(() => window.Tesseract.createWorker("eng"));
  ocrWorkerPromise.catch(() => { ocrWorkerPromise = null; });
  return ocrWorkerPromise;
}
let ocrQueue = Promise.resolve();
function readProofAmount(file, bid) {
  const job = ocrQueue.then(async () => {
    const worker = await ocrWorker();
    const { data } = await worker.recognize(file);
    return parseDonationAmount(data?.text || "", bid);
  });
  ocrQueue = job.catch(() => {});
  return job;
}
function parseDonationAmount(text, bid) {
  const flat = String(text).replace(/\s+/g, " ");
  // OCR often misreads "₹" as %, ¥, F or even a leading 3/2.
  const m = flat.match(/Donation amount\s*([^\d\s]{0,2})\s*(\d[\d,]*(?:\.\d{1,2})?)/i)
    || flat.match(/([₹%¥])\s?(\d[\d,]*\.\d{2})/);
  if (!m) return null;
  const toNum = (str) => Number(str.replace(/,/g, ""));
  const grouped = (str) => /^\d{1,3}(,\d{2,3})*(\.\d{1,2})?$/.test(str) || /^\d+(\.\d{1,2})?$/.test(str);
  let value = toNum(m[2]);
  if (!m[1] && m[2].length > 1) {
    const stripped = m[2].slice(1);
    if (/^[1-9]/.test(stripped) && grouped(stripped) && value > bid) value = toNum(stripped);
  }
  return Number.isFinite(value) && value > 0 ? Math.round(value * 100) / 100 : null;
}

// Temporary: a test item, visible only to coordinators, to try the donation flow.
const TEST_BID = ["Test item (coordinators only)", "Mohan Kumar", "Anywhere", [["Mohan Kumar", 100], ["Abhishek Ranjan", 100], ["Ranjith Ravi", 100]]];
const isTestBid = (bid) => bid === TEST_BID;

const COORDINATORS = ["abhisranjan@microsoft.com", "mgangappa@microsoft.com", "ranjithravi@microsoft.com"];

function isCoordinator() {
  return COORDINATORS.includes(viewerEmail());
}

function isViewer(name, letter) {
  const me = viewerEmail();
  if (!me) return false;
  const email = emailFor(name);
  if (email) return email === me;
  const alias = me.split("@")[0].replace(/[^a-z]/g, "");
  const parts = String(name).toLowerCase().split(/\s+/).filter(Boolean);
  return parts.length > 1 && alias.includes(parts[0]) && alias.includes(parts[parts.length - 1].slice(0, 4));
}

function avatar(name, email = emailFor(name)) {
  const img = email ? `<img src="/api/avatar/${encodeURIComponent(email)}" alt="" loading="lazy" onerror="this.remove()">` : "";
  return `<span class="person-avatar" aria-hidden="true">${escapeHtml(initials(name))}${img}</span>`;
}

function buildEntries() {
  const lots = boardLots.filter((lot) => !lot.isExample && lot.status === "approved");
  const bidByLot = new Map();
  const unmatched = [];
  const bids = isCoordinator() ? [...WINNING_BIDS, TEST_BID] : WINNING_BIDS;
  bids.forEach((bid) => {
    const letter = lotLetter(bid[0]);
    const lot = lots.find((item) => letter && lotLetter(item.title) === letter) || findBoardLot(bid[0], bid[1]);
    if (lot && !bidByLot.has(lot)) bidByLot.set(lot, bid);
    else unmatched.push(bid);
  });
  const entries = [
    ...lots.filter((lot) => bidByLot.has(lot)).map((lot) => ({ lot, bid: bidByLot.get(lot) })),
    ...unmatched.map((bid) => ({ lot: null, bid })),
  ];
  const letterOf = (e) => lotLetter(e.lot?.title || e.bid?.[0]) || "~";
  return entries.sort((a, b) => letterOf(a).localeCompare(letterOf(b)));
}

let winnersView = "all";

function renderWinners(query = document.querySelector("#winnerSearch")?.value || "") {
  const list = document.querySelector("#winnersList");
  if (!list) return;
  const q = query.trim().toLowerCase();
  const entries = buildEntries();
  const mineEntries = entries.filter(({ lot, bid }) => (bid?.[3] || []).some(([n]) => isViewer(n)));
  const viewBox = document.querySelector("#winnersView");
  if (viewBox) {
    viewBox.hidden = !mineEntries.length;
    if (!mineEntries.length) winnersView = "all";
    viewBox.querySelectorAll("[data-view]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.view === winnersView)));
    document.querySelector("#myItemsCount").textContent = `(${mineEntries.length})`;
  }
  const rows = (winnersView === "mine" ? mineEntries : entries).filter(({ lot, bid }) => !q
    || (q.length === 1 && lotLetter(lot?.title || bid?.[0]).toLowerCase() === q)
    || [lot?.title, lot?.contributor, bid?.[0], bid?.[1], ...(bid?.[3] || []).map(([n]) => n)]
      .some((text) => String(text || "").toLowerCase().includes(q)));
  list.innerHTML = rows.map(({ lot, bid }) => {
    const title = lot?.title || bid[0];
    const by = lot?.contributor || bid[1];
    const city = bid?.[2] || (lot?.city === "Remote" ? "Anywhere" : lot?.city || "");
    const photo = lot ? lotImageUrl(lotImages(lot)[0]) : "";
    const winners = bid?.[3] || [];
    const letter = lotLetter(title) || lotLetter(bid?.[0]);
    const total = winners.reduce((sum, [, amount]) => sum + amount, 0);
    const byEmail = (lot?.avatarEmail || lot?.email || "").toLowerCase() || emailFor(by);
    return `
    <article class="winner-card${winners.length ? "" : " winner-card--open"}">
      <div class="winner-card__top" role="button" tabindex="0" data-preview="${escapeHtml(title)}" aria-label="Preview ${escapeHtml(title)}">
        ${letter ? `<span class="winner-card__letter" aria-label="Item ${letter}">${letter}</span>` : ""}
        <span class="winner-card__visual">${photo ? `<img class="winner-card__photo" src="${escapeHtml(photo)}" alt="" loading="lazy">` : `<span class="winner-card__photo winner-card__photo--empty" aria-hidden="true">♥</span>`}${total ? `<span class="raised-sticker" aria-label="${formatBidRupees(total)} raised">${formatBidRupees(total)}<small>raised</small></span>` : ""}</span>
        <div class="winner-card__item">
          <strong>${escapeHtml(title)}</strong>
          <span class="winner-card__by">${avatar(by, byEmail)}${escapeHtml(by)}${city ? ` · ${escapeHtml(city)}` : ""}</span>
          ${lot?.description ? `<p>${escapeHtml(lot.description)}</p>` : ""}
        </div>
      </div>
      ${winners.length ? `
      <p class="winner-card__label">Bid winners</p>
      <ul class="winner-card__bids" aria-label="Bid winners">
        ${winners.map(([name, amount]) => {
          const key = donationKey(letter, name);
          const state = donationState(key);
          const done = state.done;
          const mine = isViewer(name, letter);
          const coordView = !mine && !!state.record && isCoordinator();
          const open = (mine || coordView) && openPanel === key;
          const action = mine || coordView
            ? `<button type="button" class="donate-btn${done ? " donate-btn--done" : ""}" data-donate="${escapeHtml(key)}" aria-expanded="${open}">${done ? `✓ Donated${isCoordinator() ? `<i class="donate-caret" aria-hidden="true">${open ? "▴" : "▾"}</i>` : ""}` : open ? "Close" : state.partial ? `${formatBidRupees(state.bid - state.total)} to go` : "Donate"}</button>`
            : `<span class="donate-status${done ? " donate-status--done" : state.partial ? " donate-status--partial" : ""}">${done ? "✓ Donated" : state.partial ? "Partly donated" : "Yet to donate"}</span>`;
          return `<li class="${q && name.toLowerCase().includes(q) ? "is-match" : ""}${open ? " is-open" : ""}${mine ? " is-mine" : ""}"><span>${avatar(name)}${escapeHtml(name)}${mine ? `<em class="you-tag">You</em>` : ""}</span><b>${formatBidRupees(amount)}</b>${action}</li>${open ? `<li class="donate-inline">${donationPanel({ key, letter, title, by, byEmail, name, amount, mine })}</li>` : ""}`;
        }).join("")}
      </ul>
      `
      : `<p class="winner-card__none">No winning bid this time</p>`}
    </article>`;
  }).join("");
  document.querySelector("#winnersEmpty").hidden = rows.length > 0;
}


const ORGANISERS_LINE = "the organising team (Mohan, Abhishek and Ranjith)";
const ORGANISERS_LINE_CAP = ORGANISERS_LINE[0].toUpperCase() + ORGANISERS_LINE.slice(1);

function donationPanel({ key, letter, title, by, byEmail, name, amount, mine = true }) {
  const record = donations.get(key);
  const first = name.split(" ")[0];
  const byFirst = String(by).split(/[ ,]/)[0];
  const state = donationState(key);
  const canEdit = mine;
  if (state.record && !panelReplacing) {
    const proofs = proofList(record).map(lotImageUrl);
    const amounts = Array.isArray(record.amounts) ? record.amounts : [];
    const total = proofTotal(record);
    const bid = state.bid || Number(amount) || 0;
    const edited = isCoordinator() && (record.readAmounts || []).some((read, i) => read != null && Number(read) !== Number(amounts[i]));
    const tally = total == null ? (state.done && bid ? `<p class="donate-tally is-ok">✓ ${formatBidRupees(bid)} of ${formatBidRupees(bid)} donated</p>` : "") : `<p class="donate-tally ${state.done ? "is-ok" : "is-partial"}">${state.done ? "✓ " : ""}${formatBidRupees(total)} of ${formatBidRupees(bid)} donated${state.partial ? ` · ${formatBidRupees(bid - total)} to go` : ""}${edited ? `<small>Amounts edited after auto-read: ${(record.readAmounts || []).map((r) => (r == null ? "—" : formatBidRupees(r))).join(", ")}</small>` : ""}</p>`;
    const head = state.done
      ? `<span class="donate-done__tick" aria-hidden="true">✓</span>
      <h4>${escapeHtml(first)}’s donation is in. Thank you!</h4>
      <p>${ORGANISERS_LINE_CAP} will coordinate with ${escapeHtml(byFirst)} to get the gift to ${mine ? "you" : escapeHtml(first)}.</p>`
      : `<h4>${mine ? "You're" : `${escapeHtml(first)}’s`} part of the way there</h4>
      <p>${mine ? `Donate the remaining ${formatBidRupees(bid - total)} on Benevity, then upload its screenshot here.` : `${escapeHtml(first)} still has ${formatBidRupees(bid - total)} to donate.`}</p>`;
    const full = proofs.length >= MAX_SAVED_PROOFS;
    return `<div class="donate-done${state.partial ? " donate-done--partial" : ""}">
      ${head}
      <div class="donate-done__actions">
        ${proofs.map((url, i) => `<span class="donate-proof-wrap">${url ? `<a class="donate-proof" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer"><img src="${escapeHtml(url)}" alt="Payment screenshot ${i + 1}">` : `<span class="donate-proof">`}${proofs.length > 1 ? `Screenshot ${i + 1}` : "View screenshot"}${amounts[i] != null ? ` · ${formatBidRupees(amounts[i])}` : ""}${url ? "</a>" : "</span>"}${canEdit ? `<button type="button" class="donate-proof__remove" data-proof-delete="${i}" data-key="${escapeHtml(key)}" aria-label="Remove screenshot ${i + 1}">×</button>` : ""}</span>`).join("")}
      </div>
      ${tally}
      <p class="donate-error" data-proof-error hidden></p>
      ${mine && !full ? `<button type="button" class="${state.partial ? "donate-submit donate-more" : "donate-link"}" data-replace="${escapeHtml(key)}">Upload more screenshots</button>` : ""}
    </div>`;
  }
  const savedProofs = state.record ? proofList(record) : [];
  const saved = savedProofs.length;
  const savedAmounts = state.record && Array.isArray(record.amounts) && !record.legacy ? record.amounts : [];
  const savedTotal = state.record ? proofTotal(record) : 0;
  const causes = DONATION_CAUSES.map((c) => `<a class="donate-cause" href="${escapeHtml(c.url)}" target="_blank" rel="noopener noreferrer"><img src="${escapeHtml(c.qr)}" alt="QR code for ${escapeHtml(c.name)}" loading="lazy"><strong>${escapeHtml(c.name)}</strong><i>${c.cta || "Donate"} ↗</i></a>`).join("");
  return `<div class="donate-step">
      <h4><b>1</b>Donate ${saved && savedTotal != null ? (amount - savedTotal > 0 ? `the remaining ${formatBidRupees(amount - savedTotal)} ` : "") : `${formatBidRupees(amount)} `}on Benevity</h4>
      <p>Give it all to one NGO or split it across a few. Microsoft matches your donation.</p>
      <div class="donate-causes">${causes}</div>
    </div>
    <div class="donate-step">
      <h4><b>2</b>Upload your payment screenshots</h4>
      ${saved ? `<ul class="donate-thumbs donate-thumbs--saved">${savedProofs.map((proof, i) => {
        const url = lotImageUrl(proof);
        return `<li>${url ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer"><img src="${escapeHtml(url)}" alt="Payment screenshot ${i + 1}"></a>` : ""}<span>Screenshot ${i + 1}<em class="donate-thumbs__note">Uploaded earlier</em></span>${savedAmounts[i] != null ? `<b class="donate-thumbs__amount">${formatBidRupees(savedAmounts[i])}</b>` : ""}<button type="button" class="donate-upload__clear" data-proof-delete="${i}" data-key="${escapeHtml(key)}" aria-label="Remove screenshot ${i + 1}">×</button></li>`;
      }).join("")}</ul>` : ""}
      <ul class="donate-thumbs" data-proof-thumbs hidden></ul>
      ${saved && savedTotal != null ? `<p class="donate-tally ${savedTotal >= amount ? "is-ok" : "is-partial"}" data-proof-tally>${savedTotal >= amount ? "✓ " : ""}Total ${formatBidRupees(savedTotal)} of ${formatBidRupees(amount)}</p>` : `<p class="donate-tally" data-proof-tally hidden></p>`}
      <label class="donate-upload">
        <input type="file" accept="image/*" multiple data-proof-input>
        <span data-proof-label>${PROOF_LABEL_EMPTY}</span>
      </label>
      <button type="button" class="donate-submit" data-proof-submit="${escapeHtml(key)}" data-bid="${Number(amount) || 0}" data-saved="${savedTotal || 0}" data-saved-count="${saved}" data-legacy="${saved && savedTotal == null ? 1 : 0}" disabled>Submit donation proof</button>
      <p class="donate-error" data-proof-error role="alert" hidden></p>
      ${saved ? `<p class="donate-cancel"><button type="button" class="donate-link" data-donate-cancel>Cancel</button></p>` : ""}
    </div>
    <div class="donate-step donate-step--next">
      <h4><b>3</b>Get your gift</h4>
      <p>Once submitted, ${ORGANISERS_LINE} will coordinate with ${escapeHtml(byFirst)} to get it to you.</p>
    </div>`;
}

function findBid(key) {
  for (const { lot, bid } of buildEntries()) {
    const letter = lotLetter(lot?.title || bid?.[0]);
    const hit = (bid?.[3] || []).find(([name]) => donationKey(letter, name) === key);
    if (hit) {
      const by = lot?.contributor || bid[1];
      return { letter, title: lot?.title || bid[0], by, byEmail: (lot?.avatarEmail || lot?.email || "").toLowerCase() || emailFor(by), name: hit[0], amount: hit[1] };
    }
  }
  return null;
}

// Teams channel webhook (Workflows), called through the VibeHub API Connection "teams-notify"
// so the signature stays server-side. Empty query = notifications off.
const TEAMS_NOTIFY = { url: "/api/proxy/teams-notify/invoke", query: "" };
const SITE_URL = "https://vibehub.microsoft.com/app/ranjithravi-kq9qtf/";

function notifyTeams(info, byEmail) {
  if (!TEAMS_NOTIFY.query) return;
  const winnerEmail = emailFor(info.name) || viewerEmail();
  const mention = (name, email) => email ? { type: "mention", text: `<at>${name}</at>`, mentioned: { id: email, name } } : null;
  const who = (name, email) => email ? `<at>${name}</at>` : name;
  const item = `${info.letter && info.letter !== "Z" ? `${info.letter} · ` : ""}${info.title}`;
  const card = {
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
    type: "AdaptiveCard",
    version: "1.4",
    body: [
      { type: "TextBlock", text: "💝 Donation received", weight: "Bolder", size: "Medium" },
      { type: "TextBlock", wrap: true, text: `${who(info.name, winnerEmail)} has donated **${formatBidRupees(info.amount)}** for **${item}**.` },
      { type: "TextBlock", wrap: true, text: `${who(info.by, byEmail)}, please reach out to arrange the gift. Thank you both for celebrating the joy of giving!` },
    ],
    actions: [{ type: "Action.OpenUrl", title: "Open GIVE Bazaar", url: SITE_URL }],
    msteams: { width: "Full", entities: [mention(info.name, winnerEmail), mention(info.by, byEmail)].filter((m, i, all) => m && all.findIndex((o) => o?.mentioned.id === m.mentioned.id) === i) },
  };
  fetch(`${TEAMS_NOTIFY.url}?${TEAMS_NOTIFY.query}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "message", attachments: [{ contentType: "application/vnd.microsoft.card.adaptive", content: card }] }),
  }).catch((err) => console.error("Teams notification failed.", err));
}

async function submitProof(key, scope) {
  const info = findBid(key);
  const items = scope.proofItems || [];
  const files = items.map((item) => item.file);
  const button = scope.querySelector("[data-proof-submit]");
  const error = scope.querySelector("[data-proof-error]");
  if (!info || !files.length) return;
  const fail = (msg) => { error.textContent = msg; error.hidden = false; updateProofTally(scope); };
  const check = proofCheck(scope);
  if (!check.ready) return fail(check.message);
  if (!vibeStorage?.images || !vibeStorage?.shared || vibeStorage.isPublicShare) return fail("Please open the site signed in to VibeHub to upload.");
  if (files.some((f) => f.size > 10 * 1024 * 1024)) return fail("One of the images is over 10 MB. Try a smaller screenshot.");
  button.disabled = true;
  button.textContent = "Uploading…";
  error.hidden = true;
  try {
    const stamp = Date.now();
    const proofs = [];
    for (const [i, file] of files.entries()) {
      if (files.length > 1) button.textContent = `Uploading ${i + 1} of ${files.length}…`;
      const imageKey = `donation-${key}-${stamp}${i ? `-${i + 1}` : ""}`;
      const meta = await vibeStorage.images.set(imageKey, file, { public: true });
      proofs.push({ key: imageKey, viewer: vibeStorage.viewerEmail || "", url: meta?.url || "" });
    }
    const old = donations.get(key);
    const wasDone = isDonated(key);
    const oldProofs = proofList(old);
    const legacy = !!old && (old.legacy || !Array.isArray(old.amounts));
    const oldAmounts = oldProofs.map((_, i) => (legacy ? null : old.amounts[i] ?? null));
    const oldRead = oldProofs.map((_, i) => old?.readAmounts?.[i] ?? null);
    const allProofs = [...oldProofs, ...proofs];
    const amounts = [...oldAmounts, ...items.map((item) => item.amount)];
    const readAmounts = [...oldRead, ...items.map((item) => (item.read == null ? null : item.read))];
    const record = { ...info, proof: allProofs[0], proofs: allProofs, amounts, readAmounts, total: amounts.reduce((a, b) => a + (b || 0), 0), ...(legacy ? { legacy: true } : {}), submittedBy: old?.submittedBy || vibeStorage.viewerEmail || "", at: old?.at || new Date().toISOString(), updatedAt: new Date().toISOString() };
    await vibeStorage.shared.set(DONATION_KEY_PREFIX + key, record);
    donations.set(key, record);
    if (!wasDone && isDonated(key)) notifyTeams(info, info.byEmail);
    panelReplacing = false;
    renderWinners();
    renderHero();
  } catch (err) {
    console.error("Could not upload donation proof.", err);
    fail("Upload didn't go through. Check your connection and try again.");
  }
}

async function deleteSavedProof(key, index, button) {
  const old = donations.get(key);
  const proofs = proofList(old);
  if (!old || !proofs[index]) return;
  const amount = Array.isArray(old.amounts) && !old.legacy ? old.amounts[index] : null;
  const last = proofs.length === 1;
  if (!confirm(`Remove screenshot ${index + 1}${amount != null ? ` (${formatBidRupees(amount)})` : ""}?${last ? " This was the only one, so the donation will be marked as not done." : ""}`)) return;
  const error = button.closest(".donate-done, .donate-step")?.querySelector("[data-proof-error]");
  if (!vibeStorage?.shared || vibeStorage.isPublicShare) {
    if (error) { error.textContent = "Please open the site signed in to VibeHub to make changes."; error.hidden = false; }
    return;
  }
  button.disabled = true;
  try {
    if (last) {
      await vibeStorage.shared.delete(DONATION_KEY_PREFIX + key);
      donations.delete(key);
    } else {
      const keep = (list) => (Array.isArray(list) ? list.filter((_, i) => i !== index) : list);
      const next = { ...old, proofs: keep(proofs), amounts: keep(old.amounts), readAmounts: keep(old.readAmounts), updatedAt: new Date().toISOString() };
      next.proof = next.proofs[0];
      if (Array.isArray(next.amounts)) next.total = next.amounts.reduce((a, b) => a + (Number(b) || 0), 0);
      if (next.legacy && next.amounts?.every((a) => a == null)) { delete next.amounts; delete next.readAmounts; delete next.total; delete next.legacy; }
      await vibeStorage.shared.set(DONATION_KEY_PREFIX + key, next);
      donations.set(key, next);
    }
    if (proofs[index].key) vibeStorage.images.delete(proofs[index].key).catch(() => {});
    renderWinners();
    renderHero();
  } catch (err) {
    console.error("Could not remove the screenshot.", err);
    button.disabled = false;
    if (error) { error.textContent = "Couldn't remove it. Check your connection and try again."; error.hidden = false; }
  }
}

function winnerPeople() {
  const map = new Map();
  buildEntries().filter(({ bid }) => !isTestBid(bid)).forEach(({ lot, bid }) => {
    const letter = lotLetter(lot?.title || bid?.[0]);
    (bid?.[3] || []).forEach(([name]) => {
      const slug = winnerSlug(name);
      if (!map.has(slug)) map.set(slug, { name: name.trim(), keys: [] });
      map.get(slug).keys.push(donationKey(letter, name));
    });
  });
  return [...map.values()];
}

// Spread faces evenly along the ellipse outline so they don't bunch up when the ring is wide and short.
function ringSpots(count, rect) {
  const ratio = rect.width && rect.height ? rect.height / rect.width : 1;
  const steps = 720;
  const points = [];
  let length = 0;
  for (let s = 0; s <= steps; s++) {
    const a = (-90 + (s / steps) * 360) * Math.PI / 180;
    const p = [Math.cos(a), Math.sin(a)];
    if (s) length += Math.hypot(p[0] - points[s - 1][0], (p[1] - points[s - 1][1]) * ratio);
    points.push([...p, length]);
  }
  return Array.from({ length: count }, (_, i) => {
    const target = ((i + 0.5) / count) * length;
    const [cx, cy] = points.find((p) => p[2] >= target) || points[steps];
    return [(50 + 47 * cx).toFixed(1), (50 + 47 * cy).toFixed(1)];
  });
}
let heroResizeTimer;
window.addEventListener("resize", () => { clearTimeout(heroResizeTimer); heroResizeTimer = setTimeout(renderHero, 200); });

function renderHero() {
  const people = winnerPeople();
  const ring = document.querySelector("#winnerRing");
  if (ring) {
    const spots = ringSpots(people.length, ring.getBoundingClientRect());
    ring.innerHTML = people.map(({ name, keys }, i) => {
      const [x, y] = spots[i];
      const r = (i % 2 ? 1 : -1) * (3 + (i % 3) * 2);
      const done = keys.every(isDonated);
      return `<li style="--x:${x}%;--y:${y}%;--r:${r}deg;--d:${(i % 5) * 0.4}s" title="${escapeHtml(name)}${done ? " · donated" : ""}">${avatar(name)}<span>${escapeHtml(name.split(" ")[0])}</span></li>`;
    }).join("");
  }
  const counter = document.querySelector("#donatedCount");
  if (counter) {
    const doneCount = people.filter((p) => p.keys.every(isDonated)).length;
    counter.innerHTML = `<b>${doneCount} of ${people.length}</b> bid winners have donated`;
  }
  const row = document.querySelector("#contributorRow");
  if (!row) return;
  const seen = new Set();
  const contributors = [];
  buildEntries().filter(({ bid }) => !isTestBid(bid)).forEach(({ lot, bid }) => {
    const raw = String(lot?.contributor || bid?.[1] || "").split(/,|&| and /)[0].trim();
    const parts = raw.toLowerCase().split(/\s+/);
    const key = `${parts[0].slice(0, 5)} ${parts.slice(1).join(" ")}`;
    const email = (lot?.avatarEmail || lot?.email || "").toLowerCase() || emailFor(raw);
    if (!raw || seen.has(key) || (email && seen.has(email))) return;
    seen.add(key);
    if (email) seen.add(email);
    const name = raw.includes("@") || (!raw.includes(" ") && raw.includes(".")) ? raw.split("@")[0].split(".").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ") : raw;
    contributors.push({ name, email });
  });
  row.innerHTML = contributors.map(({ name, email }) => `<li><button type="button" data-filter="${escapeHtml(name.split(" ")[0])}" title="${escapeHtml(name)}" aria-label="Show items by ${escapeHtml(name)}">${avatar(name, email)}</button></li>`).join("");
}

renderWinners();
renderHero();
document.querySelector("#winnerSearch")?.addEventListener("input", (event) => renderWinners(event.target.value));
const CATEGORY_COLORS = { experiences: "#ff8a7f", services: "#f7ca45", products: "#8bb6ee", food: "#a7e5cb", leadership: "#f7a55c", travel: "#eba7bc" };

function openPreview(title) {
  const entry = buildEntries().find(({ lot, bid }) => (lot?.title || bid?.[0]) === title);
  const dialog = document.querySelector("#auctionDialog");
  if (!entry || !dialog) return;
  const { lot, bid } = entry;
  const $ = (id) => dialog.querySelector(`#${id}`);
  const letter = lotLetter(title) || lotLetter(bid?.[0]);
  const city = bid?.[2] || (lot?.city === "Remote" ? "Anywhere / remote" : lot?.city === "Bengaluru" ? "Bangalore" : lot?.city || "Anywhere");
  const winners = bid?.[3] || [];
  $("auctionLotNumber").textContent = letter ? `#${letter}` : "";
  $("auctionKicker").textContent = letter ? `ITEM ${letter}` : "UP FOR AUCTION";
  $("auctionTitle").textContent = title;
  const contributor = lot?.contributor || bid?.[1] || "";
  $("auctionContributor").textContent = contributor;
  const team = String(lot?.team || "").split(/[,|]/).map((m) => m.trim()).filter(Boolean);
  const people = team.length
    ? team.map((m) => { const email = m.includes("@") ? m.toLowerCase() : `${m.toLowerCase()}@microsoft.com`; const name = STUDIO_ROSTER.find(([, a]) => `${a}@microsoft.com` === email)?.[0] || m; return [name, email]; })
    : [[contributor, emailFor(contributor) || (lot?.avatarEmail || lot?.email || "").toLowerCase()]];
  $("auctionContributorAvatars").innerHTML = contributor ? people.slice(0, 4).map(([n, e]) => avatar(n, e)).join("") : "";
  $("auctionDescription").textContent = lot?.description || "";
  $("auctionLocation").textContent = city;
  $("auctionQuantity").textContent = lot?.quantity || winners.length || 1;
  $("auctionStartingBid").textContent = Number(lot?.startingBid || 500).toLocaleString("en-IN");
  $("auctionRuleLabel").textContent = winners.length ? "WON BY" : "RESULT";
  $("auctionWonBy").textContent = winners.length ? winners.map(([n]) => n).join(", ") : "No winning bid";
  const visual = $("auctionVisual");
  const raised = winners.reduce((sum, [, amount]) => sum + amount, 0);
  visual.querySelector(".raised-sticker")?.remove();
  if (raised) visual.insertAdjacentHTML("beforeend", `<span class="raised-sticker raised-sticker--preview">Raised ${formatBidRupees(raised)}${winners.length > 1 ? ` <small>× ${winners.length} bids</small>` : ""}</span>`);
  visual.style.background = CATEGORY_COLORS[lot?.category] || CATEGORY_COLORS.experiences;
  visual.querySelector(".auction-gallery")?.remove();
  const photos = lot ? lotImages(lot).map(lotImageUrl).filter(Boolean) : [];
  $("auctionGlyph").hidden = photos.length > 0;
  if (photos.length) {
    const gallery = document.createElement("div");
    const multiple = photos.length > 1;
    gallery.className = `auction-gallery${multiple ? " auction-gallery--carousel" : ""}`;
    gallery.innerHTML = `<div class="auction-gallery__track">${photos.map((src, i) => `<img src="${escapeHtml(src)}" alt="${escapeHtml(title)} photo ${i + 1} of ${photos.length}">`).join("")}</div>${multiple ? `
      <button class="auction-gallery__arrow auction-gallery__arrow--prev" type="button" data-gallery-step="-1" aria-label="Previous photo">‹</button>
      <button class="auction-gallery__arrow auction-gallery__arrow--next" type="button" data-gallery-step="1" aria-label="Next photo">›</button>
      <div class="auction-gallery__dots" aria-hidden="true">${photos.map(() => "<i></i>").join("")}</div>` : ""}`;
    visual.appendChild(gallery);
  }
  dialog.showModal();
  setGallerySlide(visual.querySelector(".auction-gallery"), 0);
}

function setGallerySlide(gallery, index) {
  if (!gallery) return fitPreviewPhoto();
  const count = gallery.querySelectorAll(".auction-gallery__track img").length;
  const next = (index + count) % count;
  gallery.dataset.index = String(next);
  gallery.querySelector(".auction-gallery__track").style.transform = `translateX(-${next * 100}%)`;
  gallery.querySelectorAll(".auction-gallery__dots i").forEach((dot, i) => dot.classList.toggle("is-active", i === next));
  fitPreviewPhoto();
}

// Size the photo frame to the current photo's aspect ratio so nothing is cropped.
function fitPreviewPhoto() {
  const visual = document.querySelector("#auctionVisual");
  if (!visual) return;
  const gallery = visual.querySelector(".auction-gallery");
  visual.classList.remove("is-photo-fit");
  visual.style.width = "";
  visual.style.height = "";
  if (!gallery) return;
  const img = gallery.querySelectorAll(".auction-gallery__track img")[Number(gallery.dataset.index || 0)];
  if (!img || img.classList.contains("is-img-broken")) return;
  if (!img.complete || !img.naturalWidth) return img.addEventListener("load", fitPreviewPhoto, { once: true });
  if (!visual.getBoundingClientRect().width) return;
  const ratio = img.naturalWidth / img.naturalHeight;
  const border = parseFloat(getComputedStyle(visual).borderLeftWidth) || 0;
  const maxWidth = visual.getBoundingClientRect().width - border * 2;
  const maxHeight = window.innerHeight * (window.matchMedia("(max-width: 760px)").matches ? 0.55 : 0.68) - border * 2;
  const width = Math.min(maxWidth, maxHeight * ratio);
  visual.classList.add("is-photo-fit");
  visual.style.width = `${Math.round(width + border * 2)}px`;
  visual.style.height = `${Math.round(width / ratio + border * 2)}px`;
}
window.addEventListener("resize", () => { if (document.querySelector("#auctionDialog")?.open) fitPreviewPhoto(); });
document.querySelector("#auctionDialog")?.addEventListener("click", (event) => {
  const dialog = event.currentTarget;
  if (event.target.closest('.auction-preview-nav a[aria-current="page"]')) { event.preventDefault(); return dialog.close(); }
  if (event.target === dialog || event.target.closest("[data-close-auction]")) return dialog.close();
  const arrow = event.target.closest("[data-gallery-step]");
  if (arrow) {
    const gallery = arrow.closest(".auction-gallery");
    setGallerySlide(gallery, Number(gallery.dataset.index || 0) + Number(arrow.dataset.galleryStep));
  }
});

document.addEventListener("keydown", (event) => {
  const top = event.target.closest?.("[data-preview]");
  if (top && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); openPreview(top.dataset.preview); }
});
document.addEventListener("click", (event) => {
  const preview = event.target.closest("[data-preview]");
  if (preview) return openPreview(preview.dataset.preview);
  const toggle = event.target.closest("[data-donate]")?.dataset.donate;
  if (toggle) {
    openPanel = openPanel === toggle ? "" : toggle;
    panelReplacing = false;
    renderWinners();
    return;
  }
  const replace = event.target.closest("[data-replace]")?.dataset.replace;
  if (replace) { panelReplacing = true; renderWinners(); return; }
  if (event.target.closest("[data-donate-cancel]")) { panelReplacing = false; renderWinners(); return; }
  const del = event.target.closest("[data-proof-delete]");
  if (del) return deleteSavedProof(del.dataset.key, Number(del.dataset.proofDelete), del);
  const clear = event.target.closest("[data-proof-remove]");
  if (clear) {
    event.preventDefault();
    const scope = clear.closest(".donate-inline");
    scope.proofItems = (scope.proofItems || []).filter((_, i) => i !== Number(clear.dataset.proofRemove));
    renderProofThumbs(scope);
    return;
  }
  const submit = event.target.closest("[data-proof-submit]");
  if (submit) return submitProof(submit.dataset.proofSubmit, submit.closest(".donate-inline"));
  const view = event.target.closest("#winnersView [data-view]")?.dataset.view;
  if (view) { winnersView = view; renderWinners(); return; }
  const filter = event.target.closest("button[data-filter]")?.dataset.filter;
  if (filter) {
    const search = document.querySelector("#winnerSearch");
    search.value = filter;
    renderWinners(filter);
    document.querySelector("#winnersList")?.closest(".results-block")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});
["dragenter", "dragover"].forEach((type) => document.addEventListener(type, (event) => {
  event.target.closest?.(".donate-upload")?.classList.add("is-dragover");
}));
["dragleave", "drop"].forEach((type) => document.addEventListener(type, (event) => {
  event.target.closest?.(".donate-upload")?.classList.remove("is-dragover");
}));
document.addEventListener("change", (event) => {
  if (!event.target.matches("[data-proof-input]")) return;
  const scope = event.target.closest(".donate-inline");
  const picked = [...(event.target.files || [])].filter((f) => f.type.startsWith("image/"));
  event.target.value = "";
  if (!picked.length || !scope) return;
  const bid = Number(scope.querySelector("[data-proof-submit]")?.dataset.bid) || 0;
  const added = picked.map((file) => ({ file, amount: null, read: null, reading: true, edited: false }));
  const all = [...(scope.proofItems || []), ...added];
  const room = Math.min(MAX_PROOFS, MAX_SAVED_PROOFS - (Number(scope.querySelector("[data-proof-submit]")?.dataset.savedCount) || 0));
  scope.proofItems = all.slice(0, room);
  renderProofThumbs(scope, all.length > room ? `You can add up to ${room} more screenshot${room === 1 ? "" : "s"}.` : "");
  added.filter((item) => scope.proofItems.includes(item)).forEach((item) => {
    readProofAmount(item.file, bid)
      .then((value) => { item.read = value; item.amount = value; })
      .catch((err) => console.warn("Could not read the screenshot amount.", err))
      .finally(() => {
        item.reading = false;
        const i = (scope.proofItems || []).indexOf(item);
        const box = scope.querySelector(`[data-proof-amount="${i}"]`);
        if (i < 0 || !box) return;
        box.innerHTML = proofAmountText(item);
        box.classList.toggle("is-empty", item.amount == null);
        box.closest("li")?.querySelector(".donate-thumbs__note")?.replaceChildren(document.createTextNode(proofNote(item)));
        updateProofTally(scope);
      });
  });
});

function proofCheck(scope) {
  const items = scope.proofItems || [];
  const data = scope.querySelector("[data-proof-submit]")?.dataset || {};
  const bid = Number(data.bid) || 0;
  const legacy = data.legacy === "1";
  const total = Number(data.saved || 0) + items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const base = { ready: false, partial: false, total, bid, legacy, message: "" };
  if (!items.length) return base;
  if (items.some((item) => item.amount == null && item.reading)) return { ...base, message: "Reading the amounts from your screenshots…" };
  if (items.some((item) => item.amount == null)) return { ...base, message: "We couldn't read the amount on a screenshot. Remove it and upload a clearer one of the Benevity receipt." };
  if (!legacy && bid && total < bid) return { ...base, ready: true, partial: true, message: `${formatBidRupees(bid - total)} still to go. You can submit these now and upload the rest later.` };
  return { ...base, ready: true };
}

function updateProofTally(scope) {
  const items = scope.proofItems || [];
  const check = proofCheck(scope);
  const tally = scope.querySelector("[data-proof-tally]");
  tally.hidden = (!items.length && !Number(scope.querySelector("[data-proof-submit]")?.dataset.savedCount)) || check.legacy;
  tally.className = `donate-tally ${check.partial ? "is-partial" : check.ready ? "is-ok" : ""}`;
  tally.innerHTML = `${check.ready && !check.partial ? "✓ " : ""}Total ${formatBidRupees(check.total)} of ${formatBidRupees(check.bid)}${check.message ? `<small>${escapeHtml(check.message)}</small>` : ""}`;
  const submit = scope.querySelector("[data-proof-submit]");
  submit.disabled = !check.ready;
  submit.textContent = items.length > 1 ? `Submit ${items.length} screenshots` : "Submit donation proof";
}

const proofNote = (item) => (item.reading ? "Reading amount…" : item.amount != null ? "Amount from screenshot" : "Couldn\'t read the amount. Remove it and upload a clearer screenshot.");
const proofAmountText = (item) => (item.amount != null ? formatBidRupees(item.amount) : item.reading ? '<i class="donate-thumbs__spin" aria-hidden="true"></i>' : "—");
function renderProofThumbs(scope, warning = "") {
  const items = scope.proofItems || [];
  const files = items.map((item) => item.file);
  const list = scope.querySelector("[data-proof-thumbs]");
  list.querySelectorAll("img").forEach((img) => URL.revokeObjectURL(img.src));
  list.innerHTML = files.map((file, i) => `<li><img src="${URL.createObjectURL(file)}" alt=""><span>${escapeHtml(file.name)}<em class="donate-thumbs__note">${proofNote(items[i])}</em></span><b class="donate-thumbs__amount${items[i].amount == null ? " is-empty" : ""}" data-proof-amount="${i}" aria-label="Amount paid">${proofAmountText(items[i])}</b><button type="button" class="donate-upload__clear" data-proof-remove="${i}" aria-label="Remove ${escapeHtml(file.name)}">×</button></li>`).join("");
  list.hidden = !files.length;
  scope.querySelector(".donate-upload").hidden = files.length >= MAX_PROOFS;
  scope.querySelector("[data-proof-label]").innerHTML = files.length ? PROOF_LABEL_MORE : PROOF_LABEL_EMPTY;
  const error = scope.querySelector("[data-proof-error]");
  error.textContent = warning;
  error.hidden = !warning;
  updateProofTally(scope);
}
loadBoardLots();
