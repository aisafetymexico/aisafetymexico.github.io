# Visual QA Report — AI Safety Mexico (Astro rebuild)

> Captured by `playwright/visual-qa.spec.mjs` against `astro preview` on `127.0.0.1:4323`.
> 11 routes × 3 viewports (375 / 768 / 1440) = 33 full-page screenshots in `playwright/screenshots/<slug>/<viewport>.png`.
> Each screenshot reviewed with vision; this file lists issues by severity with concrete fixes.

## Methodology
- Build: `npm run build` (clean, completed prior to capture).
- Server: `astro preview --port 4323`.
- Browser: Chromium headless (Playwright 1.59), `deviceScaleFactor: 1`, `waitUntil: 'networkidle'` + 400ms settle.
- Routes audited: `/`, `/about`, `/research`, `/programs`, `/projects`, `/projects/vigia`, `/projects/ai-safety-connect`, `/team`, `/activities`, `/get-involved`, `/contact`.
- Note: One transient cold-start 404 on `/team @ 1440` was reproduced as `200 OK` on retry (not a real bug; the screenshot was overwritten).

## Severity legend
- **HIGH** — looks broken to a first-time visitor; blocks credibility.
- **MED** — noticeable inconsistency or imbalance; degrades polish.
- **LOW** — refinement / nice-to-have; safe to defer.

---

## Top 5 issues to fix first

1. **HIGH · Empty image placeholders on multiple cards** — `/programs` "Galería de certificados" (≈5 empty cream tiles), `/activities` "Conferencias, talleres y formación" (3 empty image bands above each card), `/activities` "Mesas de trabajo recurrentes" (empty hero image), `/research` "Investigación en desarrollo" (peach blocks at card top). Either wire the real images or remove the image slot — empty rectangles read as broken assets.
2. **HIGH · Header overflow at 768 (tablet)** — the `AI Safety Mexico` wordmark sits behind / under the "Colabora" CTA pill on the right edge; the orange button visibly clips into the logo area on `/`, `/research`, `/projects`, `/team`, `/activities`. Either shrink wordmark, drop the standalone CTA in tablet (let it ride in the menu like 375), or widen the breakpoint that triggers the hamburger.
3. **HIGH · Home hero image undersized at 375** — the Chichén Itzá astronomer photo is rendered as a small rounded rectangle floating above the H1; it reads as decorative rather than a hero. Either let it span full container width edge-to-edge or replace with mobile-first crop.
4. **MED · Stats bar wraps unevenly at 768** — 4 stats (`6+`, `30+`, `3`, `10+`) collapse into 2+2 but with mixed gap, the first row is denser than the second on `/`. Force a consistent 2-col grid (`grid-template-columns: 1fr 1fr`) at this breakpoint or keep all 4 in a single row with smaller numbers.
5. **MED · `/projects/ai-safety-connect` desktop empty band** — between "Reporte final" download CTA and "Co-investigadores" there is a large empty cream band (~250–300px) at 1440 that makes the page feel padded with nothing. Tighten section padding or surface a content block (e.g. abstract pull-quote, paper preview thumb) in the gap.

---

## Issues by page

### `/` — Home

| # | Severity | Viewport | Issue | Recommendation |
|---|---|---|---|---|
| H1 | HIGH | 375 | Hero pyramid image is small and visually detached from the H1 below; reads as a decorative thumbnail. | Increase hero image width to 100% of content container at 375 or replace with a tighter mobile crop. |
| H2 | HIGH | 768 | Header right side: "Colabora" pill overlaps wordmark area; tight collision visible. | Trigger hamburger ≤ 900px, OR drop the standalone CTA and rely on the in-menu version. |
| H3 | MED | 768 | Stats bar wraps to 2 rows of 2 but with uneven spacing — second row appears further apart. | Lock to a `grid 2×2` with consistent row-gap, or shrink numbers and keep 1×4. |
| H4 | MED | All | Pillar cards (`Investigación`, `Programas`, `Proyectos`, `Equipo`) use very small icon glyphs that get lost; visual weight skews to body copy. | Increase icon size by ~25 % or wrap in a tinted square so the icon registers as the card's anchor. |
| H5 | LOW | 1440 | Active nav link ("Sobre nosotros" highlighted) is barely distinct from inactive links on the dark header. | Add an underline or a stronger orange tint for `aria-current="page"`. |

### `/about`

