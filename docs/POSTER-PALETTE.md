# Poster Palette — Faithful & Subtle

Source image: `Screenshot 2026-05-08 at 5.57.56 a.m..png` (Greywall workshop poster, "AI Safety / MÉXICO", 847×851px).

Hex codes were extracted by sampling pixels across multiple zones with a Python/PIL pipeline (background base, elevated card, headline glyphs, MÉXICO wordmark, NIKITA name, URL links, code-panel syntax). The dominant color in each zone was selected, then cross-validated against an HSL/predicate scan over the full image. Counts in the source data range from 50–390 pixels per swatch — these are the modal pigments, not outliers.

This file feeds **pipelines 1 (faithful)** and **2 (subtle)** of the dark-mode rebuild.

---

## 1 · Faithful Palette

The hex codes lifted directly from the poster, lightly rounded to representative pigments. This palette is intentionally **edgy, warm, and high-contrast** — it preserves the "1980s sci-fi paperback / Mexican modernism" mood of the source.

### Surfaces

| Token              | Hex       | RGB              | Role                                                              |
|--------------------|-----------|------------------|-------------------------------------------------------------------|
| `--bg-base`        | `#161614` | `22, 22, 20`     | Page background. Warm near-black with a faint yellow undertone (B<R=G).  Dominant pigment — ~362k pixels. |
| `--bg-elevated`    | `#1B1B19` | `27, 27, 25`     | Card / code-panel background. +5 luminance over base, same hue.   |
| `--bg-overlay`     | `#22221F` | `34, 34, 31`     | Hover / tooltip surface (interpolated, +13 over base).            |

### Accents — Peach / Coral (warm)

The signature poster pigment. Used for the "AI Safety" headline, the temple silhouette, and "Technical Product Lead". HSL ≈ 15°, 71%, 67%.

| Token              | Hex       | RGB              | Role                                                              |
|--------------------|-----------|------------------|-------------------------------------------------------------------|
| `--peach-50`       | `#F5D9C7` | `245, 217, 199`  | Tint — large flat fills, soft glow.                               |
| `--peach-100`      | `#F0BFA8` | `240, 191, 168`  | Light accent — secondary surfaces, hover background.              |
| `--peach-300`      | `#E8A383` | `232, 163, 131`  | Soft accent — observed in glow / sunset gradient.                 |
| `--peach-500`      | `#E7916E` | `231, 145, 110`  | **Primary peach** — headlines, primary CTAs.                      |
| `--peach-700`      | `#C97550` | `201, 117, 80`   | Pressed / active state.                                            |
| `--peach-900`      | `#8C4D33` | `140, 77, 51`    | Deep accent — borders on light surfaces (rarely used in dark).    |

### Accents — Blue (cool, two distinct tones)

The poster contains **two** different blues — a deeply saturated indigo for the "MÉXICO" wordmark and a lighter, more periwinkle sky-blue for URL/links.

#### Indigo (deep — display only)

HSL ≈ 228°, 53%, 42%. Used for the giant MÉXICO wordmark.

| Token              | Hex       | RGB              | Role                                                              |
|--------------------|-----------|------------------|-------------------------------------------------------------------|
| `--indigo-300`     | `#6B7FBC` | `107, 127, 188`  | Light tint — outline / focus halo.                                 |
| `--indigo-500`     | `#3249A4` | `50, 73, 164`    | **Display indigo** — large wordmark, decorative dots.             |
| `--indigo-700`     | `#243371` | `36, 51, 113`    | Pressed.                                                            |
| `--indigo-900`     | `#1A2455` | `26, 36, 85`     | Deep tone — borders on cream surfaces.                            |

> ⚠ Contrast: `#3249A4` on `#161614` = **2.26:1** — fails AA even for large text. Use only as decorative/oversized display, never for body or links.

#### Sky (link blue — readable)

HSL ≈ 225°, 56%, 57%. Used for the bottom-area URLs (`https://greywall.li/`, `https://luma.com/...`).

