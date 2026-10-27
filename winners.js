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
    renderWinners();
    renderWinnerWall();
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

function renderCauses() {
  const grid = document.querySelector("#causeGrid");
  if (!grid) return;
  grid.innerHTML = DONATION_CAUSES.map((cause, i) => {
    const body = `${cause.qr ? `<img class="cause-card__qr" src="${escapeHtml(cause.qr)}" alt="QR code to donate for ${escapeHtml(cause.name)}" width="300" height="300" loading="lazy">` : `<b>${i + 1}</b>`}<strong>${escapeHtml(cause.name)}</strong><span>${escapeHtml(cause.note)}</span>`;
    return cause.url
      ? `<a class="cause-card" href="${escapeHtml(cause.url)}" target="_blank" rel="noopener noreferrer">${body}<i aria-hidden="true">Donate ↗</i></a>`
      : `<div class="cause-card cause-card--soon">${body}</div>`;
  }).join("");
}

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

const EXTRA_EMAILS = { "ankur jhawar": "ankur.jhawar@microsoft.com" };

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
      <div class="winner-card__top">
        ${letter ? `<span class="winner-card__letter" aria-label="Item ${letter}">${letter}</span>` : ""}
        ${photo ? `<img class="winner-card__photo" src="${escapeHtml(photo)}" alt="" loading="lazy">` : `<span class="winner-card__photo winner-card__photo--empty" aria-hidden="true">♥</span>`}
        <div class="winner-card__item">
          <strong>${escapeHtml(title)}</strong>
          <span class="winner-card__by">${avatar(by, byEmail)}Added by ${escapeHtml(by)}${city ? ` · ${escapeHtml(city)}` : ""}</span>
          ${lot?.description ? `<p>${escapeHtml(lot.description)}</p>` : ""}
        </div>
      </div>
      ${winners.length ? `
      <p class="winner-card__label">Bid winners</p>
      <ul class="winner-card__bids" aria-label="Bid winners">
        ${winners.map(([name, amount]) => `<li class="${q && name.toLowerCase().includes(q) ? "is-match" : ""}"><span>${avatar(name)}${escapeHtml(name)}</span><b>${formatBidRupees(amount)}</b></li>`).join("")}
      </ul>
      <p class="winner-card__total">${winners.length > 1 ? `${winners.length} winners · ` : ""}${formatBidRupees(total)} raised</p>`
      : `<p class="winner-card__none">No winning bid this time</p>`}
    </article>`;
  }).join("");
  document.querySelector("#winnersEmpty").hidden = rows.length > 0;
}

function renderWinnerWall() {
  const wall = document.querySelector("#winnerWall");
  if (!wall) return;
  const names = [...new Map(WINNING_BIDS.flatMap((bid) => bid[3] || []).map(([name]) => [name.trim().toLowerCase(), name.trim()])).values()];
  wall.innerHTML = names.map((name) => `<li><button type="button" data-name="${escapeHtml(name)}" title="${escapeHtml(name)}" aria-label="Show ${escapeHtml(name)}’s wins">${avatar(name)}</button></li>`).join("");
  document.querySelector("#winnerWallCount").textContent = `${names.length} bid winners · tap a face to see their win`;
}

renderCauses();
renderWinners();
renderWinnerWall();
document.querySelector("#winnerSearch")?.addEventListener("input", (event) => renderWinners(event.target.value));
document.querySelector("#winnerWall")?.addEventListener("click", (event) => {
  const name = event.target.closest("button[data-name]")?.dataset.name;
  const search = document.querySelector("#winnerSearch");
  if (!name || !search) return;
  search.value = name;
  renderWinners(name);
  document.querySelector("#winnersList")?.closest(".results-block, section")?.scrollIntoView({ behavior: "smooth", block: "start" });
});
loadBoardLots();
