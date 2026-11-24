// Agenda
const upcoming = document.getElementById("upcoming");
const archive = document.getElementById("archive");
const toggleArchive = document.getElementById("toggle-archive");

const today = new Date();
today.setHours(0, 0, 0, 0);

const dateFormatter = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

const eventDate = event => new Date(`${event.date}T00:00:00`);
const byDate = (a, b) => eventDate(a) - eventDate(b);
const isNonEmptyString = value => typeof value === "string" && value.trim().length > 0;
const capitalize = value => value.charAt(0).toUpperCase() + value.slice(1);
const escapeHtml = value => String(value).replace(/[&<>"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
const formatEventDate = event => isDatedEvent(event) ? dateFormatter.format(eventDate(event)) : capitalize(event.date.trim());
const isDatedEvent = event => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(event?.date)) return false;
  const date = new Date(event.date);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === event.date;
};

const createEventCard = event => {
  const data = event ?? {};
  const card = document.createElement("article");
  card.className = "agenda-item";
  card.innerHTML = `
    ${isNonEmptyString(data.image) ? `<img src="${escapeHtml(data.image)}" alt="" loading="lazy" width="112" height="100">` : ""}
    <div>
      <span class="agenda-date">${escapeHtml(formatEventDate({ date: isNonEmptyString(data.date) ? data.date : "Date to be announced" }))}</span>
      <h3>${escapeHtml(data.title ?? "Event details coming soon")}</h3>
      ${isNonEmptyString(data.link) ? `<a href="${escapeHtml(data.link)}">${escapeHtml(data.linkText ?? "View details")}</a>` : ""}
    </div>`;
  return card;
};

const loadEvents = () => fetch("../agenda.json")
  .then(response => {
    if (!response.ok) throw new Error(`Unable to load events: HTTP ${response.status}`);
    return response.json();
  })
  .then(events => {
    if (!Array.isArray(events)) throw new Error("Expected an array of events in agenda.json");

    const dated = events.filter(isDatedEvent);
    const undated = events.filter(event => !isDatedEvent(event));
    const future = dated.filter(event => eventDate(event) >= today).sort(byDate);
    const past = dated.filter(event => eventDate(event) < today).sort((a, b) => byDate(b, a));
    upcoming.replaceChildren(...future.map(createEventCard), ...undated.map(createEventCard));
    if (!upcoming.children.length) {
      upcoming.innerHTML = "<p>No upcoming events are listed right now.</p>";
    }
    archive.replaceChildren(...past.map(createEventCard));
    toggleArchive.hidden = !past.length;
  })
  .catch(error => {
    console.error("Could not load agenda events.", error);
    upcoming.innerHTML = '<p>Events could not be loaded. Please try again later or <a href="mailto:hello@soulhug.nl">contact us</a>.</p>';
  });

toggleArchive.addEventListener("click", () => {
  archive.hidden = !archive.hidden;
  toggleArchive.setAttribute("aria-expanded", String(!archive.hidden));
  toggleArchive.textContent = archive.hidden ? "Show past events" : "Hide past events";
});

loadEvents();

// Reviews
const reviewSlider = document.getElementById("review-slider");
const previousReviews = document.getElementById("previous-reviews");
const nextReviews = document.getElementById("next-reviews");

const updateReviewControls = () => {
  previousReviews.disabled = reviewSlider.scrollLeft < 1;
  nextReviews.disabled = reviewSlider.scrollLeft >= reviewSlider.scrollWidth - reviewSlider.clientWidth - 1;
};

reviewSlider.classList.add("is-slider");
document.getElementById("review-controls").hidden = false;
previousReviews.addEventListener("click", () => reviewSlider.scrollBy({ left: -reviewSlider.clientWidth }));
nextReviews.addEventListener("click", () => reviewSlider.scrollBy({ left: reviewSlider.clientWidth }));
reviewSlider.addEventListener("scroll", updateReviewControls);
window.addEventListener("resize", updateReviewControls);
updateReviewControls();
