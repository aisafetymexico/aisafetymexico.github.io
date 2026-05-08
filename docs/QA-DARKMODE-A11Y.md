# QA · Dark-mode (subtle) Accessibility audit (P4 · Task #6)

**Auditor:** `a11y-subtle`
**Audit date:** 2026-05-08
**Scope:** All **12 production routes** of the Astro site running the SUBTLE dark-mode palette (POSTER-PALETTE §2 / PALETTE-MAPPING §2), 2 viewports each (mobile 375×800, desktop 1440×900).
**Tooling:** `@axe-core/playwright` v4.11.x (WCAG 2.0/2.1 A & AA + best-practice rules), Playwright DOM heuristic spec, and a manual contrast calculator (relative luminance per WCAG 2.1 1.4.3) over every dark-mode token pairing.
**Target server:** `astro preview` on `http://localhost:5082` against fresh `dist/` (post-token-swap, post-base-shell, post-components, post-pages migrations — Tasks #1–#4 already merged into the worktree).

> **Reproduce:**
> ```bash
> npm run build
> npx astro preview --port 5082 --host 127.0.0.1 &
> A11Y_PORT=5082 node playwright/a11y-dark.spec.mjs           # axe, 12 routes × 2 viewports
> A11Y_PORT=5082 node playwright/a11y-dark-manual.spec.mjs    # heuristic checks
> ```
>
> Raw output:
> - `playwright/a11y-dark-results.json`
> - `playwright/a11y-dark-manual-results.json`

The 12 routes audited:

| # | Route | Astro source |
|---|---|---|
| 1 | `/` | `src/pages/index.astro` |
| 2 | `/about` | `src/pages/about.astro` |
| 3 | `/research` | `src/pages/research.astro` |
| 4 | `/programs` | `src/pages/programs.astro` |
| 5 | `/projects` | `src/pages/projects/index.astro` |
| 6 | `/projects/vigia` | `src/pages/projects/vigia.astro` |
| 7 | `/projects/ai-safety-connect` | `src/pages/projects/ai-safety-connect.astro` |
| 8 | `/team` | `src/pages/team.astro` |
| 9 | `/activities` | `src/pages/activities.astro` |
| 10 | `/get-involved` | `src/pages/get-involved.astro` |
| 11 | `/contact` | `src/pages/contact.astro` |
| 12 | `/global-south-challenge` | `src/pages/global-south-challenge.astro` |

---

## 1 · Headline numbers

| Metric | Subtle dark-mode | Light-mode baseline (Task #22) | Δ |
|---|---|---|---|
| Routes audited | 12 | 11 | +1 (added `/global-south-challenge`) |
| Total axe runs (routes × viewports) | 24 | 22 | — |
| Total **violations** | **30** | 62 | **−52 %** |
| Critical | **0** | 0 | — |
| Serious | **4** | 38 | **−89 %** |
| Moderate | 0 | 0 | — |
| Minor | 26 | 24 | +2 (logo `image-redundant-alt` × extra route) |
| Axe checks **passed** | 1,016 | 880 | +136 |
| Axe checks **incomplete** (need human review) | 60 | 44 | +16 |
| Manual heuristic issues found | **0** | 0 | — |
| Token contrast pairings tested | **26** | n/a | — |
| Token pairings that **fail their stated role** | **0** | n/a | — |

**No `critical` violations on any route.** All four `serious` instances cluster into **two pre-existing component bugs that are unrelated to the dark-mode palette swap** (`<div aria-label>` on the AISC PDF viewer wrapper, and the `<ul role-mismatch>` carousel pattern on `/activities`). The 316-instance `color-contrast` cluster that dominated the light-mode audit is **fully resolved** by the subtle palette — zero contrast violations from axe across all 24 runs.

---

## 2 · Per-route axe summary

| Route | Violations | Serious | Minor | Notes |
|---|---|---|---|---|
| `/` | 1 | 0 | 1 | logo redundant-alt only |
| `/about` | 1 | 0 | 1 | logo redundant-alt only |
| `/research` | 1 | 0 | 1 | logo redundant-alt only |
| `/programs` | 1 | 0 | 1 | logo redundant-alt only |
| `/projects` | 1 | 0 | 1 | logo redundant-alt only |
| `/projects/vigia` | 1 | 0 | 1 | logo redundant-alt only |
| `/projects/ai-safety-connect` | 2 | 1 | 1 | `aria-prohibited-attr` on PDF viewer |
| `/team` | 1 | 0 | 1 | logo redundant-alt only |
| `/activities` | 3 | 1 | 2 | carousel `<ul>` / `<li role>` |
| `/get-involved` | 1 | 0 | 1 | logo redundant-alt only |
| `/contact` | 1 | 0 | 1 | logo redundant-alt only |
| `/global-south-challenge` | 1 | 0 | 1 | logo redundant-alt only |

(Mobile and desktop produced identical violation sets; the table above is per-viewport.)

**Highlight:** the light-mode baseline reported `definition-list` + `dlitem` failures on `/programs`, `/projects/vigia`, and `/projects/ai-safety-connect` (FactList component, 92 nodes). Those are **gone** in this build — the FactList markup was flattened during the components/pages dark-mode pass, fixing the structural issue as a side-effect.

---

## 3 · Violations — root cause and fix recommendations

Findings grouped by axe rule, ordered by impact then prevalence.

### 3.1 · `aria-prohibited-attr` — serious — `/projects/ai-safety-connect` — 2 instances

```html
<div class="aisc-pdf-viewer" aria-label="Visor del reporte final de AI Safety Connect">
```

A bare `<div>` has no implicit role and is not in axe's allow-list for `aria-label`/`aria-labelledby`. **Pre-existing finding — identical to QA-A11Y §3.3 in light-mode audit.** Not introduced by the dark-mode work.

**Fix (pick one):**
- Replace with a semantic landmark: `<section class="aisc-pdf-viewer" aria-label="…">` (cleanest given the heading structure above).
- Or add an explicit role: `<div class="aisc-pdf-viewer" role="region" aria-label="…">`.

**File to touch:** `src/pages/projects/ai-safety-connect.astro` (PDF viewer wrapper, ~line 240).

---

### 3.2 · `list` & `aria-allowed-role` — serious / minor — `/activities` — 4 instances total

```html
<ul class="carousel__track">
  <li class="carousel__slide" role="group" aria-roledescription="slide" aria-label="1 de 12">
```

- `aria-allowed-role` (minor): `role="group"` overrides the implicit `listitem` role per WAI-ARIA 1.2; axe's strict rule still flags it.
- `list` (serious): once each `<li>` is reclassified as `group`, axe sees the `<ul>` as containing non-listitem children.

**Pre-existing finding — identical to QA-A11Y §3.4 in light-mode audit.**

**Fix:** switch the carousel to the `<div>`/`<div>` structure recommended by [APG carousel pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/):

```html
<section class="carousel" aria-roledescription="carousel" aria-label="Galería de actividades">
  <div class="carousel__track" role="group" aria-live="polite">
    <div class="carousel__slide" role="group" aria-roledescription="slide" aria-label="1 de 12">…</div>
  </div>
</section>
```

**File to touch:** `src/components/Carousel.astro`.

---

### 3.3 · `image-redundant-alt` — minor — all 12 routes — 48 instances total

```html
<a href="/" class="site-header__logo">
  <img class="site-header__logo-img" alt="AI Safety Mexico" …>
  <span class="site-header__logo-text">AI Safety Mexico</span>
</a>
```

Screen-reader users hear "AI Safety Mexico, AI Safety Mexico" because the `alt` and visible text are identical. **Pre-existing finding — identical to QA-A11Y §3.5 in light-mode audit.**

**Fix:** decorative duplication — set `alt=""` on the logo `<img>` (the visible `<span>` already provides the link's accessible name).

**File to touch:** `src/components/Header.astro` (logo `<img alt="">`).

---

### 3.4 · Findings **eliminated** vs the light-mode baseline

The following recurring failures from the previous audit (QA-A11Y) **no longer appear** in any of the 24 runs:

| Light-mode rule | Light-mode count | Subtle dark-mode count | Why it cleared |
|---|---|---|---|
| `color-contrast` (eyebrow gold-on-slate, white-on-orange CTA) | **316 nodes / 11 routes** | 0 | Subtle palette uses `peach-500 #D49E86` (7.18:1) for inline accents and **inverts** CTA text → bg-base on peach (7.18:1). Eyebrows/rules use `sky-300 #92A0CD` (6.47:1). All clear AA body. See §5. |
| `definition-list` + `dlitem` (FactList) | 92 nodes / 3 routes | 0 | FactList markup was flattened during the components/pages migration — `<dl><div><dt><dd></div></dl>` no longer has a second nested wrapper. |

**Net dark-mode regression introduced: zero.** The subtle palette change is purely additive on the contrast axis.

---

## 4 · Manual heuristic checks — all PASS ✅

The Playwright heuristic spec (`playwright/a11y-dark-manual.spec.mjs`) verified all 12 routes against the same checks as the light-mode audit. **All 12/12 routes pass every check.**

| Check | Result |
|---|---|
| `<html lang="es">` set | **12/12 pass** |
| Page `<title>` present, ≥ 4 chars, page-specific | **12/12 pass** |
| Single `<main id="main">` landmark | **12/12 pass** |
| `<nav>` present (≥1) | **12/12 pass** (site nav + footer nav + breadcrumb nav, all named) |
| Single `<footer>` | **12/12 pass** |
| Single `<header>` | **12/12 pass** |
| Skip-to-content link is the **first** focusable element and targets `#main` | **12/12 pass** ("Saltar al contenido" → `#main`) |
| Single `<h1>` per page | **12/12 pass** |
| Heading hierarchy — no skipped levels | **12/12 pass** |
| Every `<img>` has an `alt` attribute | **12/12 pass** (empty alt allowed for decorative; only redundancy flagged in §3.3) |
| Visible focus ring on focusable elements (sampled 8 tab-stops per route) | **96/96 sampled stops** show outline or ring |

### 4.1 · Keyboard navigation (manual spot-check)

Tabbed through Home, About, Programs, Projects/AI-Safety-Connect, Activities, Contact, and Global-South-Challenge:

- Skip-link receives focus first on every route; `Enter` jumps focus into `<main>` and reveals page heading. ✅
- Site-nav links visited in left-to-right reading order (logo → primary nav → CTA "Colabora"). ✅
- Hero CTAs reachable, then card grid, then footer. ✅
- No keyboard trap on `/activities` carousel — `Tab` continues out of the component normally. (`←/→` arrow-key slide navigation still not wired; flagged as APG best-practice in light-mode audit, out of scope for AA.)
- Forms on `/contact` and `/get-involved` accept Tab through inputs and Submit; native focus rings present.

### 4.2 · Focus visibility under the subtle palette

The design system uses `--color-focus-ring: var(--peach-500)` (`#D49E86`), which scores **7.18 : 1** against `--bg-base` and **6.52 : 1** against `--bg-elevated`. Both clear WCAG 1.4.11 (3 : 1 non-text minimum) and 2.4.13 (focus appearance) by a wide margin. Sampled across all 12 routes — **no element relied solely on color change** to indicate focus.

### 4.3 · ARIA roles on landmarks

- `<header>` — implicit `banner` ✅
- `<nav aria-label="Principal">`, `<nav aria-label="Sitio">` (footer), `<nav aria-label="Migas de pan">` ✅
- `<main id="main">` — implicit `main`, target of skip-link ✅
- `<footer>` — implicit `contentinfo` ✅

No misuse of `role="banner"`/`role="main"` on non-landmark elements detected.

---

## 5 · Manual contrast — WCAG 2.1 AA verification (token pairings)

Every dark-mode color pairing that the semantic layer can resolve to was checked against WCAG 2.1 SC 1.4.3 (Contrast Minimum) and SC 1.4.11 (Non-text Contrast). Numbers below were computed with the WCAG relative-luminance formula on the literal sRGB hex values from `src/styles/tokens.css`.

### 5.1 · Body / heading text on canonical surfaces

| Foreground | Background | Ratio | AA body (4.5 : 1) | AA large (3 : 1) | Token role | Token claim |
|---|---|---|---|---|---|---|
| `cream-500 #EBE7DD` | `bg-base #1E1E1C` | **13.52** | ✅ | ✅ | `--color-text-primary`, `--color-text-heading` | ✓ matches |
| `cream-500 #EBE7DD` | `bg-elevated #262624` | **12.28** | ✅ | ✅ | text on cards | (derived) |
| `cream-500 #EBE7DD` | `bg-overlay #2D2D2A` | **11.19** | ✅ | ✅ | text on overlays | (derived) |
| `cream-500 #EBE7DD` | `indigo-900 #1F274D` | **11.68** | ✅ | ✅ | text on impact band | (derived) |
| `gray-300 #BAB6AE` | `bg-base #1E1E1C` | **8.26** | ✅ | ✅ | `--color-text-secondary` | ✓ matches |
| `gray-300 #BAB6AE` | `bg-elevated #262624` | **7.50** | ✅ | ✅ | secondary on cards | (derived) |
| `gray-500 #979593` | `bg-base #1E1E1C` | **5.59** | ✅ | ✅ | `--color-text-muted` | ✓ matches |
| `gray-500 #979593` | `bg-elevated #262624` | **5.08** | ✅ | ✅ | muted on cards | (derived) |

All body / heading roles pass AA body **with substantial headroom** (lowest is gray-500 muted at 5.08 : 1 on the elevated surface — still 13 % above the 4.5 : 1 AA threshold).

### 5.2 · Inline accents (links, eyebrows, secondary)

| Foreground | Background | Ratio | AA body | AA large | Token role | Notes |
|---|---|---|---|---|---|---|
| `peach-500 #D49E86` | `bg-base #1E1E1C` | **7.18** | ✅ | ✅ | `--color-accent`, `--color-link`, `--color-focus-ring` | guardrail #1 — body-link MUST be peach |
| `peach-500 #D49E86` | `bg-elevated #262624` | **6.52** | ✅ | ✅ | accent on cards | passes 4.5:1 |
| `peach-500 #D49E86` | `indigo-900 #1F274D` | **6.21** | ✅ | ✅ | accent on impact band | passes 4.5:1 |
| `peach-300 #DCB099` | `bg-base #1E1E1C` | **8.52** | ✅ | ✅ | `--color-link-hover`, `--color-accent-hover` | hover lifts (RAND/Brookings convention) |
| `sky-300 #92A0CD` | `bg-base #1E1E1C` | **6.47** | ✅ | ✅ | `--color-accent-secondary` (eyebrows / hairlines) | clears AA body — token comment notes 6.33, calc gives 6.47, both pass |
| `sky-300 #92A0CD` | `bg-elevated #262624` | **5.87** | ✅ | ✅ | eyebrow on cards | passes 4.5:1 |

### 5.3 · Display-only / decorative primitives (NOT for body text)

These primitives are **defined** in `tokens.css` §1.1b but **explicitly not used** by any semantic token, component, or page (verified with `grep -rEn "var\(--(indigo-500\|sky-500\|indigo-300)\)" src/` — only the comment in the tokens header references them). Their contrast values match the token-file documentation:

| Foreground | Background | Ratio | AA body | AA large | Documented role | Live usage in source |
|---|---|---|---|---|---|---|
| `sky-500 #6A7ABC` | `bg-base #1E1E1C` | **4.07** | ❌ | ✅ | "LARGE-TEXT ONLY (≥18pt / ≥14pt bold)" — token comment | none |
| `indigo-500 #404F96` | `bg-base #1E1E1C` | **2.21** | ❌ | ❌ | "DECORATIVE DISPLAY ONLY — fails AA body" | none |
| `indigo-300 #7081B0` | `bg-base #1E1E1C` | **4.34** | ❌ | ✅ | (not labeled in tokens; large-text only) | none |

**Verdict:** the guardrails documented at the top of `tokens.css` (lines 14–20) are **fully respected** in the live build. No body-size text is rendered using any of these three primitives.

### 5.4 · CTA (inverted dark-mode pattern)

Per PALETTE-MAPPING guardrail #3, the CTA inverts: dark text on peach fill (cream-on-peach scores ~2 : 1 and would fail AA — guard rail prevents that mistake).

| Foreground | Background | Ratio | AA body | AA large | Token role |
|---|---|---|---|---|---|
| `bg-base #1E1E1C` | `peach-500 #D49E86` | **7.18** | ✅ | ✅ | `--color-cta-text` on `--color-cta-bg` (rest state) |
| `bg-base #1E1E1C` | `peach-700 #B88069` | **5.03** | ✅ | ✅ | `--color-cta-text` on `--color-cta-bg-hover` (hover state) |

The token-file comment at line 178 flags `peach-700` hover as "4.55 : 1 — clears body AA by only 0.05" and notes "if color-managed displays drop it below threshold, promote hover to peach-500 and reserve peach-700 for active". My calculation gives **5.03 : 1** (more comfortable headroom than the comment claims), but I'll keep the watch flag — the margin is still the smallest in the dark-mode CTA chain. **No action required**, but worth re-checking after any future peach-700 tweak.

### 5.5 · Special-case (register CTA / hackathon green) — unchanged from light mode

| Foreground | Background | Ratio | AA body | AA large | Token role |
|---|---|---|---|---|---|
| `#06110c` | `#3df284` | **13.02** | ✅ | ✅ | `--color-cta-register` text on bg |
| `#0f2b20` | `#80ffca` | **12.31** | ✅ | ✅ | `--color-prize-badge-text` on bg |

Both pass with extreme headroom — the electric green is intentionally high-contrast.

### 5.6 · Code-syntax tokens (used in `<code>` snippets on hero/inline)

| Foreground | Background | Ratio | AA body | AA large | Notes |
|---|---|---|---|---|---|
| `code-orange #DC8149` | `bg-base #1E1E1C` | **5.79** | ✅ | ✅ | also used by form `:invalid` border |
| `code-green #3F9C38` | `bg-base #1E1E1C` | **4.79** | ✅ | ✅ | tightest body pass — 6 % over 4.5 |
| `code-yellow #E7B772` | `bg-base #1E1E1C` | **9.08** | ✅ | ✅ | |
| `code-cyan #88A9E5` | `bg-base #1E1E1C` | **7.04** | ✅ | ✅ | |

### 5.7 · Alpha-blended cream text (effective on `bg-base`)

The dark-mode subtle alpha overlays used for de-emphasized text. Effective foreground after blending against `#1E1E1C`:

| Token | α | Effective sRGB | Ratio vs bg-base | AA body | AA large |
|---|---|---|---|---|---|
| `--cream-text-strong` | 0.85 | `#CCC9C0` | **10.08** | ✅ | ✅ |
| `--cream-text` | 0.80 | `#C2BFB6` | **9.08** | ✅ | ✅ |
| `--cream-text-soft` | 0.70 | `#AEABA3` | **7.28** | ✅ | ✅ |
| `--cream-text-muted` | 0.60 | `#999790` | **5.71** | ✅ | ✅ |
| `--cream-text-faint` | 0.40 | `#706E69` | **3.28** | ❌ | ✅ |

`cream-text-faint` (0.40 alpha) is the only alpha-cream token that fails body AA. **Watch item §5.7a** — this token is reserved for very-low-priority decorative microcopy; should not be used for regular body or even small caption text. A grep of `var(--cream-text-faint)` shows it is consumed by **only** the partner-list watermark and a footer microcopy line, both of which are non-essential / decorative. ✅ acceptable.

### 5.8 · Non-text contrast (WCAG 2.1 SC 1.4.11 — borders, hairlines)

| Foreground | Background | Ratio | 3 : 1 ? | Token role | Verdict |
|---|---|---|---|---|---|
| `gray-700 #5C5B57` (border) | `bg-base #1E1E1C` (page) | **2.46** | ❌ | `--color-border` decorative hairline on cards/sections | hairline-on-page is decorative; SC 1.4.11 requires 3:1 only when the element conveys state or is essential for understanding. Card outlines are **redundant** with bg-elevated lift — the card is already perceivable from the surface change. **Acceptable**, but flagged as the only sub-3:1 hairline. |
| `gray-700 #5C5B57` (border) | `bg-elevated #262624` (input fill) | **2.23** | ❌ | form-input default border | **Watch item §5.8a** — `<input>` borders without focus typically need 3:1 for SC 1.4.11. Inputs already pop because their fill (`bg-elevated #262624`) contrasts with the page (`bg-base #1E1E1C`) — but the input outline itself is sub-3:1. axe did not flag this. **Recommendation:** consider promoting form-input default border to `--color-border-on-dark` (cream alpha 0.50, ratio 4.40:1, see below) **or** to `--peach-border-soft` for a brand-aligned, AA-clearing edge. |
| `peach-500 #D49E86` (focus/hover) | `bg-elevated #262624` | **6.52** | ✅ | form-input focus-visible & hover border | passes |
| `peach-500 #D49E86` (focus ring) | `bg-base #1E1E1C` | **7.18** | ✅ | `--color-focus-ring` against page | passes |
| `cream-border` α 0.50 → `#85837D` | `bg-base #1E1E1C` | **4.40** | ✅ | `--color-border-on-dark` (form / overlay edges) | passes |
| `peach-border-soft` α 0.25 → `#4C3E37` | `bg-base #1E1E1C` | **1.63** | ❌ | decorative tint border (cards) | acceptable as decorative only — never used to convey state |
| `peach-border` α 0.30 → `#55443C` | `bg-base #1E1E1C` | **1.81** | ❌ | decorative tint border (cards) | acceptable as decorative only |

### 5.9 · Token claim deltas

The tokens.css comments cite contrast ratios next to several semantic tokens. My calculations match them within ±0.15 (rounding / luminance-formula variance):

| Token | tokens.css claim | Measured | Δ |
|---|---|---|---|
| `--color-text-primary` (cream-500 / bg-base) | 13.52 : 1 | 13.52 | 0 |
| `--color-text-secondary` (gray-300 / bg-base) | 8.26 : 1 | 8.26 | 0 |
| `--color-text-muted` (gray-500 / bg-base) | 5.59 : 1 | 5.59 | 0 |
| `--color-accent` (peach-500 / bg-base) | 7.18 : 1 | 7.18 | 0 |
| `--color-accent-secondary` (sky-300 / bg-base) | 6.33 : 1 | **6.47** | +0.14 |
| `sky-500` decorative (sky-500 / bg-base) | 4.07 : 1 | 4.07 | 0 |
| `indigo-500` decorative (indigo-500 / bg-base) | 2.21 : 1 | 2.21 | 0 |
| CTA inverted (bg-base / peach-500) | 6.36 : 1 | **7.18** | +0.82 |
| CTA hover (bg-base / peach-700) | 4.55 : 1 | **5.03** | +0.48 |

The CTA pair deltas suggest the original token-file numbers may have been computed against a slightly different `bg-base` shade earlier in the design pass; the live values are **better** than documented, not worse. **Recommendation:** update the token-file comments at lines 153, 174, 178, 184 to reflect the live ratios, so future audits don't trip on the mismatch.

---

## 6 · Incomplete checks (axe `incomplete`, 60 items total)

axe could not auto-decide on these — they require human review. They are **not** counted as violations.

- `color-contrast-enhanced` (AAA target — **out of scope** for AA conformance verdict). Spot-checked: `--color-text-muted` (5.59 : 1) and `--color-accent-secondary` (6.47 : 1) both fail AAA's 7 : 1 body threshold; this is intentional — site targets AA only.
- `aria-allowed-attr` on the carousel `<li role="group">` — manually reviewed, no issue beyond §3.2.
- `landmark-unique` on multiple `<header>` elements (sectioning headers inside cards, valid HTML5 — no fix needed).
- `scrollable-region-focusable` on the AISC PDF iframe — verified that the `<iframe>` itself is keyboard-focusable.

---

## 7 · Prioritized fix list (handoff to Editor-darkmode-subtle / Task #7)

| # | Severity | Component / file | Change | Resolves |
|---|---|---|---|---|
| 1 | serious | `src/components/Carousel.astro` | Switch `<ul>` → `<div>`, `<li>` → `<div>`; keep `role="group"` | §3.2 (also resolves the minor `aria-allowed-role`) — **2 nodes, 1 route** |
| 2 | serious | `src/pages/projects/ai-safety-connect.astro` (~line 240) | `<div class="aisc-pdf-viewer" aria-label="…">` → `<section class="aisc-pdf-viewer" aria-label="…">` | §3.1 — **2 nodes, 1 route** |
| 3 | minor | `src/components/Header.astro` | Logo `<img alt="AI Safety Mexico">` → `<img alt="">` (visible `<span>` already provides accessible name) | §3.3 — **48 nodes, 12 routes** |
| 4 | watch | `src/components/ContactForm.astro` line 343 | Promote default input border from `--color-border` (2.23 : 1 on bg-elevated) to `--color-border-on-dark` (4.40 : 1) — keeps cream-edge brand consistency | §5.8a — non-text contrast hardening |
| 5 | doc-only | `src/styles/tokens.css` lines 153, 174, 178, 184 | Update inline contrast comments to match live ratios (sky-300 6.47, CTA 7.18, CTA hover 5.03) | §5.9 — keeps audit trail honest |

After applying #1, #2, #3 the site reaches **0 axe violations** across all 12 routes. After #4 the site clears WCAG 2.1 SC 1.4.11 on form inputs as well. #5 is documentation hygiene only.

---

## 8 · Conformance verdict

| Standard | Verdict | Notes |
|---|---|---|
| **WCAG 2.1 Level A** | ✅ **PASS** on all 12 routes | No Level A violations from axe; manual checks all green. |
| **WCAG 2.1 Level AA — 1.4.3 Contrast (Minimum)** | ✅ **PASS** on all 12 routes | Zero contrast violations from axe. Manual contrast calculator (§5.1–§5.6) confirms every semantic token pairing clears 4.5 : 1 (body) or 3 : 1 (large text where flagged as such). |
| **WCAG 2.1 Level AA — 1.4.11 Non-text Contrast** | ⚠️ **CONDITIONAL PASS** | Focus rings, hover states, and accent borders all clear 3 : 1 by ≥ 2× headroom. Default form-input border at 2.23 : 1 is the one watch item (§5.8a) — recommend promotion to `--color-border-on-dark` (4.40 : 1). Decorative card hairlines below 3 : 1 are acceptable per SC 1.4.11 exemption (state not conveyed). |
| **WCAG 2.1 Level AA — 2.4.7 Focus Visible & 2.4.13 Focus Appearance** | ✅ **PASS** | Peach-500 focus ring at 7.18 : 1 on bg-base, 6.52 : 1 on bg-elevated. Sampled 96 tab stops across 12 routes — all show outline or box-shadow. |
| **Best practice** | ⚠️ minor — `image-redundant-alt` (logo) and the carousel `<ul>` pattern. Both pre-existing, both single-edit fixes. |

**Bottom line:** the subtle dark-mode palette **does not introduce any new accessibility regression**. It eliminates 316 instances of color-contrast failure that plagued the light-mode build, while preserving every structural / keyboard / landmark check. The remaining 4 serious findings are *all* pre-existing component bugs (carousel, PDF wrapper) that are independent of the palette swap and were already on the fix list from QA-A11Y §3.3 / §3.4.

The site is **ready to ship to AA** under the subtle dark-mode palette **conditional on Task #7 applying fixes #1–#3** above. Fix #4 (form input border) is recommended hardening, not a blocker.

---

## 9 · Reproducibility — files committed by this audit

| Path | Contents |
|---|---|
| `playwright/a11y-dark.spec.mjs` | axe-playwright spec for 12 routes × 2 viewports |
| `playwright/a11y-dark-manual.spec.mjs` | DOM heuristic spec (landmarks, headings, alt, focus, lang, title) |
| `playwright/a11y-dark-results.json` | full axe output (24 runs) |
| `playwright/a11y-dark-manual-results.json` | full heuristic output (12 routes) |
| `docs/QA-DARKMODE-A11Y.md` | this report |

To re-run the entire audit on the current branch:

```bash
npm run build
npx astro preview --port 5082 --host 127.0.0.1 &
sleep 2
A11Y_PORT=5082 node playwright/a11y-dark.spec.mjs
A11Y_PORT=5082 node playwright/a11y-dark-manual.spec.mjs
```
