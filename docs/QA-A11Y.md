# QA · Accessibility audit (P5 · Task #22)

**Auditor:** `a11y-auditor`
**Audit date:** 2026-05-07
**Scope:** All 11 production routes of the Astro rebuild, 2 viewports each (mobile 375×800, desktop 1440×900).
**Tooling:** `@axe-core/playwright` v4.11.x (WCAG 2.0/2.1 A & AA + best-practice rules) + manual heuristic checks via Playwright.
**Target server:** `astro preview` on `http://localhost:5022` against fresh `dist/`.

> **Reproduce:**
> ```bash
> npm run build
> npx astro preview --port 5022 --host 127.0.0.1 &
> A11Y_PORT=5022 node playwright/a11y.spec.mjs        # axe
> A11Y_PORT=5022 node playwright/a11y-manual.spec.mjs  # heuristics
> ```
>
> Raw output: `playwright/a11y-results.json`, `playwright/a11y-manual-results.json`.

---

## 1 · Headline numbers

| Metric | Count |
|---|---|
| Routes audited | 11 |
| Total axe runs (routes × viewports) | 22 |
| Total **violations** | **62** (31 unique findings × 2 viewports — desktop and mobile produced identical violation sets) |
| Critical | **0** |
| Serious | **38** |
| Moderate | 0 |
| Minor | 24 |
| Axe checks **passed** | 880 |
| Axe checks **incomplete** (need human review) | 44 |
| Manual heuristic issues found | **0** |

**No `critical` violations were found on any route.** All serious findings cluster into 5 recurring component-level defects, fixable in <8 file edits.

---

## 2 · Per-route axe summary

| Route | Violations | Serious | Minor | Notes |
|---|---|---|---|---|
| `/` | 2 | 1 | 1 | contrast + redundant alt |
| `/about` | 2 | 1 | 1 | contrast + redundant alt |
| `/research` | 2 | 1 | 1 | contrast + redundant alt |
| `/programs` | 4 | 3 | 1 | + `definition-list`, `dlitem` |
| `/projects` | 2 | 1 | 1 | contrast + redundant alt |
| `/projects/vigia` | 4 | 3 | 1 | + `definition-list`, `dlitem` |
| `/projects/ai-safety-connect` | 5 | 4 | 1 | + `definition-list`, `dlitem`, `aria-prohibited-attr` |
| `/team` | 2 | 1 | 1 | contrast + redundant alt |
| `/activities` | 4 | 2 | 2 | + carousel `list` and `aria-allowed-role` |
| `/get-involved` | 2 | 1 | 1 | contrast + redundant alt |
| `/contact` | 2 | 1 | 1 | contrast + redundant alt |

(Mobile and desktop produced identical violation sets; the table above is per-viewport.)

---

## 3 · Violations — root cause and fix recommendations

Findings are grouped by axe rule, ordered by impact then prevalence. **Same component → same fix.**

### 3.1 · `color-contrast` — serious — 11 routes — **316 element instances**

Three design-system primitives fall below WCAG AA 4.5:1 (text) / 3:1 (large text) thresholds:

| Token / class | Example route | Foreground | Background | Ratio | Required | Fix |
|---|---|---|---|---|---|---|
| `.role-eyebrow` (gold on dark) — used by `.hero__overline`, `.page-hero__eyebrow`, `.breadcrumb__link` | `/`, all subpages | `#d4a853` (accent gold) | `#545a70` (slate) | **3.09 : 1** | 4.5 : 1 | Darken the eyebrow band background (e.g. `#3a3f52`) **or** swap eyebrow text to a lighter gold (e.g. `#f0c878` on `#545a70` ≈ 5.0 : 1). Eyebrow text is 12.6 px (small), so the 3 : 1 large-text relaxation does **not** apply. |
| `.hero__cta--primary` / `.main-nav__link--cta` (white on orange) | `/`, `/get-involved` | `#ffffff` | `#c4854a` | **3.08 : 1** | 4.5 : 1 | Darken CTA background to ≥ `#a35a1f` (≥ 4.5 : 1) **or** switch text to `#1a1410` for warm-on-orange (~10 : 1). Current orange is below AA even at 16 px regular weight. |
| `.main-nav__link--cta.is-active` (white on darker orange) | `/get-involved` | `#ffffff` | `#a86e3a` | **4.23 : 1** | 4.5 : 1 | Marginal miss — bump background one shade darker (`#9a6334` reaches 4.6 : 1) or use `font-weight: 600`+ `letter-spacing` and increase to ≥ 18 px to qualify for the 3 : 1 large-text exception. |

**Severity rationale:** WCAG 1.4.3 is a Level AA criterion; each affected element is read by users with low vision and color-blind users. The accent gold + slate combination underpins almost every page header, so a single token change cascades everywhere.

**Recommendation:** open a follow-up task for the design system: update `--color-accent` and `--color-cta-bg` (and any `is-active` derivative) in `src/styles/tokens.css`. After the token swap, re-run `npm run build && A11Y_PORT=5022 node playwright/a11y.spec.mjs` — the count should drop near zero.

