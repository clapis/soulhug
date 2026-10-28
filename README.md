# soulhug.nl – migration to a simple static site

Goal: replace the exported website (a Next.js/Bootstrap export from Soloist, in `download/`) with a small, hand-written, dependency-free static site. Content, structure and images stay the same; code and styling are simplified.

## Layout

| Path | What it is |
|------|-----------|
| `download/` | Original exported site (reference only, don't edit). Pages: `index.html`, `workshops.html`, `yoga-classes.html`, `inspiration.html`, `terms-and-privacy-policy.html`, plus `assets/` (Bootstrap, site.css). |
| `download/images.csv` | Every image URL per page/section (Unsplash + `cdn.soloist.ai`). Use it to find images for the other pages. |
| `download/contacts.csv` | Contact form submissions from the old site. Contains personal data: do not publish or copy into the site. |
| `agenda.html` | Original snippet that powered the Agenda embed (JS event list rendered into cards, with a "See past events" toggle). Its event data is now inlined in `index.html`. |
| `index.html` | **Done.** New simplified home page (see below). |

## Status

- [x] `index.html` (home)
- [ ] `workshops.html` (original has `#quotebanner-1` and `#quotebanner-2` anchors, linked from the home page service cards)
- [ ] `yoga-classes.html`
- [ ] `inspiration.html` (gallery of 20 images, see `images.csv`)
- [ ] `terms-and-privacy-policy.html` (linked from the FAQ and footer)

## Decisions made for `index.html` (reuse for the other pages)

- **Single file per page**, inline `<style>` and `<script>`, no frameworks, no build step. The original Bootstrap, Sentry and cookie-wall are dropped.
- **Content kept verbatim**: all text, the order of sections, and all images (hot-linked from Unsplash / `cdn.soloist.ai` with smaller sizes via `?w=` and `loading="lazy"`).
- **Fonts**: Georgia serif for `h1`–`h3`, system sans-serif (`system-ui` stack) for everything else. No web fonts. Small set of sizes (.9 / 1 / 1.15 / 1.25 / 1.4rem). Serif headings were deliberately kept.
- **Palette** (CSS variables): ink `#2b2a33`, muted `#6a6872`, accent `#b5654a`, soft background `#faf5f0`, line `#e9dfd6`.
- **Header/footer/nav** are duplicated per page. Nav: Workshops, Yoga Classes, Agenda, Inspiration, About, Get in touch. Mobile hamburger menu in a few lines of JS.
- **Links**: other pages use clean paths (`workshops`, `yoga-classes`, `inspiration`, `terms-and-privacy-policy`) as on the live site. Locally these need `.html` unless the server rewrites. In-page anchors: `#agenda`, `#services`, `#team`, `#mission`, `#contact`, `#faq`. Note `workshops#quotebanner-1` / `#quotebanner-2` must exist on the workshops page.
- **Agenda**: JS array `events` in `index.html`, with values written inline (no helper variables). Events dated before yesterday go under "See past events"; `date: "weekly"` stays in upcoming. The dates all lie in the past, so the list needs updating (events link to hipsy.nl / momoyoga).
- **FAQ**: native `<details>/<summary>`. **Reviews**: tiny JS carousel (auto-advances every 9s).
- **Forms**: there is no backend. Contact and newsletter forms open a `mailto:hello@soulhug.nl` link. Replace with a form service if wanted.
- **Original-only artefacts dropped**: Soloist "This content is not part of the export" notes, the "Powered by Soloist" footer link, and the cookie message.

## Open points / ideas

- Check `index.html` in a browser (it was written but not visually tested), including the mobile layout.
- Decide on the hosting/URL rewrite for clean paths vs `.html` links.
- Optional: a nicer heading font (e.g. Fraunces/Lora) if Georgia feels too plain.
- Consider extracting shared CSS into one `style.css` once there are several pages (currently all inline in `index.html`).
- Keep `download/` as the content source of truth; extract text with a script, since the files are large single-line minified HTML (strip `<svg>`, `<style>`, `<script>`, `data-*`/`class` attributes to read them).
