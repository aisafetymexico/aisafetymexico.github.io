# Inspiration Research — Layout & Pattern Audit

Audit of 5 reference sites at 3 viewports (375 / 768 / 1440). Screenshots live in
`docs/inspiration/{site}-{viewport}.png` and were captured headless via
`tools/screenshot-inspiration.mjs` (Playwright + Chromium).

Sites audited:

- **RAND** — `rand-1440.png`, `rand-768.png`, `rand-375.png`
  Editorial think-tank density; magazine-grid for research output.
- **Coefficient Giving** (formerly Open Philanthropy) — `coefficient-giving-*.png`
  Minimalist serif editorial; institutional restraint.
- **Anthropic** — `anthropic-*.png`
  Modern editorial + parchment palette; underlined-keyword affordance.
- **Future of Life Institute** — `futureoflife-*.png`
  Photo-card grid above the fold; mission-led brand.
- **GOV.UK** — `gov-uk-*.png`
  Function-first clarity, strong color band, zero ornament.

All capture commands ran successfully (15/15 viewports). No site failed.

> **Disclaimer.** Only structure, layout, hierarchy and rhythm are extracted.
> No copy, asset, photograph, mark, color exact value, or font face from these
> sites is reused; references below describe **patterns** only.

---

## Patterns we ADOPT (8)

### A1 — Editorial hero with serif/heavy headline + supporting paragraph
**Refs:** `coefficient-giving-1440.png:hero`, `anthropic-1440.png:hero`,
`anthropic-375.png:hero`.
A confidence-projecting institutional hero is *one* big headline (≥ 56px desktop,
~36px mobile) with a single short support paragraph and a single CTA.
Coefficient Giving uses a calm pale-mint background with a centered serif
headline; Anthropic uses left-aligned parchment with sans-serif and underlined
key nouns. Both convey authority without imagery. We adopt the pattern, not the
fonts: serif display for AISMX (matches the academic register), supported by
1.1–1.25 line-height clean sans-serif paragraph.

### A2 — Two-column hero (desktop) → single-column stack (mobile)
**Refs:** `anthropic-1440.png:hero`, `anthropic-768.png:hero`, `anthropic-375.png:hero`.
On ≥1024px the headline takes ~60% column width left, the support paragraph
sits in a narrower right column at smaller size — this avoids the "wall of
oversized text" problem on wide screens. At 768px and below it collapses to a
single column with the support paragraph below the headline.

### A3 — Featured story + side-stack cards layout (homepage gateway)
**Refs:** `rand-1440.png:hero-grid`, `rand-768.png:hero-grid`.
RAND's homepage uses one large feature card (oversized image + serif title
inside) flanked by 2–3 smaller cards stacked vertically. Excellent fit for our
homepage gateway: highlight one current activity/research item alongside
secondary entries (latest publication, current course, current project).
Collapses to a single vertical stream on 375.

### A4 — Eyebrow + title + image card (consistent atomic card)
**Refs:** `rand-1440.png:card`, `rand-768.png:card`, `futureoflife-1440.png:card`.
Every card is the same recipe: small uppercase tag (e.g. "RESEARCH",
"PROGRAM"), 16:9 or 3:2 image, serif/heavy title, optional date, no body copy.
Removing body copy from cards makes grids breathe and forces strong titles.
Ship one canonical Card component; vary only the eyebrow taxonomy.

### A5 — Photo-card grid: 4-up / 2-up / 1-up
**Refs:** `futureoflife-1440.png:grid`, `futureoflife-768.png:grid`,
`futureoflife-375.png:grid`.
For "browse all" pages (Activities, Projects, Programs) FLI's tall photo cards
in a 4-column grid (1440), 2-column (768), 1-column (375) work well. Use a
fixed image aspect ratio (4:5 portrait) to avoid jagged baselines.