| Token              | Hex       | RGB              | Role                                                              |
|--------------------|-----------|------------------|-------------------------------------------------------------------|
| `--sky-300`        | `#8BA0DE` | `139, 160, 222`  | Hover / visited link.                                             |
| `--sky-500`        | `#5770CE` | `87, 112, 206`   | **Link primary** — anchor color in body copy.                     |
| `--sky-700`        | `#3F548E` | `63, 84, 142`    | Pressed link.                                                      |

### Cream / Warm white (text)

| Token              | Hex       | RGB              | Role                                                              |
|--------------------|-----------|------------------|-------------------------------------------------------------------|
| `--cream-50`       | `#F8F5EC` | `248, 245, 236`  | Inverted surface (rare).                                            |
| `--cream-100`      | `#ECE7D9` | `236, 231, 217`  | Subtle warm cream.                                                  |
| `--cream-300`      | `#E3DDCE` | `227, 221, 206`  | **Warm cream** — accent text, poster mood.                        |
| `--cream-500`      | `#E9E8E6` | `233, 232, 230`  | **Primary text** (NIKITA name, dates, body copy).                  |

### Muted / Neutral

| Token              | Hex       | RGB              | Role                                                              |
|--------------------|-----------|------------------|-------------------------------------------------------------------|
| `--gray-300`       | `#B9B9B7` | `185, 185, 183`  | Soft secondary text.                                              |
| `--gray-500`       | `#939290` | `147, 146, 144`  | **Muted text** — descriptive copy ("A workshop on AI safety…").    |
| `--gray-700`       | `#5A5A58` | `90, 90, 88`     | Subtle border / divider.                                          |
| `--gray-900`       | `#2A2A28` | `42, 42, 40`     | Deep border above bg-base.                                        |

### Code panel accents (terminal syntax)

Sampled from the right-hand code panel. These are utility colors for syntax highlighting — not part of the brand foreground rotation.

| Token              | Hex       | RGB              | Role                                                              |
|--------------------|-----------|------------------|-------------------------------------------------------------------|
| `--code-orange`    | `#DC8149` | `220, 129, 73`   | Errors / warnings — sits between peach and amber.                |
| `--code-green`     | `#3F9C38` | `63, 156, 56`    | Strings / success states — saturated terminal green.              |
| `--code-yellow`    | `#E7B772` | `231, 183, 114`  | Numerals / type names — warm wheat yellow.                       |
| `--code-cyan`      | `#88A9E5` | `136, 169, 229`  | Identifiers / properties — soft sky-cyan.                         |

---

## 2 · Subtle Palette

Same hues as faithful, but **less saturated** and with a slightly lifted background. The result reads as more "academic / RAND-style" while still nodding to the poster: warmer than a pure neutral dark theme, but not as edgy.

Transformation rules:
- Background: lifted +8 RGB units (~`#161614` → `#1E1E1C`).
- Peach: HSL saturation -28% (71% → 51%), hue/lightness preserved.
- Indigo & Sky: HSL saturation -25% (slightly more grayed).
- Cream: shifted ~3 units warmer (more yellow), keeps lightness.
- Gray: minor warm tilt.

### Surfaces

| Token              | Hex       | RGB              | Role                                                              |
|--------------------|-----------|------------------|-------------------------------------------------------------------|
| `--bg-base`        | `#1E1E1C` | `30, 30, 28`     | Page background, +8 over faithful base.                           |
| `--bg-elevated`    | `#262624` | `38, 38, 36`     | Card surface.                                                       |
| `--bg-overlay`     | `#2D2D2A` | `45, 45, 42`     | Hover surface.                                                      |

### Peach / Coral (warm)

| Token              | Hex       | RGB              | Role                                                              |
|--------------------|-----------|------------------|-------------------------------------------------------------------|
| `--peach-50`       | `#EED2C0` | `238, 210, 192`  | Tint.                                                               |
| `--peach-100`      | `#E5BFA9` | `229, 191, 169`  | Light accent.                                                      |
| `--peach-300`      | `#DCB099` | `220, 176, 153`  | Soft accent.                                                       |
| `--peach-500`      | `#D49E86` | `212, 158, 134`  | **Primary peach** — desaturated 28% from faithful.                |
| `--peach-700`      | `#B88069` | `184, 128, 105`  | Pressed.                                                            |
| `--peach-900`      | `#825642` | `130, 86, 66`    | Deep accent.                                                       |

