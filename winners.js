const LOT_KEY_PREFIX = "give-bazaar-lot-";
const LOT_LETTER_PATTERNS = [
  ["A", /beaded flower/], ["B", /post ?cards/], ["C", /chapter zero/], ["D", /what still matters/],
  ["E", /debangshu/], ["F", /lifafa/], ["G", /north indian dinner/], ["H", /weekend getaway/],
  ["I", /raceverse/], ["J", /bengaluru book|namma bengaluru/], ["K", /pickleball/], ["L", /drifting/],
  ["M", /hot wheels (mystery )?box/], ["N", /photo ?shoot/], ["O", /bird photowalk/], ["P", /bowling/],
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
  { name: "Education", note: "Scan or tap to donate on Benevity", url: "https://aka.ms/GiveEducation25", qr: "qr/education.png" },
  { name: "Children’s Health", note: "Scan or tap to donate on Benevity", url: "https://aka.ms/GiveHealth25", qr: "qr/health.png" },
  { name: "Special Needs", note: "Scan or tap to donate on Benevity", url: "https://aka.ms/GiveSpecial25", qr: "qr/special.png" },
  { name: "Environment", note: "Scan or tap to donate on Benevity", url: "https://aka.ms/GiveConservation25", qr: "qr/environment.png" },
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
  ["Set of 10 Postcards", "Saugata Pramanik", "Bangalore", [["Shveta Verma", 3000], ["Anudish", 2500]]],
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

function isViewer(name) {
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
  WINNING_BIDS.forEach((bid) => {
    const letter = lotLetter(bid[0]);
    const lot = lots.find((item) => letter && lotLetter(item.title) === letter) || findBoardLot(bid[0], bid[1]);
    if (lot && !bidByLot.has(lot)) bidByLot.set(lot, bid);
    else unmatched.push(bid);
  });
  const entries = [
    ...lots.map((lot) => ({ lot, bid: bidByLot.get(lot) || null })),
    ...unmatched.map((bid) => ({ lot: null, bid })),
  ];
  const letterOf = (e) => lotLetter(e.lot?.title || e.bid?.[0]) || "~";
  return entries.sort((a, b) => letterOf(a).localeCompare(letterOf(b)));
}

function renderWinners(query = document.querySelector("#winnerSearch")?.value || "") {
  const list = document.querySelector("#winnersList");
  if (!list) return;
  const q = query.trim().toLowerCase();
  const rows = buildEntries().filter(({ lot, bid }) => !q
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
        ${photo ? `<img class="winner-card__photo" src="${escapeHtml(photo)}" alt="" loading="lazy">` : `<span class="winner-card__photo winner-card__photo--empty" aria-hidden="true">♥</span>`}
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
          const done = donations.has(key);
          const mine = isViewer(name);
          const open = mine && openPanel === key;
          const action = mine
            ? `<button type="button" class="donate-btn${done ? " donate-btn--done" : ""}" data-donate="${escapeHtml(key)}" aria-expanded="${open}">${done ? "✓ Donated" : open ? "Close" : "Donate"}</button>`
            : `<span class="donate-status${done ? " donate-status--done" : ""}">${done ? "✓ Donated" : "Yet to donate"}</span>`;
          return `<li class="${q && name.toLowerCase().includes(q) ? "is-match" : ""}${open ? " is-open" : ""}${mine ? " is-mine" : ""}"><span>${avatar(name)}${escapeHtml(name)}${mine ? `<em class="you-tag">You</em>` : ""}</span><b>${formatBidRupees(amount)}</b>${action}</li>${open ? `<li class="donate-inline">${donationPanel({ key, letter, title, by, byEmail, name, amount })}</li>` : ""}`;
        }).join("")}
      </ul>
      <p class="winner-card__total">${winners.length > 1 ? `${winners.length} winners · ` : ""}${formatBidRupees(total)} raised</p>`
      : `<p class="winner-card__none">No winning bid this time</p>`}
    </article>`;
  }).join("");
  document.querySelector("#winnersEmpty").hidden = rows.length > 0;
}


function teamsChat(email, text) {
  return `https://teams.microsoft.com/l/chat/0/0?users=${encodeURIComponent(email)}&message=${encodeURIComponent(text)}`;
}