### A6 — Generous whitespace and a restrained two-tone surface palette
**Refs:** `coefficient-giving-1440.png:hero-bg`, `anthropic-1440.png:hero-bg`,
`anthropic-1440.png:project-glasswing-block`.
Both reference sites use exactly two backgrounds in the visible viewport: a
warm light surface (mint or parchment) for the hero, then a contrasting darker
block (Anthropic's near-black) for a single featured item. We mimic the
*structure*: AISMX neutral cream/off-white surface + a single deep navy/charcoal
block per page for the most important call-out.

### A7 — Light utility nav + horizontal section nav (no mega menu)
**Refs:** `rand-1440.png:nav`, `coefficient-giving-1440.png:nav`,
`gov-uk-1440.png:nav`.
A single row with logo left and 4–6 section links right is enough. RAND adds a
search icon; GOV.UK adds a single "Menu" disclosure. Avoid mega menus for our
8-page IA. Mobile collapses to hamburger, desktop stays inline.

### A8 — Solid-color brand band hero for campaign/event pages
**Refs:** `gov-uk-1440.png:hero`, `gov-uk-768.png:hero`, `gov-uk-375.png:hero`.
GOV.UK's full-bleed blue band with white headline + a single function (search)
is a powerful pattern for *event* pages (Hackathon, AI Safety Connect) — high
contrast, instant brand recognition, no decorative imagery competing with the
CTA. Reserve for landing pages where we want one decisive action
(register / apply / read).

---

## Patterns we AVOID (5)

### X1 — Above-the-fold density à la RAND
**Refs:** `rand-1440.png:hero-grid`, `rand-768.png`.
RAND ships ~6 cards above the fold at 1440 with very tight spacing. This works
when you publish daily; for AISMX it would feel cluttered and dated. Adopt
A3's structure but with **3 items max** above the fold (1 feature + 2 side).

### X2 — Decorative animated/illustrated graphic in hero
**Ref:** `coefficient-giving-1440.png:hero-dots`.
The dotted-cluster graphic on the right of Coefficient's hero looks
"design-system marketing" rather than academic. It also has a load/perf cost we
don't need. Skip decorative SVG/canvas in hero; let the typography be the
visual.

### X3 — Sticky accessibility / chat / cookie bubble overlays
**Refs:** `futureoflife-375.png:a11y-bubble`,
`coefficient-giving-768.png:cookie-banner`, `gov-uk-1440.png:cookie-banner`.
These overlays cover real estate, often fail keyboard navigation, and signal a
bolt-on a11y strategy. We build a11y in natively (semantic HTML, focus rings,
contrast tokens) and avoid third-party a11y widgets entirely. We also avoid a
cookie banner — GH Pages static site, no tracking → no banner needed.

### X4 — Mega-menu / topic dropdowns in primary nav
**Refs:** `rand-1440.png:nav-topics`, `futureoflife-1440.png:nav-focus-areas`.
Mega menus assume hundreds of pages and a content team to curate them. Our IA
has 8 top-level pages; a flat horizontal nav (A7) is clearer and accessible by
default.

### X5 — Eyebrow date stamps on every card / homepage as feed
**Refs:** `rand-1440.png:card-dates`, `rand-768.png:card-dates`.
RAND timestamps every card ("Mar 5, 2026"). For a small org publishing
infrequently, visible dates make the site look stale within weeks. Use dates
only on Research publications and Activities (where chronology matters);
omit from Programs, Projects, Team.

---

## Application notes for AISMX

| AISMX Page | Primary patterns |
|---|---|
| Home | A1 + A3 + A6 (one feature + 2 side cards over cream surface) |
| About | A1 + A2 (editorial hero, then long-form prose with generous measure) |
| Research | A4 + A5 (publication cards 4-up grid, eyebrow = tag, with dates) |
| Programs | A4 + A5 (course cards, no dates) |
| Projects (index) | A3 (VIGÍA as feature card, AI Safety Connect as side card) |
| Team | A4 in a different shape (square portrait + name + role) |
| Activities | A5 + dates allowed (chronological gallery) |
| Get Involved | A8 (solid brand band, single CTA: contact form) |
| Event pages (Hackathon etc.) | A8 (full-bleed brand band, registration CTA) |

The Card component (A4) is the highest-leverage primitive — every page above
uses it. Build it first, vary by eyebrow/aspect-ratio prop only.
