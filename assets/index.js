// Reviews carousel
const reviews = [...document.querySelectorAll(".review")];
const counter = document.getElementById("counter");
let current = 0;
const showReview = i => {
  current = (i + reviews.length) % reviews.length;
  reviews.forEach((r, n) => r.classList.toggle("active", n === current));
  counter.textContent = `${current + 1} / ${reviews.length}`;
};
document.getElementById("prev").addEventListener("click", () => showReview(current - 1));
document.getElementById("next").addEventListener("click", () => showReview(current + 1));
setInterval(() => showReview(current + 1), 9000);

// Agenda
const escapeHtml = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const validDate = e => !isNaN(new Date(e.date).getTime());
const fmt = e => validDate(e) ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(e.date)) : e.date;
const yesterday = new Date(Date.now() - 86400000);
const isPast = e => validDate(e) && new Date(e.date) < yesterday;

const card = e => {
  const el = document.createElement("article");
  el.className = "agenda-item";
  el.innerHTML = `
    <img src="${e.image}" alt="${escapeHtml(e.title)}" loading="lazy">
    <div>
      <time class="agenda-date">${fmt(e)}</time>
      <h3>${escapeHtml(e.title)}</h3>
      <a href="${e.link}" target="_blank" rel="noopener">Read more →</a>
    </div>`;
  return el;
};

const upcoming = document.getElementById("upcoming");
const archive = document.getElementById("archive");
const toggle = document.getElementById("toggle-archive");
const byDate = (a, b) => new Date(a.date) - new Date(b.date);

async function loadEvents() {
  try {
    const response = await fetch("agenda.json");
    if (!response.ok) throw new Error(`Unable to load events: HTTP ${response.status}`);
    const events = await response.json();
    if (!Array.isArray(events) || !events.every(e => e && ["title", "date", "image", "link"].every(key => typeof e[key] === "string" && e[key].trim()))) {
      throw new Error("Invalid event data in agenda.json");
    }
    upcoming.replaceChildren(...events.filter(e => !isPast(e)).sort(byDate).map(card));
    archive.replaceChildren(...events.filter(isPast).sort((a, b) => byDate(b, a)).map(card));
    if (!upcoming.children.length) upcoming.innerHTML = '<p class="empty">No upcoming sessions scheduled right now.</p>';
    toggle.hidden = false;
  } catch (error) {
    console.error("Could not load agenda events.", error);
    upcoming.innerHTML = '<p class="empty">Unable to load events. Please try again later or <a href="https://hipsy.nl/soulhug">view our events on Hipsy</a>.</p>';
  }
}
loadEvents();

toggle.addEventListener("click", ev => {
  ev.preventDefault();
  archive.hidden = !archive.hidden;
  toggle.textContent = archive.hidden ? "See past events" : "Hide past events";
});

// Forms (no backend: hand off to the visitor's mail client)
document.getElementById("contact-form").addEventListener("submit", ev => {
  ev.preventDefault();
  const v = id => document.getElementById(id).value.trim();
  const body = `${v("message")}\n\n${v("name")}\n${v("email")}${v("phone") ? "\n" + v("phone") : ""}`;
  location.href = `mailto:hello@soulhug.nl?subject=${encodeURIComponent("Message from " + v("name"))}&body=${encodeURIComponent(body)}`;
});
document.getElementById("newsletter-form").addEventListener("submit", ev => {
  ev.preventDefault();
  const email = document.getElementById("newsletter-email").value.trim();
  location.href = `mailto:hello@soulhug.nl?subject=${encodeURIComponent("Newsletter signup")}&body=${encodeURIComponent("Please add me to the newsletter: " + email)}`;
});