function donationPanel({ key, letter, title, by, byEmail, name, amount }) {
  const record = donations.get(key);
  const first = name.split(" ")[0];
  const byFirst = String(by).split(/[ ,]/)[0];
  if (record && !panelReplacing) {
    const proof = lotImageUrl(record.proof);
    const chat = byEmail ? teamsChat(byEmail, `Hi ${byFirst}, I won your GIVE Bazaar item${letter ? ` ${letter}` : ""} "${title}" and have completed my donation. When can we coordinate the gift?`) : "";
    return `<div class="donate-done">
      <span class="donate-done__tick" aria-hidden="true">✓</span>
      <h4>${escapeHtml(first)}’s donation is in. Thank you!</h4>
      <p>${escapeHtml(byFirst)} will reach out to arrange the gift. You two can coordinate directly.</p>
      <div class="donate-done__actions">
        ${chat ? `<a class="donate-chat" href="${escapeHtml(chat)}" target="_blank" rel="noopener noreferrer">${avatar(by, byEmail)}Chat with ${escapeHtml(byFirst)} in Teams ↗</a>` : ""}
        ${proof ? `<a class="donate-proof" href="${escapeHtml(proof)}" target="_blank" rel="noopener noreferrer"><img src="${escapeHtml(proof)}" alt="Payment screenshot">View screenshot</a>` : ""}
      </div>
      <button type="button" class="donate-link" data-replace="${escapeHtml(key)}">Upload a different screenshot</button>
    </div>`;
  }
  const causes = DONATION_CAUSES.map((c) => `<a class="donate-cause" href="${escapeHtml(c.url)}" target="_blank" rel="noopener noreferrer"><img src="${escapeHtml(c.qr)}" alt="QR code for ${escapeHtml(c.name)}" loading="lazy"><strong>${escapeHtml(c.name)}</strong><i>Donate ↗</i></a>`).join("");
  return `<div class="donate-step">
      <h4><b>1</b>Donate ${formatBidRupees(amount)} on Benevity</h4>
      <p>Pick any one cause. Microsoft matches your donation.</p>
      <div class="donate-causes">${causes}</div>
    </div>
    <div class="donate-step">
      <h4><b>2</b>Upload your payment screenshot</h4>
      <label class="donate-upload">
        <input type="file" accept="image/*" data-proof-input>
        <span data-proof-label><strong>Choose screenshot</strong><small>The Benevity receipt showing ${formatBidRupees(amount)}</small></span>
        <img data-proof-preview alt="" hidden>
      </label>
      <button type="button" class="donate-submit" data-proof-submit="${escapeHtml(key)}" disabled>Submit donation proof</button>
      <p class="donate-error" data-proof-error role="alert" hidden></p>
    </div>
    <div class="donate-step donate-step--next">
      <h4><b>3</b>Get your gift</h4>
      <p>Once submitted, ${escapeHtml(byFirst)} will reach out to arrange it with you.</p>
    </div>`;
}

function findBid(key) {
  for (const { lot, bid } of buildEntries()) {
    const letter = lotLetter(lot?.title || bid?.[0]);
    const hit = (bid?.[3] || []).find(([name]) => donationKey(letter, name) === key);
    if (hit) return { letter, title: lot?.title || bid[0], by: lot?.contributor || bid[1], name: hit[0], amount: hit[1] };
  }
  return null;
}

async function submitProof(key, scope) {
  const info = findBid(key);
  const file = scope.querySelector("[data-proof-input]")?.files?.[0];
  const button = scope.querySelector("[data-proof-submit]");
  const error = scope.querySelector("[data-proof-error]");
  if (!info || !file) return;
  const fail = (msg) => { error.textContent = msg; error.hidden = false; button.disabled = false; button.textContent = "Submit donation proof"; };
  if (!vibeStorage?.images || !vibeStorage?.shared || vibeStorage.isPublicShare) return fail("Please open the site signed in to VibeHub to upload.");
  if (file.size > 10 * 1024 * 1024) return fail("That image is over 10 MB. Try a smaller screenshot.");
  button.disabled = true;
  button.textContent = "Uploading…";
  error.hidden = true;
  try {
    const imageKey = `donation-${key}-${Date.now()}`;
    const meta = await vibeStorage.images.set(imageKey, file, { public: true });
    const record = { ...info, proof: { key: imageKey, viewer: vibeStorage.viewerEmail || "", url: meta?.url || "" }, submittedBy: vibeStorage.viewerEmail || "", at: new Date().toISOString() };
    const old = donations.get(key);
    await vibeStorage.shared.set(DONATION_KEY_PREFIX + key, record);
    if (old?.proof?.key) vibeStorage.images.delete(old.proof.key).catch(() => {});
    donations.set(key, record);
    panelReplacing = false;
    renderWinners();
    renderHero();
  } catch (err) {
    console.error("Could not upload donation proof.", err);
    fail("Upload didn't go through. Check your connection and try again.");
  }
}

function winnerPeople() {
  const map = new Map();
  buildEntries().forEach(({ lot, bid }) => {
    const letter = lotLetter(lot?.title || bid?.[0]);
    (bid?.[3] || []).forEach(([name]) => {
      const slug = winnerSlug(name);
      if (!map.has(slug)) map.set(slug, { name: name.trim(), keys: [] });
      map.get(slug).keys.push(donationKey(letter, name));
    });
  });
  return [...map.values()];
}