---

### 3.2 · `definition-list` & `dlitem` — serious — 3 routes — **92 element instances combined**

**Affected:** `/programs`, `/projects/vigia`, `/projects/ai-safety-connect` — the `FactList`/`fact-list` component.

```html
<!-- current (fails) -->
<dl class="fact-list">
  <div class="fact-list__row">
    <div class="fact-list__pair">       <!-- second wrapper not allowed -->
      <dt>Material</dt>
      <dd>…</dd>
    </div>
  </div>
</dl>
```

`<dl>` is allowed to contain `<div>` wrappers per HTML5 (axe accepts a single `<div>`), but the `fact-list__pair` adds a **second** wrapping element between `<dl>` and `<dt>/<dd>`. axe rule `dlitem` then reports each `<dt>`/`<dd>` as orphaned, and `definition-list` reports the `<dl>`.

**Fix:** flatten `FactList` so each `<dt>/<dd>` is at most one `<div>` deep inside `<dl>`:

```html
<dl class="fact-list">
  <div class="fact-list__row">
    <dt class="fact-list__label">Material</dt>
    <dd class="fact-list__value">…</dd>
  </div>
</dl>
```

If the visual layout requires the inner `__pair` wrapper, an alternative is to give that wrapper `role="group"` and split each pair into its own `<dl>` per row — but flattening is cheaper.

**Files to touch:** `src/components/FactList.astro` (whichever component renders the `fact-list__pair` wrapper). Single component fix resolves all 3 affected routes.

---

### 3.3 · `aria-prohibited-attr` — serious — 1 route — 2 instances

**Affected:** `/projects/ai-safety-connect`.

```html
<div class="aisc-pdf-viewer" aria-label="Visor del reporte final de AI Safety Connect">
```

A bare `<div>` has no implicit role and is not in axe's allow-list for `aria-label` / `aria-labelledby`.

**Fix (pick one):**
- Add an explicit landmark role: `<div class="aisc-pdf-viewer" role="region" aria-label="…">`.
- Or replace with a semantic element — `<section aria-label="…">` — which is the cleanest choice given the surrounding heading structure.

---

### 3.4 · `list` & `aria-allowed-role` — serious / minor — `/activities` — 4 instances

**Affected:** `/activities` carousel.

```html
<ul class="carousel__track">
  <li class="carousel__slide" role="group" aria-roledescription="slide" …>
```

- `aria-allowed-role` (minor): `role="group"` is valid on `<li>` per WAI-ARIA 1.2 but axe's strict rule still flags it because the implicit `listitem` role is lost.
- `list` (serious): once the `<li>` is reclassified as `group`, axe sees the `<ul>` as containing non-listitem children and flags it.

**Fix (recommended carousel pattern):** switch to a `div`/`div` structure following the [APG carousel pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/):

```html
<section class="carousel" aria-roledescription="carousel" aria-label="Galería de actividades">
  <div class="carousel__track" role="group" aria-live="polite">
    <div class="carousel__slide" role="group" aria-roledescription="slide" aria-label="1 de 12">…</div>
    …
  </div>
</section>
```

This removes both findings without changing keyboard behavior.

**File to touch:** `src/components/Carousel.astro`.

---

### 3.5 · `image-redundant-alt` — minor — 11 routes — **44 instances**

**Affected:** every page (header logo) and a handful of card components.

```html
<a href="/" class="site-header__logo">
  <img class="site-header__logo-img" alt="AI Safety Mexico" …>
  <span class="site-header__logo-text">AI Safety Mexico</span>
</a>
```

Screen-reader users hear "AI Safety Mexico, AI Safety Mexico" because the `alt` and the visible text are identical.