### Blue — Indigo (display)

| Token              | Hex       | RGB              | Role                                                              |
|--------------------|-----------|------------------|-------------------------------------------------------------------|
| `--indigo-300`     | `#7081B0` | `112, 129, 176`  | Light tint.                                                       |
| `--indigo-500`     | `#404F96` | `64, 79, 150`    | Display indigo (still fails AA — display only).                   |
| `--indigo-700`     | `#2D376A` | `45, 55, 106`    | Pressed.                                                            |
| `--indigo-900`     | `#1F274D` | `31, 39, 77`     | Deep border.                                                       |

### Blue — Sky (link)

| Token              | Hex       | RGB              | Role                                                              |
|--------------------|-----------|------------------|-------------------------------------------------------------------|
| `--sky-300`        | `#92A0CD` | `146, 160, 205`  | Hover / visited.                                                  |
| `--sky-500`        | `#6A7ABC` | `106, 122, 188`  | **Link primary** — desaturated 25%.                               |
| `--sky-700`        | `#4D5A89` | `77, 90, 137`    | Pressed link.                                                      |

### Cream / warm white

| Token              | Hex       | RGB              | Role                                                              |
|--------------------|-----------|------------------|-------------------------------------------------------------------|
| `--cream-50`       | `#F7F3E8` | `247, 243, 232`  | Inverted surface.                                                  |
| `--cream-100`      | `#EFE9D8` | `239, 233, 216`  | Subtle warm cream.                                                  |
| `--cream-300`      | `#E5DECB` | `229, 222, 203`  | **Warm cream** — slightly warmer than faithful.                   |
| `--cream-500`      | `#EBE7DD` | `235, 231, 221`  | **Primary text** — slightly warmer than faithful.                 |

### Muted / Neutral

| Token              | Hex       | RGB              | Role                                                              |
|--------------------|-----------|------------------|-------------------------------------------------------------------|
| `--gray-300`       | `#BAB6AE` | `186, 182, 174`  | Soft secondary.                                                    |
| `--gray-500`       | `#979593` | `151, 149, 147`  | Muted text — slight warm tilt.                                    |
| `--gray-700`       | `#5C5B57` | `92, 91, 87`     | Border.                                                            |
| `--gray-900`       | `#2E2D2A` | `46, 45, 42`     | Deep border.                                                       |

---

## 3 · Mood / Notes

**Faithful** reads:
- **Warm** overall — the BG (`#161614`) is technically near-black, but its R=G > B by 2 units gives it a yellow undertone. Combined with peach + cream foreground, the page should feel like firelight, not silicon.
- **Edgy / cinematic** — high saturation peach (71%) against pure dark plus a deeply saturated MÉXICO indigo (53%) creates a sci-fi-paperback contrast. Echoes 1980s Latin American futurism: think Octavio Paz pamphlets, Sevcec posters, *El Topo*.
- **Two-temperature dialogue** — the peach/cream foreground is warm, the indigo/sky accents are cool. A page using both will feel polychromatic and editorial, not monochrome.
- **Code-panel garnishes** — the small hits of green/cyan/yellow from the terminal block let us add micro-accents in technical content (success states, code blocks) without breaking the brand axis.

**Subtle** reads:
- **More academic** — desaturated peach reads "terracotta" rather than "neon coral"; the lifted background (`#1E1E1C`) feels less like a void.
- **Closer to RAND/Brookings dark-mode conventions** — the cream still has poster-warmth, but body copy is closer to a neutral cream than to the slightly yellow `#E9E8E6`.
- **Less mood, more legibility** — better default for long-form research pages where peach-as-headline could fatigue.

When in doubt: **use faithful for marketing/landing/event pages**, **use subtle for research/document/about pages**.

---

## 4 · WCAG AA Validation (Faithful)

Contrast ratios computed via standard sRGB luminance formula. AA threshold = 4.5:1 (body), 3.0:1 (large ≥18pt regular / ≥14pt bold).

### Foreground on `--bg-base` (`#161614`)

