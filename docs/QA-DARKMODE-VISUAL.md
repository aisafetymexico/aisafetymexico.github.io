# QA · Dark-Mode (Subtle) — Visual Comparator

> Captured by `playwright/dark-subtle-shoot.mjs` against `astro preview` on `127.0.0.1:5081`.
> 12 routes × 1440 viewport (above-fold + full-page) → `playwright/dark-subtle/<slug>-1440.png` and `<slug>-1440-full.png`.
> Reference for fidelity: `docs/POSTER-PALETTE.md` §2 (Subtle palette) + the original Greywall poster (`Screenshot 2026-05-08 at 5.57.56 a.m..png`) as it informs `docs/PALETTE-MAPPING.md` §2.
> Each capture was reviewed with vision against the SUBTLE pipeline targets (desaturated peach, lifted warm-black surface, cream-rotated text). This file lists fidelity issues by severity with concrete fixes; light-mode pre-existing layout bugs already documented in `docs/QA-VISUAL.md` are referenced but not duplicated here.

## Methodology

- **Build**: `dist/` produced from current `src/` (token-swapper + base-shell + components + pages tasks all merged at HEAD).
- **Server**: `astro preview --port 5081 --host 127.0.0.1` against `dist/`.
- **Browser**: Chromium headless (Playwright 1.59), `viewport: 1440×900`, `deviceScaleFactor: 1`, `waitUntil: 'networkidle'` + 500ms settle.
- **Routes audited (12)**: `/`, `/about`, `/research`, `/programs`, `/projects`, `/projects/vigia`, `/projects/ai-safety-connect`, `/team`, `/activities`, `/get-involved`, `/contact`, `/global-south-challenge`.
- **Vision pass**: above-fold screenshots compared with the SUBTLE palette spec (warm-black `#1E1E1C` surface, cream-500 `#EBE7DD` text, peach-500 `#D49E86` inline accent, sky-300 `#92A0CD` secondary, indigo-900 `#1F274D` reserved for impact band).

## Severity legend

- **HIGH** — fidelity break that visibly contradicts the SUBTLE poster mood (loud color leak, untranslated light-mode tokens, broken contrast).
- **MED** — noticeable inconsistency vs the spec but not jarring (component using wrong semantic token, surface drift, accent imbalance).
- **LOW** — refinement / nice-to-have.

## Headline verdict

The dark-mode subtle palette is **applied consistently across all 12 routes**. Page surface is warm near-black (`#1E1E1C`), body text reads as cream-500, page H1s land on peach-500, breadcrumb anchors and inline links route through peach as required by the AA guardrail (`docs/PALETTE-MAPPING.md` §0). The result reads as the intended "academic / RAND-style with warm undertone" — desaturated relative to the faithful poster, but unmistakably descended from the same palette family. **No HIGH-severity color or contrast breakages were observed at 1440 above-fold.**

The strongest deviations from the poster are deliberate (subtle peach `#D49E86` instead of poster `#E7916E`; lifted bg `#1E1E1C` instead of `#161614`) and match `docs/POSTER-PALETTE.md` §2 transformation rules. Remaining issues are MED / LOW polish.

---

## Top 5 issues to fix first