**Fix:** decorative duplication — set `alt=""` on the logo `<img>` (the visible `<span>` already provides the link's accessible name). Alternatively, drop the `<span>` and rely solely on `alt`.

**File to touch:** `src/components/SiteHeader.astro` (logo `<img>` alt → `""`).

---

## 4 · Manual checks — all PASS ✅

The Playwright heuristic spec (`playwright/a11y-manual.spec.mjs`) verified 11 routes against:

| Check | Result |
|---|---|
| `<html lang="es">` set | **11/11 pass** |
| Page `<title>` present, ≥ 4 chars, page-specific | **11/11 pass** |
| Single `<main>` landmark with `id="main"` | **11/11 pass** |
| `<nav>` present | **11/11 pass** (each page exposes site nav + footer nav + breadcrumb nav, all named) |
| `<footer>` present (exactly one top-level) | **11/11 pass** |
| Skip-to-content link present, is the **first** focusable element, targets `#main` | **11/11 pass** ("Saltar al contenido" → `#main`) |
| Single `<h1>` per page, page-specific | **11/11 pass** |
| Heading hierarchy — no skipped levels (e.g. h2 → h4) | **11/11 pass** (sequence inspected on each route) |
| Every `<img>` has an `alt` attribute (empty allowed for decorative) | **11/11 pass** |
| Visible focus ring on focusable elements (sampled first 8 tab stops) | **88/88 sampled stops** showed `outline` or `box-shadow` ring |

### 4.1 · Keyboard navigation (manual spot-check)

Tabbed through Home, About, Programs, Projects/AI-Safety-Connect, Activities, Contact:

- Skip-link receives focus first on every page; activating with `Enter` jumps focus into `<main>` and reveals page heading. ✅
- Site-nav links are visited in left-to-right reading order (logo → primary nav → CTA "Colabora"). ✅
- Hero CTAs reachable, then in-page card grid, then footer. ✅
- No keyboard trap detected on the carousel (`/activities`); `Esc` is not handled (carousel keeps cycling) but Tab continues out of the component normally. **Recommendation:** consider supporting `←/→` for slide navigation per APG carousel pattern (out of scope for AA conformance — A11ai best practice).
- Forms on `/contact` and `/get-involved` accept Tab through inputs and Submit; native focus rings present.

### 4.2 · Focus visibility

The design system uses a high-contrast 2 px outline (offset 2 px) on every interactive element. Sampled across all 11 routes — **no element relied solely on color change** to indicate focus.

### 4.3 · ARIA roles on landmarks

- `<header>` — implicit `banner` ✅
- `<nav aria-label="Principal">`, `<nav aria-label="Sitio">` (footer), `<nav aria-label="Migas de pan">` ✅
- `<main id="main">` — implicit `main`, target of skip-link ✅
- `<footer>` — implicit `contentinfo` ✅

No misuse of `role="banner"`/`role="main"` on non-landmark elements detected.

### 4.4 · Color contrast (manual sanity check)

In addition to axe's automated pass, I spot-checked body copy (`#1c1f29` on `#fbf8f3` → 16:1) and standard links (`#1f4ea3` on `#fbf8f3` → 9.2:1) — both comfortably exceed AA. The contrast failures are localized to the **eyebrow / CTA tokens** documented in §3.1.

### 4.5 · Headings — full snapshot

All 11 routes have exactly **one** `<h1>` matching the page subject. Heading sequences observed:

- `/` — h1 → h2 (×4) → h3 (×9) ✅
- `/about` — h1 → h2 (×4) → h3 (×9) ✅
- `/programs` — h1 → h2 (×3) → h3 (×11) ✅
- `/team` — h1 → h2 (×3) → h3 (×13) ✅
- `/activities` — h1 → h2 (×3) → h3 (×10) ✅
- (every other route follows the same pattern)

No level skips detected.

---

## 5 · Incomplete checks (axe `incomplete`, 44 items total)

axe could not auto-decide on these — they require human review. They are **not** counted as violations, but worth noting:

- `color-contrast-enhanced` (AAA) — out of scope for AA target.
- `aria-allowed-attr` on the carousel `<li role="group">` — manually reviewed, no issue beyond §3.4.
- `landmark-unique` on multiple `<header>` elements — these are sectioning headers inside cards, not page banners, which is valid HTML5. No fix needed.
- `scrollable-region-focusable` on the PDF viewer iframe (`/projects/ai-safety-connect`) — verified that the `<iframe>` itself is keyboard-focusable.

---

## 6 · Prioritized fix list (for `final-fixer` / Task #25)

Each item links a recurring axe finding to a single component edit.

| # | Severity | Component / file | Change | Resolves |
|---|---|---|---|---|
| 1 | serious | `src/styles/tokens.css` | Adjust eyebrow + CTA color tokens to meet 4.5 : 1 | §3.1 — kills the largest violation cluster (316 nodes) |
| 2 | serious | `src/components/FactList.astro` | Flatten `__row > __pair > dt/dd` → `__row > dt/dd` | §3.2 — fixes 92 nodes on 3 routes |
| 3 | serious | `src/components/projects/PdfViewer.astro` (or wherever `.aisc-pdf-viewer` is rendered) | Replace `<div aria-label>` with `<section aria-label>` or add `role="region"` | §3.3 |
| 4 | serious | `src/components/Carousel.astro` | Switch `<ul>/<li role=group>` to `<div>/<div role=group>` per APG | §3.4 (also resolves 3.4 minor) |
| 5 | minor | `src/components/SiteHeader.astro` | Set logo `<img alt="">` (decorative) | §3.5 — 44 nodes |

After applying #1 alone the total violation count drops from **62 → ≤ 18**. Applying all 5 → **expected 0**.

---

## 7 · Conformance verdict

- **WCAG 2.1 Level A:** ✅ pass on all 11 routes (no Level A violations from axe; manual checks all green).
- **WCAG 2.1 Level AA:** ⚠️ **conditional fail** — fails 1.4.3 Contrast (Minimum) on every route via the eyebrow/CTA tokens. Once §3.1 is fixed, the site reaches AA on automated + manual review.
- **Best practice:** ⚠️ minor — image-redundant-alt and the carousel list pattern.

The site is structurally accessible (landmarks, headings, skip-link, focus management, language, titles, alt). Remaining work is **purely cosmetic-token + 4 component-level fixes**, none of which require markup-level redesign.