function renderHero() {
  const people = winnerPeople();
  const ring = document.querySelector("#winnerRing");
  if (ring) {
    ring.innerHTML = people.map(({ name, keys }, i) => {
      const angle = (-90 + (i + 0.5) * (360 / people.length)) * Math.PI / 180;
      const x = (50 + 47 * Math.cos(angle)).toFixed(1);
      const y = (50 + 47 * Math.sin(angle)).toFixed(1);
      const r = (i % 2 ? 1 : -1) * (3 + (i % 3) * 2);
      const done = keys.every((k) => donations.has(k));
      return `<li class="${done ? "is-done" : ""}" style="--x:${x}%;--y:${y}%;--r:${r}deg;--d:${(i % 5) * 0.4}s" title="${escapeHtml(name)}${done ? " · donated" : ""}">${avatar(name)}${done ? `<i class="done-tick" aria-hidden="true">✓</i>` : ""}<span>${escapeHtml(name.split(" ")[0])}</span></li>`;
    }).join("");
  }
  const counter = document.querySelector("#donatedCount");
  if (counter) {
    const doneCount = people.filter((p) => p.keys.every((k) => donations.has(k))).length;
    counter.innerHTML = `<b>${doneCount} of ${people.length}</b> bid winners have donated`;
  }
  const row = document.querySelector("#contributorRow");
  if (!row) return;
  const seen = new Set();
  const contributors = [];
  buildEntries().forEach(({ lot, bid }) => {
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
function openPreview(title) {
  const entry = buildEntries().find(({ lot, bid }) => (lot?.title || bid?.[0]) === title);
  if (!entry) return;
  const { lot, bid } = entry;
  const by = lot?.contributor || bid?.[1] || "";
  const city = bid?.[2] || (lot?.city === "Remote" ? "Anywhere" : lot?.city || "");
  const letter = lotLetter(title) || lotLetter(bid?.[0]);
  const byEmail = (lot?.avatarEmail || lot?.email || "").toLowerCase() || emailFor(by);
  const photos = lot ? lotImages(lot).map(lotImageUrl).filter(Boolean) : [];
  let dialog = document.querySelector("#itemPreview");
  if (!dialog) {
    dialog = document.createElement("dialog");
    dialog.id = "itemPreview";
    dialog.className = "item-preview";
    document.body.append(dialog);
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog || event.target.closest("[data-preview-close]")) dialog.close();
      const thumb = event.target.closest("[data-preview-thumb]");
      if (thumb) {
        dialog.querySelector(".item-preview__main").src = thumb.dataset.previewThumb;
        dialog.querySelectorAll("[data-preview-thumb]").forEach((t) => t.classList.toggle("is-active", t === thumb));
      }
    });
  }
  dialog.innerHTML = `
    <button type="button" class="item-preview__close" data-preview-close aria-label="Close">×</button>
    ${photos.length ? `<img class="item-preview__main" src="${escapeHtml(photos[0])}" alt="${escapeHtml(title)}">` : `<div class="item-preview__main item-preview__main--empty" aria-hidden="true">♥</div>`}
    ${photos.length > 1 ? `<div class="item-preview__thumbs">${photos.map((src, i) => `<button type="button" class="${i ? "" : "is-active"}" data-preview-thumb="${escapeHtml(src)}" aria-label="Photo ${i + 1}"><img src="${escapeHtml(src)}" alt=""></button>`).join("")}</div>` : ""}
    <div class="item-preview__body">
      <h3>${letter ? `<span class="winner-card__letter">${letter}</span>` : ""}${escapeHtml(title)}</h3>
      <span class="winner-card__by">${avatar(by, byEmail)}${escapeHtml(by)}${city ? ` · ${escapeHtml(city)}` : ""}</span>
      ${lot?.description ? `<p>${escapeHtml(lot.description)}</p>` : ""}
    </div>`;
  dialog.showModal();
}

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
  const submit = event.target.closest("[data-proof-submit]");
  if (submit) return submitProof(submit.dataset.proofSubmit, submit.closest(".donate-inline"));
  const filter = event.target.closest("button[data-filter]")?.dataset.filter;
  if (filter) {
    const search = document.querySelector("#winnerSearch");
    search.value = filter;
    renderWinners(filter);
    document.querySelector("#winnersList")?.closest(".results-block")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});
document.addEventListener("change", (event) => {
  if (!event.target.matches("[data-proof-input]")) return;
  const scope = event.target.closest(".donate-inline");
  const file = event.target.files?.[0];
  if (!file || !scope) return;
  const preview = scope.querySelector("[data-proof-preview]");
  preview.src = URL.createObjectURL(file);
  preview.hidden = false;
  scope.querySelector("[data-proof-label]").innerHTML = `<strong>${escapeHtml(file.name)}</strong><small>Tap to change</small>`;
  scope.querySelector("[data-proof-submit]").disabled = false;
});
loadBoardLots();