| # | Severity | Viewport | Issue | Recommendation |
|---|---|---|---|---|
| A1 | MED | 1440 | "Por qué existimos" / "Hacia dónde apuntamos" alternate cream/white sections feel similar in weight; visual rhythm is monotone for a long page. | Vary section padding or introduce a darker accent band (navy callout) between them; the navy callout under "Datos esenciales" works — borrow that pattern higher up. |
| A2 | LOW | 1440 | Pull-quote ("Una región en la que la voz del sur global tenga peso propio…") sits flat between paragraphs without distinct framing. | Wrap quote in `<blockquote>` with left rule and italic typeface to elevate. |
| A3 | LOW | 375 | Pillar grid stacks well, but card titles (`Investigación`, `Educación`, `Gobernanza`, `Comunidad`) hug their description with no spacing; reads compressed. | Add ~8px margin-bottom to card title. |

### `/research`

| # | Severity | Viewport | Issue | Recommendation |
|---|---|---|---|---|
| R1 | HIGH | All | "Investigación en desarrollo" cards render with a peach hero band at top with no image — looks like a broken `<img>`. | Either populate with an actual image (project poster) or remove the band entirely; today it reads as missing-asset. |
| R2 | MED | 768 | "Trabajamos con" partner chips wrap with inconsistent vertical alignment; the second row right-aligns awkwardly. | `flex-wrap: wrap; justify-content: flex-start;` plus `row-gap: 8px`. |
| R3 | LOW | 1440 | Single Paper card under "Papers y trabajos publicados" looks lonely centered with lots of cream around it. | If only one item, widen to full container or add a placeholder "más por venir" card. |

### `/programs`

| # | Severity | Viewport | Issue | Recommendation |
|---|---|---|---|---|
| P1 | HIGH | All | "Galería de certificados" shows ~5 empty cream tiles with only the UADY/Centro-Geo certificates partially populated. | Wire real certificate thumbnails or hide the section until images are ready. Empty tiles undermine credibility. |
| P2 | MED | 1440 | "Programas para instituciones" card body lengths are uneven (one ends mid-paragraph) — vertical alignment of FACILITADORES tag drifts. | Set card body to `display: flex; flex-direction: column; min-height` so meta rows always align. |
| P3 | LOW | 375 | Material chips ("BlueDot Impact", "AI Safety Atlas", etc.) push close to card edge. | Increase card padding 4–8px on mobile. |

### `/projects` (index)

| # | Severity | Viewport | Issue | Recommendation |
|---|---|---|---|---|
| PJ1 | LOW | 1440 | VIGÍA / AI Safety Connect cards have inconsistent recognition badges (only VIGÍA gets the orange "Special Recognition" pill); creates visual asymmetry. | Either give AI Safety Connect a comparable badge ("SPAR Collab" or similar) or align both to the same metadata pattern. |
| PJ2 | LOW | 768 | Card image (screenshot of project UI) sits flush with card top edge — no inner padding above the image. | Add 12px top padding inside card OR let image bleed full-width edge-to-edge for visual contrast. |

### `/projects/vigia`

| # | Severity | Viewport | Issue | Recommendation |
|---|---|---|---|---|
| V1 | MED | 1440 | "Otros proyectos" section shows a single AI Safety Connect card aligned hard-left; lots of empty cream area to the right. | Center the related-project card or add a second "future" placeholder. Feels half-built today. |
| V2 | LOW | 768 | Meta-chip bar wraps to 2 rows but the orange "Special Recognition" chip dominates because it's full-color while siblings are outline. | Use the same chip style and reserve color only for the most important badge, OR keep current pattern but ensure all chips wrap evenly. |

### `/projects/ai-safety-connect`

| # | Severity | Viewport | Issue | Recommendation |
|---|---|---|---|---|
| AS1 | MED | 1440 | Large empty cream band (~280px) between the "Reporte final" CTA card and "Co-investigadores" section — unintentional gap. | Tighten section margin, or surface paper preview / pull-quote in the gap. |
| AS2 | MED | 1440 | Meta chip bar mixes types: `Special Recognition`, `Equipo internacional`, `Reporte final disponible`, `5 co-investigadores`. The last is a count not a category. | Remove the count chip — the dedicated section already lists co-investigators. |
| AS3 | LOW | 375 | Methodology cards (`Mentoría`, `Métricas`, etc.) — small icon followed by long body — body wraps to 4–5 lines making cards visually heavy. | Reduce body to 2 sentences or add a "Saber más" link to push detail elsewhere. |