1. **MED · Two saturated indigo bands stack on `/` (impact + CTA)** — the `indigo-900 #1F274D` "stats" band and the `¿Buscas colaborar?` CTA section both fill full-width with the same indigo. Against the otherwise muted subtle warm-dark, two adjacent indigo blocks dominate the lower half of the home full-page screenshot and pull weight away from the hero. Either (a) drop one band to `--bg-elevated` (warm) and keep only one indigo, (b) reduce indigo-900 saturation by ~10% in the subtle pipeline, or (c) add a non-indigo break section between them.
2. **MED · Home H1 reads cream while every other PageHero H1 reads peach-500** — `Hero.astro` resolves H1 to `--color-text-on-dark` (cream-500), but `PageHero.astro` overrides H1 to `--color-accent` (peach-500). On the home above-fold the cream "Seguridad y gobernanza…" headline lacks the peach focal weight that defines the rest of the site. Either align Hero H1 to peach (consistent with poster's "AI Safety" peach headline), or accept this as a deliberate hero-vs-pagehero distinction and note it in the design system. Recommended: align to peach for poster fidelity.
3. **MED · `/activities` "Apart × AI Safety México" card image inserts a saturated kelly-green star (`★ Apart`)** — the card art is a third-party brand asset on a black sub-canvas, but the green pixel hits against the subtle warm palette read as a tonal outlier (it's the only saturated green anywhere in the palette). Not fixable in CSS — flag for content/asset team to consider re-cropping or using a desaturated variant when used inside the subtle dark surface.
4. **LOW · Active-nav chip on `/activities` reads slightly heavier than other pages** — the peach-tint chip behind "Actividades" appears a notch darker than the same chip on `/about`, `/research`, etc. (likely sub-pixel rendering against the longer label, not a real token drift). If reproducible, lock chip background to a fixed peach-soft alpha, not a relative tint.
5. **LOW · Hero image on `/` underfills the 1440 fold** — the Chichén Itzá observatory image renders at ~750×420 centered with significant warm-dark margin on both sides; in the subtle palette this empty surface reads as "padded with nothing" more than it did in light mode where the cream margin felt continuous. Either let the image span container width (closer to RAND magazine feel) or add a faint sky-300 hairline rule under it to anchor the composition.

---

## Issues by page

### `/` — Home

| # | Severity | Issue | Recommendation |
|---|---|---|---|
| H1 | MED | H1 ("Seguridad y gobernanza…") is cream, not peach — inconsistent with the peach H1 used on every other page hero. | In `Hero.astro`, override `.hero__title { color: var(--color-accent); }` to match `PageHero` (line 98 in `src/components/PageHero.astro`). |
| H2 | MED | Two indigo-900 bands stack vertically on the full-page (impact stats + "¿Buscas colaborar?" CTA section). | Demote one section to `--color-bg-warm` (`bg-elevated #262624`) so a warm-dark sits between two indigo accents, or thin the indigo to a left-rule eyebrow instead of a fill band. |
| H3 | LOW | Hero image is centered with wide warm-dark margins; reads as floating rather than anchored. | Either widen the image container to 100% of the content shell, or under-rule with `border-bottom: 1px solid var(--color-accent-secondary)` (sky-300 at the spec contrast). |
| H4 | LOW | Pillar card numerals (01–04) at peach-500 against bordered card surface read with a slightly lower contrast than the subtle palette suggests at this size. | Verify ratio: peach-500 on bg-elevated = ~5.6:1 (passes AA body). Acceptable; no change required, but watch in a11y task. |

### `/about`

| # | Severity | Issue | Recommendation |
|---|---|---|---|
| A1 | LOW | Breadcrumb peach link ("Inicio") is small (~14px) but reads cleanly against bg-base. | No change. |
| A2 | LOW | Section eyebrow "MISIÓN" uses peach (sampled `#D49E86`). It should use `--color-accent-secondary` (`sky-300 #92A0CD`) for hierarchy per `docs/PALETTE-MAPPING.md` §1.3 (eyebrows = secondary accent). | Verify component is consuming `--color-accent-secondary`, not `--color-accent`. If component is correct and design intent has eyebrows in peach, update PALETTE-MAPPING §1.3 to reflect actual usage. |

### `/research`

| # | Severity | Issue | Recommendation |
|---|---|---|---|
| R1 | LOW | Numbered cards (01–04) all use peach numerals; combined with peach H1 the above-fold reads peach-heavy. | Acceptable (peach is the singular brand accent in the subtle palette). If softening is desired, demote card numerals to `--gray-300`. |
| R2 | LOW | Section eyebrow "LÍNEAS DE TRABAJO" same observation as `/about` A2. | Same — confirm eyebrow consumes secondary accent. |

### `/programs`

| # | Severity | Issue | Recommendation |
|---|---|---|---|
| Pr1 | LOW | Eyebrow "COMUNIDAD" — same as A2/R2. | Same. |
| Pr2 | LOW | Bordered cards have a hairline at `--color-border` (`gray-700 #5C5B57`), readable but sits very close in luminance to bg-elevated. | Acceptable for "subtle". If borders feel too quiet, lift to `--gray-500` or use the peach-soft border (`rgba(212,158,134,0.25)`) for emphasis cards. |

### `/projects`

| # | Severity | Issue | Recommendation |
|---|---|---|---|
| Pj1 | LOW | Long-form body block under "Investigación aplicada con vocación pública" reads as a wall of cream text — no inline accent, no rule, no pull-quote. | Optional: wrap one sentence in `<em>` or apply the blockquote pattern from `docs/QA-VISUAL.md` A2. |

### `/projects/vigia`

| # | Severity | Issue | Recommendation |
|---|---|---|---|
| V1 | LOW | Pill chips ("Special Recognition · AI Safety Collab 2025", "Gobernanza · Soberanía digital", etc.) sit on bg-base with a thin gray border. Reads consistent with the subtle mood. | No change. |

### `/projects/ai-safety-connect`

| # | Severity | Issue | Recommendation |
|---|---|---|---|
| AC1 | LOW | Pull-quote callout ("AI Safety Connect es una plataforma…") uses peach left-rule + peach inline emphasis. Effective. | No change. |
| AC2 | LOW | Long empty band between "Reporte final" CTA and "Co-investigadores" (carryover from `docs/QA-VISUAL.md` Top-5 #5) — still present in dark mode. Not a fidelity issue but the warm-dark surface makes the gap more visible than in light. | Defer to layout task; flagged here for awareness. |

### `/team`

| # | Severity | Issue | Recommendation |
|---|---|---|---|
| T1 | LOW | H1 "Las personas detrás de AI Safety Mexico" wraps to two lines with some optical imbalance ("AI Safety Mexico" sits alone on line 2). | Optional: tighten container max-width or `text-wrap: balance`. Cosmetic. |
| T2 | LOW | Member cards have circular avatar masks against `--bg-elevated`; partial avatar disc visible above-fold. Reads as designed. | No change. |

### `/activities`

| # | Severity | Issue | Recommendation |
|---|---|---|---|
| Ac1 | MED | Apart logo card features a saturated kelly-green star asset; only such green in the palette family. | See top-5 #3. Content/asset decision. |
| Ac2 | LOW | Active nav chip "Actividades" reads slightly heavier than other pages' active chips — likely sub-pixel rendering, not a token drift. | If reproducible, lock chip background alpha. |

### `/get-involved`

| # | Severity | Issue | Recommendation |
|---|---|---|---|
| G1 | LOW | "Colabora con nosotros" H1 in peach is the largest peach surface above-fold across all routes. Reads strong but on-spec. | No change. |
| G2 | LOW | Body copy at gray-300 on bg-base — clears AA. | No change. |

### `/contact`

| # | Severity | Issue | Recommendation |
|---|---|---|---|
| C1 | LOW | Channel cards (Email, LinkedIn) use peach eyebrows and cream values — consistent. | No change. |
| C2 | LOW | Card border (gray-700) very subtle, almost invisible at 1440. | If perceived contrast is too soft, lift to `--gray-500`. |

### `/global-south-challenge`

| # | Severity | Issue | Recommendation |
|---|---|---|---|
| GS1 | LOW | H1 "The Global South AI Safety Challenge" wraps to two lines with peach saturation (largest peach H1 by line count). | No change — on-spec. |
| GS2 | LOW | Body copy block "Hackathon internacional…" runs ~3 lines without inline accent. | Optional: bold "Apart Research" + "AI Safety Mexico" mentions for visual rhythm. |

---

## Fidelity vs poster source — summary table

| Aspect                   | Poster source                   | Subtle target (spec)              | Captured (this audit)         | Verdict |
|--------------------------|----------------------------------|-----------------------------------|-------------------------------|---------|
| Page surface             | `#161614` (warm near-black)      | `#1E1E1C` (lifted +8L)            | `#1E1E1C` ✅                  | OK — intentional lift. |
| Body text                | Cream `#E9E8E6`                  | Cream-500 `#EBE7DD`               | Cream ✅                      | OK. |
| Headline accent          | Peach `#E7916E` (saturated)      | Peach-500 `#D49E86` (-28% sat)    | Peach ≈`#D49E86` ✅           | OK — desaturated as specified. |
| Display indigo           | `#3249A4` (MÉXICO wordmark)      | Indigo-900 `#1F274D` (impact band)| Indigo on home stats + CTA ✅ | OK; see top-5 #1 (band stacking). |
| Secondary accent         | Sky `#5770CE` (URLs)             | Sky-300 `#92A0CD` (eyebrows)      | Eyebrows render peach ⚠       | See A2/R2/Pr2 — confirm intended token. |
| Cream surface (rare)     | Cream-50 `#F8F5EC`               | Cream-50 `#F7F3E8` (cards rare)   | Not present at fold           | n/a above-fold. |
| CTA fill                 | Peach fill + dark text           | Peach-500 fill + bg-base text     | Hero "Conoce nuestros…" CTA ✅ | OK. |
| Card surface             | Elevated +5L vs base             | Bg-elevated `#262624`             | Bordered cards ✅             | OK. |
| Border hairline          | Subtle gray                      | Gray-700 `#5C5B57`                | Bordered ✅                   | OK; see Pr2/C2 — borderline subtle. |

---

## Files captured

- `playwright/dark-subtle/home-1440.png` (above-fold) + `home-1440-full.png` (full-page)
- `playwright/dark-subtle/about-1440{,-full}.png`
- `playwright/dark-subtle/research-1440{,-full}.png`
- `playwright/dark-subtle/programs-1440{,-full}.png`
- `playwright/dark-subtle/projects-1440{,-full}.png`
- `playwright/dark-subtle/projects-vigia-1440{,-full}.png`
- `playwright/dark-subtle/projects-ai-safety-connect-1440{,-full}.png`
- `playwright/dark-subtle/team-1440{,-full}.png`
- `playwright/dark-subtle/activities-1440{,-full}.png`
- `playwright/dark-subtle/get-involved-1440{,-full}.png`
- `playwright/dark-subtle/contact-1440{,-full}.png`
- `playwright/dark-subtle/global-south-challenge-1440{,-full}.png`

Total: 24 PNGs (12 above-fold + 12 full-page) at 1440×{900, varies}.

---

## Handoff to Editor (Task #7)

The editor critical pass should weigh the MED-severity items in this report alongside the a11y-darkmode-subtle (Task #6) findings. Concrete deltas that warrant CSS edits in the editor pass:

1. `Hero.astro` H1 → peach (top-5 #2 / `/` H1).
2. Decide one of: (a) demote home impact-band or CTA section to `--color-bg-warm`, or (b) reduce `--indigo-900` saturation in the subtle palette by ~10% (top-5 #1 / `/` H2).
3. Confirm eyebrow-style components consume `--color-accent-secondary` (sky-300), not `--color-accent` (peach) — A2/R2/Pr2.
4. Carry over light-mode pre-existing items from `docs/QA-VISUAL.md` (image placeholders, AC2 empty band) if not already resolved.

Items NOT requiring edit: subtle peach desaturation, lifted bg-base, gray-700 border softness — these are on-spec for the SUBTLE pipeline (`docs/POSTER-PALETTE.md` §2).
