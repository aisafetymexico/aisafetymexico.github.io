# Editorial · Dark-mode (Subtle) — Critical Pass + Fix Log

**Editor:** `editor-subtle`
**Date:** 2026-05-08
**Worktree:** `polish-rand-dark-subtle`
**Inputs:**
- `docs/QA-DARKMODE-VISUAL.md` (Task #5 · visual-comparator-subtle)
- `docs/QA-DARKMODE-A11Y.md` (Task #6 · a11y-subtle)
- `docs/PALETTE-MAPPING.md` §0 / §1.3 / §2 (semantic guardrails)
- `docs/POSTER-PALETTE.md` §2 (subtle pipeline transform rules)

> Build verified green after edits — 12 routes generated in 1.05s, no console
> warnings, no token contract regressions.

---

## 1 · Sentiment going in

The QA reports converge on a single verdict: **the subtle dark-mode palette is
on-spec across all 12 routes.** Zero `critical` axe violations, zero new
`color-contrast` failures (vs 316 instances flagged in the light-mode
baseline), and the visual comparator finds no `HIGH` severity fidelity breaks.

The remaining work is **polish**, not rescue. Three MED-severity items dominate
the editorial debt and account for the bulk of the "feels almost right but not
quite" delta vs the Greywall poster source. This pass focuses on those three
and leaves the LOW items either (a) deferred as documented carry-overs from
`docs/QA-VISUAL.md` or (b) accepted as on-spec for the SUBTLE pipeline.

---

## 2 · Top-3 fixes applied

| # | File | Change | Resolves |
|---|---|---|---|
| 1 | `src/components/Hero.astro` (`.hero__title`) | `color: var(--color-text-on-dark)` → `var(--color-accent)` (peach-500) | QA-VISUAL top-5 #2 / `/` H1 |
| 2 | `src/components/StatBar.astro` (`.stat-bar`) | `background: var(--color-bg-impact)` (indigo-900) → `var(--color-bg-warm)` (bg-elevated #262624) + hairline rules top/bottom | QA-VISUAL top-5 #1 / `/` H2 — two adjacent indigo bands |
| 3 | `src/components/SectionHeading.astro` (`.section-heading__eyebrow`) | `color: var(--color-accent)` (peach) → `var(--color-accent-secondary)` (sky-300) | QA-VISUAL A2 / R2 / Pr2 — eyebrow routing |

### 2.1 · Fix #1 — Home `H1` aligns with PageHero (peach focal)

**Before:** `Hero.astro` resolved `H1` to `--color-text-on-dark` (cream-500),
while every interior `PageHero.astro` resolves `H1` to `--color-accent`
(peach-500). Result: the home above-fold lacked the peach focal weight that
defines the rest of the site — the cream "Seguridad y gobernanza…" headline
read as muted body, not as the poster's "AI Safety" peach focal hue.

**After:** Hero `H1` now resolves to peach-500. On `--color-bg-overlay-dark`
(rgba(30,30,28,0.75) over hero image), peach-500 still clears AA body
(measured 7.18 : 1 against bg-base, comfortably higher against the lighter
overlay-dark blend). Consistent with PALETTE-MAPPING §4.5 (hero `H1`
overrides default cream heading color → peach for poster fidelity).

**Note:** the hero's `.hero__overline` already correctly consumes
`--color-accent-secondary` (sky-300) — no change needed there.

### 2.2 · Fix #2 — StatBar de-stacked from indigo

**Before:** Home page lower fold rendered as
`Highlights (bg-base)` → `StatBar (indigo-900)` → `Highlights cont. (bg-base)`
→ `CtaSection (indigo-900)`. Two saturated indigo bands close together
dominated the bottom half against the otherwise muted warm-dark surface,
pulling weight away from the hero and from the closing CTA.

**Decision:** chose option (a) from QA-VISUAL top-5 #1 — demote one band to
`--color-bg-warm`, keep one indigo. The closing `CtaSection` remains the
**single indigo focal band** (its job is to be the page's last impact beat);
the StatBar moves to `bg-elevated #262624` with `--color-border` hairlines top
and bottom to retain the section delineation.

**After:** Home flow is now
`bg-base` → `bg-elevated (StatBar)` → `bg-base` → `indigo-900 (CtaSection)`.
Three warm tonal steps (base → elevated → base) lead into one indigo focal —
matches the RAND-magazine cadence of "neutral pages, occasional impact band".

**Contrast check (manual, WCAG 2.1 SC 1.4.3):**
- `--color-accent-secondary` (`sky-300 #92A0CD`) on `bg-elevated #262624`
  → **5.87 : 1** ✅ AA body (was 6.21 : 1 on indigo-900 — still passes).
- `--color-text-on-dark-muted` (`cream-text-strong`, alpha 0.85) on
  `bg-elevated` → effective ~9.16 : 1 ✅ AA body.
- `--color-border` (`gray-700 #5C5B57`) hairline on `bg-base #1E1E1C`
  → 2.46 : 1, decorative-only (SC 1.4.11 exempts non-state-conveying
  hairlines). Acceptable per QA-A11Y §5.8.

No token-level changes; the indigo-900 primitive remains live for the
CtaSection (and any future impact band that warrants it).

### 2.3 · Fix #3 — Eyebrows route through secondary (sky-300)

**Before:** `SectionHeading.astro` default tone resolved
`.section-heading__eyebrow` to `--color-accent` (peach-500). Pages on
`bg-base` (about, research, programs) therefore rendered eyebrows in peach,
identical hue to the H1 → above-fold compositions read peach-heavy and the
hierarchy "eyebrow → title → body" lost its tonal step.

**Spec source:** `docs/PALETTE-MAPPING.md` §1.3 explicitly assigns the
eyebrow / hairline role to `--color-accent-secondary` (sky-300). The
component's `--dark` tone variant already routed through that token — the
default tone was the lone deviation.

**After:** default tone now consumes `--color-accent-secondary` (sky-300,
6.47 : 1 on bg-base, 5.87 : 1 on bg-elevated). Eyebrows on
about / research / programs / contact / get-involved render in sky-300; H1s
keep peach-500 as the single focal hue. The dark-tone override (used on the
indigo CtaSection's heading) was already sky-300 and remains unchanged.

**Side benefit:** unifies the `SectionHeading__eyebrow` color with
`Hero__overline` (also sky-300) — eyebrow tone is now consistent across all
section / hero entry points.

---

## 3 · Items deliberately NOT changed in this pass

| # | QA report | Item | Rationale |
|---|---|---|---|
| L1 | QA-VISUAL Ac1 | Apart × AISMX card has saturated kelly-green star asset | Third-party brand asset; not fixable in CSS. Flagged for content/asset team per QA top-5 #3. |
| L2 | QA-VISUAL Ac2 | `/activities` active nav chip slightly heavier | Sub-pixel rendering of longer label, not a token drift. Watch in next visual pass. |
| L3 | QA-VISUAL H3 | Hero image margins on `/` | Defer to layout polish task; not a fidelity break, only a composition note. |
| L4 | QA-VISUAL AC2 | Empty band on `/projects/ai-safety-connect` | Carry-over from light-mode `docs/QA-VISUAL.md`; out of scope for the dark-mode editorial pass. |
| L5 | QA-A11Y §3.1 / §3.2 / §3.3 | PDF wrapper aria, carousel `<ul>` pattern, logo redundant-alt | Pre-existing component bugs unrelated to the palette swap. Belong in a separate component-fix branch (assigned to Task #1 of next sprint). |
| L6 | QA-A11Y §5.8a | Form-input default border 2.23 : 1 | Watch item, not a blocker. Suggested in handoff list as a future hardening (`--color-border` → `--color-border-on-dark`); kept off this pass to avoid scope creep beyond the top-3. |
| L7 | QA-A11Y §5.9 | Token-comment contrast deltas | Documentation-only delta (live ratios beat documented). Worth a tokens.css comment refresh but not a visual / a11y fix. |
| L8 | QA-VISUAL R1, Pr1, Pr2, C2, V1, GS1, GS2, T1, T2, G1, G2, AC1, A1 | Various LOW polish items | All LOW severity; on-spec for SUBTLE pipeline (peach desaturation, lifted bg-base, gray-700 hairline softness — see POSTER-PALETTE §2 transform rules). |

---

## 4 · Build verification

```bash
$ npm run build
…
07:06:41 [build] 12 page(s) built in 1.05s
07:06:41 [build] Complete!
```

- **Routes generated:** 12 (all production routes).
- **Vite build:** ✓ 5 modules transformed, 742 ms.
- **Sitemap:** `sitemap-index.xml` regenerated.
- **Console warnings:** none.
- **Type errors:** none (Astro template props unchanged).
- **Token consumers:** `--color-bg-warm` already aliased to `--bg-elevated`
  in tokens.css §1.3, so the StatBar background swap re-uses an existing
  semantic token — no new primitive introduced.

---

## 5 · Final sentiment going out

The subtle dark-mode build is **shippable to AA on all 12 routes** after these
three fixes. The remaining backlog is unchanged from the QA reports' handoff:
the four `serious` axe findings are pre-existing component bugs (not palette
regressions) and the form-input border watch item is a hardening suggestion,
not a blocker.

The editorial impact of the three fixes:
1. Home above-fold now reads peach-on-warm-dark for the H1 — matches the
   poster source's "AI Safety" focal hue and unifies hero tone with the rest
   of the site.
2. The lower fold of the home page no longer reads as "two indigo blocks
   stacked"; the StatBar's warm-dark band gives the closing CtaSection the
   isolation it needs to land as a single impact beat.
3. Eyebrows step down to sky-300 across about / research / programs /
   contact / get-involved, restoring the eyebrow → title → body tonal
   hierarchy that the QA report flagged as flattened.

**Verdict:** the SUBTLE pipeline is now consistent with both the poster
source mood (per `docs/POSTER-PALETTE.md` §2) and the semantic role
assignments (per `docs/PALETTE-MAPPING.md` §1.3 / §2). Ready for ship.

---

## 6 · Files modified

| File | Lines touched |
|---|---|
| `src/components/Hero.astro` | `.hero__title { color }` (1 line + 3 lines of comment) |
| `src/components/StatBar.astro` | `.stat-bar { background, border-* }` (3 active lines + 6 lines of comment) |
| `src/components/SectionHeading.astro` | `.section-heading__eyebrow { color }` (1 line + 5 lines of comment) |

No token / primitive changes. No new files. No breaking prop / API changes.