### `/team`

| # | Severity | Viewport | Issue | Recommendation |
|---|---|---|---|---|
| T1 | MED | 1440 | "Advisors" section shows a single advisor card centered in a wide cream band — visually asymmetric (looks like the row is missing siblings). | Either widen card to 2-col placeholder ("Advisors adicionales próximamente") or center+constrain card width and shrink section padding. |
| T2 | LOW | 1440 | Team photos use circular crops with thin orange border. The borders compete with the orange CTA tone elsewhere. | Use a softer beige/gold border or drop border, rely on photo alone. |
| T3 | LOW | 375 | Collaborator group titles ("Investigación y proyectos en México", "Equipo internacional · SPAR · AI Safety Connect") are long and wrap awkwardly. | Shorten to 3–4 words or break onto two visual lines with smaller line-height. |

### `/activities`

| # | Severity | Viewport | Issue | Recommendation |
|---|---|---|---|---|
| AC1 | HIGH | All | "Conferencias, talleres y formación" — 3 cards each have an empty cream image band at top (no image rendered). | Wire activity photos OR remove image slot — image-less variant of the card. |
| AC2 | HIGH | All | "Mesas de trabajo recurrentes" card image area is empty (white placeholder). | Same fix as AC1. |
| AC3 | MED | 1440 | "Imágenes de nuestras actividades" appears to be a single static photo collage rather than a carousel/gallery; on desktop it dominates with no controls visible. | Confirm carousel JS is loading; if static-by-design, render as a 3-col gallery grid for visual rhythm. |
| AC4 | LOW | 768 | Apart logo overlay on Global South AIS Challenge card sits over text; legibility marginal. | Add subtle text shadow or shift logo to a corner badge. |

### `/get-involved`

| # | Severity | Viewport | Issue | Recommendation |
|---|---|---|---|---|
| GI1 | MED | 1440 | Form fields (`Nombre`, `Correo`, `Organización`, `Tipo de colaboración`, `Mensaje`) render as a 2-column grid except the last 2 which span full width — uneven rhythm. | Either keep all fields full-width OR structure into a clean 2-col with consistent row pairing. |
| GI2 | MED | All | "Contacto directo" mini-cards (correo / linkedin / instagram) duplicate info already presented in `/contact`. Risk of redundancy. | Trim this section or replace with a single "¿Prefieres email?" callout linking to `/contact`. |
| GI3 | LOW | 375 | Form labels are tight to inputs; visual hierarchy between label and field could breathe more. | Increase margin-bottom on `<label>` from current value to 8px. |

### `/contact`

| # | Severity | Viewport | Issue | Recommendation |
|---|---|---|---|---|
| C1 | MED | 1440 | Page is short; "¿Quieres colaborar con nosotros?" CTA dominates the lower half. The 3-channel block feels small relative to it. | Add icon bullets to channels (envelope, in, ig) or scale up the channel cards to match CTA visual weight. |
| C2 | LOW | 768 | "Tiempo de respuesta" / "Región" details sit as run-on body copy below cards; under-styled. | Use a small definition-list (`<dl>`) or chip pair to elevate them. |
| C3 | LOW | All | "@aisafetymx" handle on Instagram block lacks a `https://instagram.com/...` style hint — looks like a username, not a link. | Add `→` arrow or underline-on-hover to signal clickability. |

---

## Cross-page consistency notes
- **Header height** is consistent across pages — good.
- **Footer** identical and well-aligned; no issues.
- **Eyebrow → H1 → lede** pattern is consistent on hero blocks across `/about`, `/research`, `/programs`, `/team`, `/activities`, `/get-involved`, `/contact` — strong.
- **Card padding** varies: `/programs` cards have ~24px padding while `/research` cards have ~20px. Pick one and apply everywhere.
- **Section background alternation** (white ↔ cream ↔ navy CTA) is well-used as a rhythm device, but **two consecutive cream sections** appear on `/about` ("Hacia dónde apuntamos" → quote → "Nuestros pilares") which weakens the cadence; insert a divider or a subtle background swap.
- **Active nav state** (`aria-current="page"`) is too subtle on the dark header — applies to every page.

---

## Summary counts

| Severity | Count |
|---|---|
| HIGH | 5 |
| MED  | 13 |
| LOW  | 13 |
| **Total** | **31** |

> Issue counts above reflect the row tally across the per-page tables (excluding the cross-page consistency notes, which are advisory).
