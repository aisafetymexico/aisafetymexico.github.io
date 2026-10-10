# RAND.org — Aesthetic Reference

Source captures: `docs/inspiration/rand-detailed/{home,about,research,topics,publication}-1440[-full].png` (Playwright @ 1440px).

This document distills the visible patterns from RAND.org so we can apply equivalent
restraint to the AI Safety Mexico site (Task #26 — "RAND-ify"). We are not copying the
identity (purple, geometric mark) — only the **typographic discipline** and **icon
restraint** that make RAND read as an institution rather than a marketing site.

---

## 1 · Iconography — almost none

The single clearest signal across home, about, research and topics: **decorative
emojis and icons are absent**. What exists, exists for a reason:

| Where | What | Why it works |
|---|---|---|
| Header / footer | Brand mark (purple square logo). | Identity, not decoration. |
| Topic accordion rows | Single chevron (`▾` / `›`). | Functional — disclosure affordance. |
| "Trending" eyebrow | Tiny line-style trend arrow. | A type-scale glyph, not an emoji. |
| About → "What we do" rows | Tiny single-color square (~24 px). | Low-contrast brand mark, not pictographic. |
| Search field | Magnifier icon. | Functional UI. |
| Card images | Photographs. | Editorial, not decorative. |

**There are no emojis. No 1.4-rem coloured glyphs introducing list rows. No
icon circles in front of feature cards.** Hierarchy is carried entirely by
typography and whitespace.

---

## 2 · How RAND replaces icons

When RAND needs to introduce a row or card without an image, it leans on three
type-only devices — never a pictograph:

1. **Eyebrow label** — uppercase, tracked-out, small (e.g. `RESEARCH`,
   `EXPERT INSIGHTS`, `FEATURED`, `TRENDING`). Paired with a coloured underline
   (purple) on active nav items.
2. **Bold display headline** — heavy sans-serif title sets the focal weight
   that an icon would carry.
3. **Date / metadata line** — small grey caption (`May 5, 2025`) anchors the
   piece in time.

The result is a card whose visual identity comes from **(image | label | title
| date)**, not from an icon circle.

---

## 3 · Cards — image-led or type-only

Two card patterns dominate:

- **Image-led editorial card** (home, research): photo on top → small all-caps
  label → bold sans title → date. No author bullet. No icon. Border is a
  hairline; corners are square or slightly rounded.
- **Type-only row** (topics accordion, About → What We Do): a horizontal rule
  separates each row; the row is `Title — chevron` with optional one-line
  description below. No icon, no chip, no shadow. The hairline rule between
  rows replaces the card.

Padding inside cards is generous; shadows are absent or extremely subtle. The
hover state is a colour shift on the title link, not a lift.

---

## 4 · Section separation — whitespace + hairlines

RAND breaks the page with three devices, in this order of frequency:

1. **Whitespace** — large vertical padding between sections (≈96 px on desktop).
2. **Hairline rules** — 1 px grey horizontal rules between rows in lists and
   between sections that share a background colour.
3. **Tonal blocks** — a subtle warm-grey or pale-purple band wraps newsletter /
   subscribe sections; the rest of the page is white.

There are **no decorative dividers** (no copper bars, no gradients, no
geometric shapes) introducing each section.

---

## 5 · Lists & grids — typography only

- **Topic list** (left rail of the Topics page): plain bold links, no bullets,
  no icons, stacked tightly with line-height ≈ 1.4.
- **Topics accordion** (main column): hairline rule + bold title + chevron. No
  numbering, no glyph.
- **"What we do" rows** on the About page: small monochrome brand square + bold
  title + descriptive paragraph. The square is a logo-mark, not a pictograph,
  and is the same colour as the brand for every row — it's a typographic mark,
  not an emoji.

When a list needs ordering or counting, RAND uses **numerals** (e.g. "1. /
2. / 3." in research summaries) rather than bullet glyphs.

---

## 6 · Hero / page-hero pattern

`Topics` page is the cleanest example:

- Slim breadcrumb above the title (`RAND / Topics`) — small, grey, slash-
  separated.
- **Massive H1** — heavy sans-serif, near-black, no overline tag.
- One-paragraph deck below — serif (or stylistically distinct from the H1),
  ≈ 60 ch wide, in `text-secondary` grey.
- Below the deck, a "TRENDING" eyebrow + a list of topical links, all type.

There is no overline coloured chip, no animated badge, no icon.

`About` and `Research & Commentary` follow the same pattern but include the
sticky left rail (`Topics / Research / Experts / About`) under the page hero.

---

## 7 · Editorial typography

- **H1**: very heavy sans-serif, large size, `letter-spacing: 0` (no tightening),
  near-black, line-height ≈ 1.05.
- **H2 / H3**: same family, slightly smaller, still heavy.
- **Body**: serif (Tiempos / Source Serif feel), comfortable measure (≈ 60–70
  ch), generous line-height (≈ 1.55).
- **Eyebrow / metadata**: tracked-out (≈ 0.08 em), uppercase, ~12–13 px, often
  in brand purple or grey-700.
- **Numbers**: when stats appear, they use a heavy display weight at 2× the
  surrounding body size — the **number itself** is the visual anchor.

---

## 8 · Five patterns to import to AI Safety Mexico

1. **Strip decorative emojis from cards, key-facts, fact-lists and feature
   tiles.** Replace with eyebrow labels and bolder title typography.
2. **Use numerals (`01`, `02`, `03`, `04`) on pillars** — set in the display
   serif (Playfair) at ~3× body, in copper (our brand accent) above each pillar
   title. This is RAND's "number-as-anchor" trick adapted to our palette.
3. **Replace icon-glyph chips in `KeyFacts` with type-only chips** — uppercase
   eyebrow optional + value. Hairline border, no leading glyph.
4. **Replace icon-glyph rows in `FactList` with two-line label/value rows** —
   eyebrow label (already in CSS) on top, value below, hairline rule between
   rows. No leading glyph.
5. **Replace pictographic icon discs in `FeatureGrid` cards with a copper
   chevron (`›`)** placed after the title or in the link affordance line — only
   for cards that have an `href`. Non-link cards lose the disc entirely; the
   title carries the focal weight.

---

## 9 · What we keep (do not touch)

- Header logo image — institutional mark.
- Footer social SVGs (LinkedIn, Instagram) — functional, navigational.
- Carousel arrows (`‹` `›`) — functional UI glyphs, RAND uses chevrons too.
- Brand palette (Navy / Copper / Cream / Gold) and typography pair (Playfair /
  Inter) — the goal is **RAND-style discipline applied to our identity**, not a
  visual reskin.
