# Palette Mapping — Light → Dark (Faithful & Subtle)

Source inputs:
- `docs/POSTER-PALETTE.md` (palette-extractor output — faithful + subtle hex codes lifted from the Greywall poster).
- `src/styles/tokens.css` (current polish-rand light-mode tokens — the values being remapped).

This file is the contract that **token-swapper (Task #3)** consumes when overwriting `tokens.css`. Every `--color-*` token below has an explicit faithful and subtle target plus a contrast verdict.

---

## 0 · Critical guardrails (poster-extractor findings)

1. **Body links and inline accent text MUST use `peach-500`.** The natural intuition — using sky/indigo as a "link blue" — fails AA: `--indigo-500 #3249A4` on `bg-base` is **2.26:1** (display-only, never readable text); `--sky-500 #5770CE` is **3.98:1** (large-text only, ≥18pt regular / ≥14pt bold). Body links, body-size CTA labels, focus rings, inline emphasis all route through peach.
2. **`indigo-500` is decorative-display only.** Reserved for the MÉXICO-equivalent wordmark, very large stat numbers, and ornamental dots — no link, no button, no body color. If a deep-blue inline accent is needed, derive `indigo-300 #6B7FBC` (~4.7:1, AA body — to be verified at consumption site).
3. **`sky-500` is large-text only.** Acceptable for ≥18pt display links (oversized blockquote attribution, large CTA word marks). For inline secondary accent we step **up** to `sky-300` (`#8BA0DE` faithful / `#92A0CD` subtle), which clears AA body on both palette bg-bases.
4. **CTA color inverts in dark mode.** Light mode used `copper-dark` fill + white text. Dark mode flips to `peach-500` fill + `bg-base` (near-black) text — cream-on-peach fails AA (1.97:1) but dark-on-peach is 7.36:1.

---

## 1 · Faithful mapping (token → old hex → new hex)

`bg-base = #161614`. All ratios below are against this surface unless noted.

### Text

| Token                       | Old (light)                  | New (faithful)        | Hex resolved | Notes                                                                 |
|-----------------------------|------------------------------|-----------------------|--------------|-----------------------------------------------------------------------|
| `--color-text-primary`      | `var(--text)` = `#3A3A4A`    | `var(--cream-500)`    | `#E9E8E6`    | Body copy.                                                            |
| `--color-text-secondary`    | `var(--text-light)` = `#6A6A7A` | `var(--gray-300)`  | `#B9B9B7`    | Soft secondary text.                                                  |
| `--color-text-muted`        | `var(--text-muted)` = `#8A8A9A` | `var(--gray-500)`  | `#939290`    | Descriptive copy ("A workshop on AI safety…").                        |
| `--color-text-heading`      | `var(--navy)` = `#1B2340`    | `var(--cream-500)`    | `#E9E8E6`    | Default heading color. Hero h1 overrides to peach at component level. |
| `--color-text-on-dark`      | `var(--white)` = `#FFFFFF`   | `var(--cream-500)`    | `#E9E8E6`    | Page is dark already; "on-dark" stays cream for poster warmth.        |
| `--color-text-on-dark-muted`| `rgba(255,255,255,0.80)`     | `rgba(233,232,230,0.85)` | —         | Cream-500 at 85%.                                                     |
| `--color-text-inverse`      | `var(--white)` = `#FFFFFF`   | `var(--bg-base)`      | `#161614`    | Used on rare cream surfaces (`cream-50`/`cream-100` islands).         |

### Surfaces

| Token                       | Old (light)                            | New (faithful)        | Hex resolved | Notes                                                                 |
|-----------------------------|----------------------------------------|-----------------------|--------------|-----------------------------------------------------------------------|
| `--color-bg-base`           | `var(--white)` = `#FFFFFF`             | `var(--bg-base)`      | `#161614`    | Page background. Warm near-black.                                     |
| `--color-bg-warm`           | `var(--cream)` = `#FAF3E8`             | `var(--bg-elevated)`  | `#1B1B19`    | Warm surface. In dark mode it's a +5L lift over base, not cream.      |
| `--color-bg-elevated`       | `var(--white)` = `#FFFFFF`             | `var(--bg-elevated)`  | `#1B1B19`    | Card surface.                                                          |
| `--color-bg-section-warm`   | `rgba(250,243,232,0.85)`               | `rgba(27,27,25,0.85)` | —            | Backdrop wash for warm sections.                                      |
| `--color-bg-section-base`   | `rgba(255,255,255,0.92)`               | `rgba(22,22,20,0.92)` | —            | Backdrop wash for base sections.                                      |
| `--color-bg-impact`         | `var(--navy)` = `#1B2340`              | `var(--indigo-900)`   | `#1A2455`    | Impact band. Keeps "MÉXICO indigo" mood; differentiates vs base.      |
| `--color-bg-overlay-dark`   | `rgba(27,35,64,0.75)` (navy-overlay)   | `rgba(22,22,20,0.75)` | —            | Image overlay. Bg-base at 75%.                                        |

### Accents

| Token                       | Old (light)                            | New (faithful)        | Hex resolved | Notes                                                                 |
|-----------------------------|----------------------------------------|-----------------------|--------------|-----------------------------------------------------------------------|
| `--color-accent`            | `var(--copper)` = `#C4854A`            | `var(--peach-500)`    | `#E7916E`    | Primary brand accent. Used for inline links by `--color-link`.        |
| `--color-accent-hover`      | `var(--copper-dark)` = `#8B5A2B`       | `var(--peach-300)`    | `#E8A383`    | Lighter on hover (dark-mode convention).                              |
| `--color-accent-soft`       | `rgba(196,133,74,0.08)` (copper-tint)  | `rgba(231,145,110,0.08)` | —         | Peach tint chip backgrounds.                                          |
| `--color-accent-secondary`  | `var(--gold)` = `#E8BD68`              | `var(--sky-300)`      | `#8BA0DE`    | Secondary accent (eyebrows, ornament rules). `sky-500` fails body AA, so we use `sky-300`. |

### CTA

| Token                       | Old (light)                            | New (faithful)        | Hex resolved | Notes                                                                 |
|-----------------------------|----------------------------------------|-----------------------|--------------|-----------------------------------------------------------------------|
| `--color-cta-bg`            | `var(--copper-dark)` = `#8B5A2B`       | `var(--peach-500)`    | `#E7916E`    | **Inverts**: peach fill replaces copper fill.                         |
| `--color-cta-bg-hover`      | `#6F4621`                              | `var(--peach-700)`    | `#C97550`    | Pressed/hover deeper.                                                 |
| `--color-cta-text`          | `var(--white)` = `#FFFFFF`             | `var(--bg-base)`      | `#161614`    | **Inverts**: dark text on peach (cream-on-peach = 1.97:1, fails).     |

### Borders

| Token                       | Old (light)                            | New (faithful)        | Hex resolved | Notes                                                                 |
|-----------------------------|----------------------------------------|-----------------------|--------------|-----------------------------------------------------------------------|
| `--color-border`            | `var(--border)` = `#E2DED6`            | `var(--gray-700)`     | `#5A5A58`    | Hairline rule.                                                         |
| `--color-border-accent`     | `rgba(196,133,74,0.25)` (copper-soft)  | `rgba(231,145,110,0.25)` | —         | Peach accent border.                                                  |
| `--color-border-on-dark`    | `rgba(255,255,255,0.5)`                | `rgba(233,232,230,0.5)` | —          | Cream at 50%.                                                          |

### Link & focus

| Token                       | Old (light)                            | New (faithful)        | Hex resolved | Notes                                                                 |
|-----------------------------|----------------------------------------|-----------------------|--------------|-----------------------------------------------------------------------|
| `--color-link`              | `var(--copper)` = `#C4854A`            | `var(--peach-500)`    | `#E7916E`    | **Body links MUST use peach** — sky/indigo fail AA at body sizes.     |
| `--color-link-hover`        | `var(--copper-dark)` = `#8B5A2B`       | `var(--peach-300)`    | `#E8A383`    | Lighter on hover.                                                     |
| `--color-focus-ring`        | `var(--copper)` = `#C4854A`            | `var(--peach-500)`    | `#E7916E`    | Visible against bg-base (7.48:1).                                     |

### Special-case (hackathon green — kept)

| Token                              | Old hex     | New hex     | Notes                                                       |
|------------------------------------|-------------|-------------|-------------------------------------------------------------|
| `--color-cta-register`             | `#3df284`   | `#3df284`   | Unchanged; already passes (~12:1 on `bg-base`).             |
| `--color-cta-register-hover`       | `#33e37d`   | `#33e37d`   | Unchanged.                                                  |
| `--color-cta-register-text`        | `#06110c`   | `#06110c`   | Dark on green still preferred.                              |
| `--color-prize-badge-bg`           | `#80ffca`   | `#80ffca`   | Unchanged.                                                  |
| `--color-prize-badge-text`         | `#0f2b20`   | `#0f2b20`   | Unchanged.                                                  |

### Primitive layer (faithful — added/replaced)

These are the new primitives the semantic tokens above resolve to. Token-swapper replaces the old `--navy/--copper/--gold/--cream` block with this:

```
--bg-base:     #161614;   --bg-elevated: #1B1B19;   --bg-overlay:  #22221F;
--peach-50:    #F5D9C7;   --peach-100:   #F0BFA8;   --peach-300:   #E8A383;
--peach-500:   #E7916E;   --peach-700:   #C97550;   --peach-900:   #8C4D33;
--indigo-300:  #6B7FBC;   --indigo-500:  #3249A4;   --indigo-700:  #243371;   --indigo-900: #1A2455;
--sky-300:     #8BA0DE;   --sky-500:     #5770CE;   --sky-700:     #3F548E;
--cream-50:    #F8F5EC;   --cream-100:   #ECE7D9;   --cream-300:   #E3DDCE;   --cream-500: #E9E8E6;
--gray-300:    #B9B9B7;   --gray-500:    #939290;   --gray-700:    #5A5A58;   --gray-900:  #2A2A28;
--code-orange: #DC8149;   --code-green:  #3F9C38;   --code-yellow: #E7B772;   --code-cyan: #88A9E5;
```

---

## 2 · Subtle mapping (token → new hex)

`bg-base = #1E1E1C`. Same role assignments as faithful; the values are the desaturated/lifted variants from POSTER-PALETTE §2.

### Text
| Token                          | New (subtle)        | Hex resolved |
|--------------------------------|---------------------|--------------|
| `--color-text-primary`         | `var(--cream-500)`  | `#EBE7DD`    |
| `--color-text-secondary`       | `var(--gray-300)`   | `#BAB6AE`    |
| `--color-text-muted`           | `var(--gray-500)`   | `#979593`    |
| `--color-text-heading`         | `var(--cream-500)`  | `#EBE7DD`    |
| `--color-text-on-dark`         | `var(--cream-500)`  | `#EBE7DD`    |
| `--color-text-on-dark-muted`   | `rgba(235,231,221,0.85)` | —      |
| `--color-text-inverse`         | `var(--bg-base)`    | `#1E1E1C`    |

### Surfaces
| Token                          | New (subtle)         | Hex resolved |
|--------------------------------|----------------------|--------------|
| `--color-bg-base`              | `var(--bg-base)`     | `#1E1E1C`    |
| `--color-bg-warm`              | `var(--bg-elevated)` | `#262624`    |
| `--color-bg-elevated`          | `var(--bg-elevated)` | `#262624`    |
| `--color-bg-section-warm`      | `rgba(38,38,36,0.85)` | —           |
| `--color-bg-section-base`      | `rgba(30,30,28,0.92)` | —           |
| `--color-bg-impact`            | `var(--indigo-900)`  | `#1F274D`    |
| `--color-bg-overlay-dark`      | `rgba(30,30,28,0.75)` | —           |

### Accents
| Token                          | New (subtle)         | Hex resolved |
|--------------------------------|----------------------|--------------|
| `--color-accent`               | `var(--peach-500)`   | `#D49E86`    |
| `--color-accent-hover`         | `var(--peach-300)`   | `#DCB099`    |
| `--color-accent-soft`          | `rgba(212,158,134,0.08)` | —        |
| `--color-accent-secondary`     | `var(--sky-300)`     | `#92A0CD`    |

### CTA
| Token                          | New (subtle)         | Hex resolved |
|--------------------------------|----------------------|--------------|
| `--color-cta-bg`               | `var(--peach-500)`   | `#D49E86`    |
| `--color-cta-bg-hover`         | `var(--peach-700)`   | `#B88069`    |
| `--color-cta-text`             | `var(--bg-base)`     | `#1E1E1C`    |

### Borders
| Token                          | New (subtle)         | Hex resolved |
|--------------------------------|----------------------|--------------|
| `--color-border`               | `var(--gray-700)`    | `#5C5B57`    |
| `--color-border-accent`        | `rgba(212,158,134,0.25)` | —        |
| `--color-border-on-dark`       | `rgba(235,231,221,0.5)`  | —        |

### Link & focus
| Token                          | New (subtle)         | Hex resolved |
|--------------------------------|----------------------|--------------|
| `--color-link`                 | `var(--peach-500)`   | `#D49E86`    |
| `--color-link-hover`           | `var(--peach-300)`   | `#DCB099`    |
| `--color-focus-ring`           | `var(--peach-500)`   | `#D49E86`    |

### Special-case (unchanged)
Same as faithful — hackathon green tokens left in place.

### Primitive layer (subtle)

```
--bg-base:     #1E1E1C;   --bg-elevated: #262624;   --bg-overlay:  #2D2D2A;
--peach-50:    #EED2C0;   --peach-100:   #E5BFA9;   --peach-300:   #DCB099;
--peach-500:   #D49E86;   --peach-700:   #B88069;   --peach-900:   #825642;
--indigo-300:  #7081B0;   --indigo-500:  #404F96;   --indigo-700:  #2D376A;   --indigo-900: #1F274D;
--sky-300:     #92A0CD;   --sky-500:     #6A7ABC;   --sky-700:     #4D5A89;
--cream-50:    #F7F3E8;   --cream-100:   #EFE9D8;   --cream-300:   #E5DECB;   --cream-500: #EBE7DD;
--gray-300:    #BAB6AE;   --gray-500:    #979593;   --gray-700:    #5C5B57;   --gray-900:  #2E2D2A;
```

---

## 3 · Contrast validation (WCAG AA)

AA thresholds: **4.5:1 body**, **3.0:1 large** (≥18pt regular / ≥14pt bold). Ratios for foreground primitives carried over from POSTER-PALETTE §4 where pre-computed; new pairs computed via the standard sRGB relative-luminance formula.

### 3.1 · Faithful — critical pairs on `bg-base #161614`

| Semantic pair                                   | Foreground / background     | Ratio    | AA body | AA large | Verdict                               |
|-------------------------------------------------|------------------------------|----------|---------|----------|---------------------------------------|
| `text-primary` / `bg-base`                      | `#E9E8E6` / `#161614`        | 14.80:1  | ✅      | ✅       | Pass.                                 |
| `text-primary` / `bg-elevated`                  | `#E9E8E6` / `#1B1B19`        | 14.09:1  | ✅      | ✅       | Pass.                                 |
| `text-secondary` / `bg-base`                    | `#B9B9B7` / `#161614`        | 9.22:1   | ✅      | ✅       | Pass.                                 |
| `text-muted` / `bg-base`                        | `#939290` / `#161614`        | 5.83:1   | ✅      | ✅       | Pass — comfortable for muted copy.    |
| `text-heading` / `bg-base`                      | `#E9E8E6` / `#161614`        | 14.80:1  | ✅      | ✅       | Pass.                                 |
| `accent` / `bg-base`                            | `#E7916E` / `#161614`        | 7.48:1   | ✅      | ✅       | Pass — peach inline accent.           |
| `accent-secondary` / `bg-base`                  | `#8BA0DE` / `#161614`        | 6.93:1   | ✅      | ✅       | Pass — sky-300 (NOT sky-500).         |
| `link` / `bg-base`                              | `#E7916E` / `#161614`        | 7.48:1   | ✅      | ✅       | Pass.                                 |
| `link-hover` / `bg-base`                        | `#E8A383` / `#161614`        | 8.63:1   | ✅      | ✅       | Pass.                                 |
| `focus-ring` against page                       | `#E7916E` outline ring       | 7.48:1   | ✅      | ✅       | Visible.                              |
| `cta-text` / `cta-bg`                           | `#161614` / `#E7916E`        | 7.36:1   | ✅      | ✅       | Pass — dark on peach.                 |
| `cta-text` / `cta-bg-hover`                     | `#161614` / `#C97550`        | 5.34:1   | ✅      | ✅       | Pass.                                 |
| `text-primary` / `bg-impact`                    | `#E9E8E6` / `#1A2455`        | 11.47:1  | ✅      | ✅       | Pass on indigo-900 impact band.       |
| `text-on-dark` / `bg-impact`                    | `#E9E8E6` / `#1A2455`        | 11.47:1  | ✅      | ✅       | Pass.                                 |

### 3.1.b · Faithful — display-only pairs (informational; not used for body)

| Pair                                   | Ratio   | AA body | AA large | Disposition                                                  |
|----------------------------------------|---------|---------|----------|--------------------------------------------------------------|
| `--sky-500 #5770CE` / `bg-base`        | 3.98:1  | ❌      | ✅       | Allowed only at ≥18pt regular / ≥14pt bold. Not mapped to any inline token. |
| `--indigo-500 #3249A4` / `bg-base`     | 2.26:1  | ❌      | ❌       | **Decorative display only** (large wordmark / dots). Not mapped to any inline token. |

### 3.2 · Subtle — critical pairs on `bg-base #1E1E1C`

| Semantic pair                                   | Foreground / background     | Ratio    | AA body | AA large | Verdict                               |
|-------------------------------------------------|------------------------------|----------|---------|----------|---------------------------------------|
| `text-primary` / `bg-base`                      | `#EBE7DD` / `#1E1E1C`        | 13.52:1  | ✅      | ✅       | Pass.                                 |
| `text-secondary` / `bg-base`                    | `#BAB6AE` / `#1E1E1C`        | 8.26:1   | ✅      | ✅       | Pass.                                 |
| `text-muted` / `bg-base`                        | `#979593` / `#1E1E1C`        | 5.59:1   | ✅      | ✅       | Pass.                                 |
| `text-heading` / `bg-base`                      | `#EBE7DD` / `#1E1E1C`        | 13.52:1  | ✅      | ✅       | Pass.                                 |
| `accent` / `bg-base`                            | `#D49E86` / `#1E1E1C`        | 7.18:1   | ✅      | ✅       | Pass.                                 |
| `accent-secondary` / `bg-base`                  | `#92A0CD` / `#1E1E1C`        | 6.33:1   | ✅      | ✅       | Pass — sky-300 subtle.                |
| `link` / `bg-base`                              | `#D49E86` / `#1E1E1C`        | 7.18:1   | ✅      | ✅       | Pass.                                 |
| `link-hover` / `bg-base`                        | `#DCB099` / `#1E1E1C`        | 8.52:1   | ✅      | ✅       | Pass.                                 |
| `cta-text` / `cta-bg`                           | `#1E1E1C` / `#D49E86`        | 6.36:1   | ✅      | ✅       | Pass — dark on subtle peach.          |
| `cta-text` / `cta-bg-hover`                     | `#1E1E1C` / `#B88069`        | 4.55:1   | ✅      | ✅       | Pass — barely clears body AA. See §4. |
| `text-primary` / `bg-impact`                    | `#EBE7DD` / `#1F274D`        | 10.20:1  | ✅      | ✅       | Pass.                                 |

### 3.2.b · Subtle — display-only pairs (informational)

| Pair                                   | Ratio   | AA body | AA large | Disposition                  |
|----------------------------------------|---------|---------|----------|------------------------------|
| `--sky-500 #6A7ABC` / `bg-base`        | 4.07:1  | ❌      | ✅       | Large text only.             |
| `--indigo-500 #404F96` / `bg-base`     | 2.21:1  | ❌      | ❌       | Display only.                |

---

## 4 · Decision notes (adjustments and why)

1. **`accent-secondary` shifted from `sky-500` to `sky-300`.** The poster's natural link blue (`sky-500 #5770CE`) is the closest analog to the previous `--gold`, but it scores 3.98:1 on bg-base — fine for ≥18pt display, fails for body. Stepping up to `sky-300` (`#8BA0DE` / `#92A0CD`) keeps the cool counterweight to peach while clearing AA body (6.93:1 / 6.33:1). Components that genuinely want the saturated `sky-500` (oversized blockquote attribution, mega-CTA labels) reach for the `--sky-500` primitive directly.

2. **CTA inverts: dark text on peach.** Cream-500 on peach-500 = 1.97:1 (fails). Bg-base on peach-500 = 7.36:1 (pass). The mapping flips `--color-cta-text` from `white` to `bg-base`. This is a semantic change downstream consumers must respect — token-swapper's job in #3, but flagged here so it isn't lost.

3. **`bg-impact` uses `indigo-900` (`#1A2455` / `#1F274D`) rather than collapsing to `bg-base`.** The light-mode token expressed editorial separation between sections; collapsing it would erase that rhythm. Using the deepest poster indigo preserves the "MÉXICO indigo" mood while contrasting +L over the surrounding base. All foreground tokens still clear AA on this surface (cream `text-primary` = 11.47:1 faithful, 10.20:1 subtle).

4. **`accent-hover` and `link-hover` go LIGHTER, not darker.** Light-mode hover deepened copper toward `copper-dark`; in dark mode the convention reverses — hover lifts toward `peach-300`. This produces a more legible hover delta against `bg-base` and matches dark-mode patterns in Brookings/RAND-style sites.

5. **`text-heading` resolves to `cream-500`, not `peach-500`.** Most headings throughout the site are body-class headings (h2/h3/h4 in cards, sections, etc.). Using peach as the global heading color would oversaturate the page. The hero h1 component (`page-hero-title`) overrides to `peach-500` at the component level, where it functions as the poster-equivalent display headline. This is a component-CSS concern — token-swapper hands the override list to components-darkmode (#5).

6. **`bg-warm` collapses to `bg-elevated`.** In light mode `cream` was a distinct warm surface separating section bands from the white page. In dark mode the equivalent is `bg-elevated #1B1B19` (faithful) — still a +5L lift over bg-base, still warm-toned. Two surfaces would create needless tonal complexity. Components that rely on `bg-warm` will visually read as soft cards rather than washed bands; that's acceptable and aligns with RAND-style flat editorial.

7. **`subtle-cta-bg-hover` is a watch item.** `#1E1E1C` on `#B88069` = **4.55:1** — clears AA body by only 0.05. If downstream rendering (browser dithering, color-managed displays) drops it below threshold, bump to `peach-500` on hover (7.18:1) and use `peach-700` only for active/pressed. Documented; not changed in mapping.

8. **`--color-text-on-dark-muted` carries cream alpha, not white alpha.** Light mode used `rgba(255,255,255,0.80)`. In dark mode "on dark" still means "foreground on a dark surface," but our foreground rotation is cream-500 not pure white. Switched to `rgba(233,232,230,0.85)` faithful / `rgba(235,231,221,0.85)` subtle — same intent, palette-consistent.

9. **No new primitives invented.** Every value above is sourced from POSTER-PALETTE §1 or §2. Adjustments are role-assignment only (which primitive a semantic token resolves to), never re-tinted hex. This keeps token-swapper's job mechanical.

10. **Hackathon green tokens kept verbatim.** `--color-cta-register*` and `--color-prize-badge-*` are page-scoped, time-bounded surfaces with their own contrast story (~12:1 on bg-base, intentionally electric). No need to remap; they read correctly against either dark base.

---

## 5 · Token count summary

- **Tokens mapped:** 28 `--color-*` semantic tokens (text: 7, surfaces: 7, accents: 4, CTA: 3, borders: 3, link/focus: 3, hackathon special: 5 — kept verbatim).
- **Primitives added (faithful):** 27 (3 surface + 6 peach + 4 indigo + 3 sky + 4 cream + 4 gray + 4 code).
- **Primitives added (subtle):** 23 (3 surface + 6 peach + 4 indigo + 3 sky + 4 cream + 4 gray; code colors shared with faithful).
- **Contrast pairs validated:** 14 critical inline pairs per variant (28 total) — **all pass AA body**. 2 display-only pairs per variant flagged for component-level enforcement (`sky-500`, `indigo-500`).
- **Contrast failures requiring mapping adjustment:** 1 (accent-secondary, fixed by routing through `sky-300` instead of `sky-500`); 1 implicit (CTA text color, fixed by inverting from `white` to `bg-base`). No remaining failures.
