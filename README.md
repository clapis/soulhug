# soulhug.nl – migration to a simple static site

Goal: replace the exported website (a Next.js/Bootstrap export from Soloist, in `download/`) with a small, hand-written, dependency-free static site. Content, structure and images stay the same; code and styling are simplified.

## Layout

| Path | What it is |
|------|-----------|
| `download/` | Original exported site (reference only, don't edit). Pages: `index.html`, `workshops.html`, `yoga-classes.html`, `inspiration.html`, `terms-and-privacy-policy.html`, plus `assets/` (Bootstrap, site.css). |
| `download/images.csv` | Every image URL per page/section (Unsplash + `cdn.soloist.ai`). Use it to find images for the other pages. |
| `download/contacts.csv` | Contact form submissions from the old site. Contains personal data: do not publish or copy into the site. |
| `agenda.html` | Original snippet that powered the Agenda embed (reference only). |
| `events.json` | Event data loaded by the home page agenda. Edit this file to add or update events. |
| `index.html` | **Done.** New simplified home page (see below). |
| `workshops.html` | **Done.** Workshop descriptions, original images, booking links to the home agenda, and native FAQ accordions. |
| `yoga-classes.html` | **Done.** Original circular introduction image, gray schedule section with studio links, and centered facilitator portrait and biography. |
| `inspiration.html` | **Done.** All 20 original images in alternating two-/three-image desktop rows and two mobile columns, with a native dialog image viewer. |

The workshops page follows the original layout: a centered circular introduction image, alternating flower-masked images and text, bulleted descriptions, and gray/white section backgrounds. It keeps the simplified system/Georgia fonts and shared home-page header/footer.

The home page also follows the original layout: a light, left-aligned hero, right-aligned introductory list, circular service images, centered facilitator portrait and biography, and alternating gray, white, and teal sections. Its agenda, review carousel, native FAQs, and mailto forms remain dependency-free.

## Status

- [x] `index.html` (home)
- [x] `workshops.html` (preserves `#quotebanner-1` and `#quotebanner-2` anchors, linked from the home page service cards)
- [x] `yoga-classes.html`
- [x] `inspiration.html` (gallery of 20 images, see `images.csv`)
- [ ] `terms-and-privacy-policy.html` (linked from the FAQ and footer)

## Decisions made for `index.html` (reuse for the other pages)

- **Single file per page**, inline `<style>` and `<script>`, no frameworks, no build step. The original Bootstrap, Sentry and cookie-wall are dropped.
- **Content kept verbatim**: all text, the order of sections, and all images (hot-linked from Unsplash / `cdn.soloist.ai` with smaller sizes via `?w=` and `loading="lazy"`).
- **Fonts**: Georgia serif for headings, system sans-serif (`system-ui` stack) for body text. No web fonts. Content sizing follows the original layouts: mostly 16px body text, 32px section headings, and smaller headings on mobile.
- **Palette** (CSS variables): ink `#2b2a33`, muted `#6a6872`, accent `#b5654a`, soft background `#faf5f0`, line `#e9dfd6`.
- **Content layouts** retain the original white/gray (`#e5e5e5`) backgrounds and teal (`#006059` / `#0f766e`) sections and buttons. Shared header/footer styling stays consistent across migrated pages.
- **Header/footer/nav** are duplicated per page. Nav: Workshops, Yoga Classes, Agenda, Inspiration, About, Get in touch. Mobile hamburger menu in a few lines of JS.
- **Links**: migrated pages use `.html` links (`workshops.html`, `yoga-classes.html`, `inspiration.html`) so they work locally without URL rewrites. The unmigrated `terms-and-privacy-policy` page still uses its clean path as on the live site. In-page anchors: `#agenda`, `#services`, `#team`, `#mission`, `#contact`, `#faq`. Note `workshops.html#quotebanner-1` / `#quotebanner-2` must exist on the workshops page.
- **Agenda**: fetched from `events.json`, an array of objects with `title`, `date`, `image`, and `link` strings. Events dated before yesterday go under "See past events"; `"date": "weekly"` stays in upcoming. The dates all lie in the past, so the list needs updating (events link to hipsy.nl / momoyoga). Loading failures show a message and a link to Hipsy.
- **FAQ**: native `<details>/<summary>`. **Reviews**: tiny JS carousel (auto-advances every 9s).
- **Forms**: there is no backend. Contact and newsletter forms open a `mailto:hello@soulhug.nl` link. Replace with a form service if wanted.
- **Original-only artefacts dropped**: Soloist "This content is not part of the export" notes, the "Powered by Soloist" footer link, and the cookie message.

## Local preview

Run `python3 -m http.server 8000` from the repository root and open `http://localhost:8000`. The agenda fetches `events.json`, so opening `index.html` directly via `file://` is not supported.

## Open points / ideas

- Decide on the hosting/URL rewrite for clean paths vs `.html` links.
- Optional: a nicer heading font (e.g. Fraunces/Lora) if Georgia feels too plain.
- Consider extracting shared CSS into one `style.css` once there are several pages (currently all inline in `index.html`).
- Keep `download/` as the content source of truth; extract text with a script, since the files are large single-line minified HTML (strip `<svg>`, `<style>`, `<script>`, `data-*`/`class` attributes to read them).