| Foreground         | Hex       | Ratio   | AA body | AA large | Verdict                                  |
|--------------------|-----------|---------|---------|----------|------------------------------------------|
| `--cream-500`      | `#E9E8E6` | 14.80:1 | ✅      | ✅       | Use for body text.                       |
| `--cream-300`      | `#E3DDCE` | 13.37:1 | ✅      | ✅       | Use for accent body text.                |
| `--gray-300`       | `#B9B9B7` | 9.22:1  | ✅      | ✅       | Use for secondary text.                  |
| `--peach-light`    | `#E8A383` | 8.63:1  | ✅      | ✅       | Use for accent / glow.                   |
| `--peach-500`      | `#E7916E` | 7.48:1  | ✅      | ✅       | Use for headlines, CTAs, primary links. |
| `--gray-500`       | `#939290` | 5.83:1  | ✅      | ✅       | Use for muted descriptive copy.          |
| `--sky-500`        | `#5770CE` | 3.98:1  | ❌      | ✅       | **Large text only** (≥18pt). For body links use peach. |
| `--indigo-500`     | `#3249A4` | 2.26:1  | ❌      | ❌       | **Display only** — never body / link.    |

### Foreground on `--bg-elevated` (`#1B1B19`)

| Foreground         | Hex       | Ratio   | AA body | AA large | Verdict                                  |
|--------------------|-----------|---------|---------|----------|------------------------------------------|
| `--cream-500`      | `#E9E8E6` | 14.09:1 | ✅      | ✅       |                                          |
| `--peach-500`      | `#E7916E` | 7.12:1  | ✅      | ✅       |                                          |
| `--gray-500`       | `#939290` | 5.55:1  | ✅      | ✅       |                                          |
| `--sky-500`        | `#5770CE` | 3.79:1  | ❌      | ✅       | Large text only.                          |
| `--indigo-500`     | `#3249A4` | 2.16:1  | ❌      | ❌       | Display only.                             |

### Subtle palette

| Pair                                       | Ratio   | AA body | AA large |
|--------------------------------------------|---------|---------|----------|
| `cream-500` `#EBE7DD` on `bg-base` `#1E1E1C` | 13.52:1 | ✅      | ✅       |
| `cream-300` `#E5DECB` on `bg-base`           | 12.44:1 | ✅      | ✅       |
| `gray-300` `#BAB6AE` on `bg-base`            | 8.26:1  | ✅      | ✅       |
| `peach-light` `#DCB099` on `bg-base`         | 8.52:1  | ✅      | ✅       |
| `peach-500` `#D49E86` on `bg-base`           | 7.18:1  | ✅      | ✅       |
| `gray-500` `#979593` on `bg-base`            | 5.59:1  | ✅      | ✅       |
| `sky-500` `#6A7ABC` on `bg-base`             | 4.07:1  | ❌      | ✅       |
| `indigo-500` `#404F96` on `bg-base`          | 2.21:1  | ❌      | ❌       |

### Action items for downstream pipelines

1. **Body link color in both palettes must be `peach-500`** (faithful 7.48, subtle 7.18) — the natural-feeling sky-blue fails AA for body text and would force compromise.
2. **`indigo-500` is display-only.** Reserve it for the MÉXICO-equivalent wordmark (Hero h1 sub-line, large stat numbers ≥48px, or decorative dots). Never use as link, button, or body color. If a deep blue is needed for body/link, derive a lifted variant (e.g. `indigo-300` `#6B7FBC` on `bg-base` = ~4.7:1, AA body — to be confirmed if used).
3. **Large display text (≥18pt regular / ≥14pt bold)** can use `sky-500` legitimately — works for large CTA links, oversized blockquote attribution, etc.
4. **Cream-300 (`#E3DDCE`) is warm enough to read as "tan"** when used in large blocks. For long-form body copy prefer `cream-500`; reserve `cream-300` for emphasis quotes / pull-out attribution / hero subtitles.
5. **Code-panel colors** (`code-orange`, `code-green`, `code-yellow`, `code-cyan`) should appear only in `<code>` and `<pre>` blocks. They're not contrast-validated against `bg-base` because they're never used at body sizes.
