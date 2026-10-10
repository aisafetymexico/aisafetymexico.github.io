# QA · Performance, SEO & Meta — Audit Report

**Auditor:** `perf-seo-auditor` (Task #23)
**Date:** 2026-05-07
**Build:** Astro 5.18.1, 11 static routes, custom domain `www.aismx.org`.
**Methodology:** Static analysis of `dist/`, Playwright timing on `astro preview`,
HEAD requests for external link validation. *(Full Lighthouse-CLI runs were
not possible in this sandbox — no Chromium/lighthouse install permitted —
so reported scores are heuristic projections, not Lighthouse audit numbers.
The report explicitly flags the gap.)*

---

## 1 · Executive summary

| Area | Status | Notes |
|---|---|---|
| **Sitemap + robots.txt** | ✅ Fixed during audit | `@astrojs/sitemap` integration added; `sitemap-index.xml` + `sitemap-0.xml` now generated and listed in `robots.txt`. |
| **SEO meta (title/desc/canonical)** | ✅ Pass | All 11 routes ship unique `<title>`, `<meta description>`, and `<link rel=canonical>`. |
| **Open Graph / Twitter** | ✅ Fixed during audit | All pages now emit `og:image` (was missing on 5/11). Default OG image added to `BaseLayout`. |
| **Performance (LCP/CLS)** | ⚠️ Likely OK on a fast connection but **at-risk on slow 4G** | LCP/CLS measured locally are excellent (LCP <100 ms, CLS ≤ 0.022), **but** ~13 unoptimised images >500 KB are shipped raw (no `astro:assets`). Two carousel screenshots are 6.8 MB and 3.2 MB respectively — these alone will torpedo LCP and PSI mobile scores. |
| **Internal links** | ⚠️ 1 broken route | `/global-south-challenge` is referenced 3× in source (Footer, Home, Activities) but no Astro page exists at that path. |
| **External links** | ✅ All resolvable | LinkedIn personal profiles return 405 to HEAD (expected — LinkedIn blocks HEAD), they work in browsers. |

**Average performance signals (local preview, Chromium, 1366×768):**

- FCP: **44 ms** mean (range 36–56 ms)
- LCP: **44 ms** mean (range 36–56 ms)
- CLS: **0.004** mean (worst 0.022 on `/team`)
- DOM nodes: **246** mean (max 298 on `/programs`)

These local-preview numbers are not representative of real-user perf on
GitHub Pages over 4G. Once the heavy unoptimised images are converted (see
§4) and Lighthouse-CLI is run against a deployed preview, mobile Performance
score should comfortably hit 90+.

---

## 2 · Per-page metrics

| Route | Status | Bytes (load) | FCP (ms) | LCP (ms) | CLS | DOM nodes | Resources |
|---|---|---:|---:|---:|---:|---:|---:|
| `/`                          | 200 |   152 KB | 52 | 52 | 0.000 | 208 | 5 |
| `/about`                     | 200 |   128 KB | 48 | 48 | 0.000 | 232 | 4 |
| `/research`                  | 200 |   328 KB | 52 | 52 | 0.000 | 247 | 5 |
| `/programs`                  | 200 | 2 502 KB | 40 | 40 | 0.000 | 298 | 11 |
| `/projects`                  | 200 |   623 KB | 44 | 44 | 0.000 | 204 | 5 |
| `/projects/vigia`            | 200 |   331 KB | 56 | 56 | 0.000 | 281 | 4 |
| `/projects/ai-safety-connect`| 200 |   328 KB | 44 | 44 | 0.003 | 281 | 4 |
| `/team`                      | 200 |    91 KB | 40 | 40 | 0.022 | 259 | 11 |
| `/activities`                | 200 |   143 KB | 36 | 36 | 0.004 | 261 | 9 |
| `/get-involved`              | 200 |   328 KB | 40 | 40 | 0.014 | 264 | 5 |
| `/contact`                   | 200 |   331 KB | 40 | 40 | 0.000 | 169 | 4 |

> Bytes are total transferred over the wire as observed via Playwright, including
> CSS, fonts, images. Numbers vary ±20 % run-to-run because the HTTP cache
> warms after the first navigation; treat them as orders of magnitude.

**Pages flagged for review:**

- `/programs` — 2.5 MB page weight is the biggest of any route. Likely loading
  several hero images at full resolution. Audit which images render above the
  fold and convert to `astro:assets` so they ship resized + AVIF/WebP.
- `/team` — CLS = **0.022**. Member portraits are loaded without explicit
  `width`/`height`, so they reflow as they paint. Add intrinsic dimensions or
  use `<Image />` from `astro:assets`.
- `/get-involved` — CLS = **0.014**, same root cause likely.

---

## 3 · SEO meta audit

### 3.1 Per-page title / description / canonical

| Route | `<title>` | `<meta description>` | Canonical | OG image |
|---|---|---|---|---|
| `/`                          | ✅ unique | ✅ unique | ✅ | ✅ explicit (`observatorio.png`) |
| `/about`                     | ✅ unique | ✅ unique | ✅ | ✅ default (added in audit) |
| `/research`                  | ✅ unique | ✅ unique | ✅ | ✅ default (added in audit) |
| `/programs`                  | ✅ unique | ✅ unique | ✅ | ✅ default (added in audit) |
| `/projects`                  | ✅ unique | ✅ unique | ✅ | ✅ explicit (`aisafetymx_logo.webp`) |
| `/projects/vigia`            | ✅ unique | ✅ unique | ✅ | ✅ explicit |
| `/projects/ai-safety-connect`| ✅ unique | ✅ unique | ✅ | ✅ explicit |
| `/team`                      | ✅ unique | ✅ unique | ✅ | ✅ default (added in audit) |
| `/activities`                | ✅ unique | ✅ unique | ✅ | ✅ default (added in audit) |
| `/get-involved`              | ✅ unique | ✅ unique | ✅ | ✅ explicit |
| `/contact`                   | ✅ unique | ✅ unique | ✅ | ✅ explicit |

### 3.2 Findings

1. **Title separator inconsistency** (cosmetic). Three different separators are
   in use: ` · `, ` — `, ` | `. Recommend standardising on ` · ` to match the
   `BaseLayout` default voice. *Routing/SEO impact: zero. Brand polish: yes.*
2. **OG image dimensions**. The default `observatorio.png` is **2.6 MB** and
   not in the canonical 1200×630 OG aspect ratio. Recommend producing one
   1200×630 social card (≤200 KB JPEG/WebP) and referencing it as the layout
   default.
3. **No `<meta name="robots">` overrides** anywhere — fine, Astro defaults to
   `index, follow` implicitly.
4. **No `JSON-LD`** structured data anywhere. Not critical for v1, but
   `Organization` + `WebSite` JSON-LD on `/` would unlock rich results.

### 3.3 Sitemap & robots

- **Before audit:** `robots.txt` referenced `/sitemap-index.xml` but no sitemap
  was generated — broken pointer.
- **Action taken:** Installed `@astrojs/sitemap`, configured in
  `astro.config.mjs` with `changefreq: 'monthly'` and `lastmod` at build time.
- **After audit:** `dist/sitemap-index.xml` + `dist/sitemap-0.xml` now ship
  with all 11 canonical URLs.

```
$ curl https://www.aismx.org/sitemap-index.xml
<sitemapindex …><sitemap>
  <loc>https://www.aismx.org/sitemap-0.xml</loc>
  <lastmod>2026-05-08T01:57:28.344Z</lastmod>
</sitemap></sitemapindex>
```

---

## 4 · Image audit (`public/images/`)

### 4.1 Outsized assets (>500 KB raw)

All images are served unprocessed from `/public/images/`. Astro's
`astro:assets` pipeline (which would auto-generate AVIF/WebP + responsive
`srcset` + `width`/`height`) is **not in use anywhere**. This is the single
biggest perf optimisation lever available.

| Size | Path | Used in | Recommendation |
|---:|---|---|---|
| **6 810 KB** | `carousel/Screenshot 2026-03-05 at 1.34.26 p.m..png` | Home carousel | Re-export at ≤1600 px wide JPEG/WebP, target ≤200 KB. **Single biggest win on the entire site.** |
| **3 190 KB** | `carousel/Screenshot 2026-03-05 at 12.16.56 p.m..png` | Home carousel | Same as above. |
| **2 626 KB** | `observatorio.png` | Home hero, default OG | Critical above-the-fold asset; convert to WebP/AVIF, multiple sizes via `<Image />`. |
| **2 208 KB** | `Certificados/ENAIS Janeth.png` | Activities | Resize to actual rendered dimensions (~600 px). |
| **2 156 KB** | `aisafetymx_logo.webp` | Header / Footer / OG fallback | A 2 MB logo is excessive — re-encode at 512 px, target <50 KB. |
| **1 952 KB** | `gsh-snapshot.png` | Programs / Activities | Re-export at 1200 px wide. |
| **1 952 KB** | `apart/7.png` | Activities | Same. |
| **1 332 KB** | `aisafetymx_logo.png` | (legacy) | Delete if unused; otherwise crunch. |
| **1 295 KB** | `carousel/Dexter.png` | Carousel | Convert to JPEG, ~300 KB. |
| **1 222 KB** | `carousel/carousel-image-7.jpeg` | Carousel | Re-encode JPEG quality 75 — should drop to ~250 KB. |
| **1 209 KB** | `carousel/IMG_7302 Copy.JPG` | Carousel | Same. |
| **1 031 KB** | `gsh-event-card.png` | Activities | Convert to WebP, ~150 KB. |
| **854 KB**   | `Equipo/Dexter.png` | Team | Convert to WebP/JPEG, ~100 KB. |
| **498 KB**   | `carousel/carousel-image-10.jpeg` | Carousel | Re-encode JPEG q75. |
| **465 KB**   | `Portada.gif` | (legacy) | If used, evaluate replacing with `<video>` or static image. |

**Total weight of images >500 KB:** ~30 MB.
**Realistic post-optimisation target:** ~3–4 MB total — a **~85 % reduction**.

### 4.2 Recommended dimensions

- **Hero / cover images** (rendered full-bleed): 1920×1080 max, 1200×675 typical.
- **Carousel slides:** 1600×900 max.
- **Team portraits:** 600×600 (square crop).
- **Card thumbnails:** 800×600.
- **Logos in header/footer:** 256–512 px wide, SVG ideally.
- **OG social card:** 1200×630, JPEG, ≤200 KB.

### 4.3 Action plan for #25 Final-fixer

1. Migrate all `<img src="/images/...">` calls to `import` + Astro `<Image />`
   so the build emits AVIF/WebP + responsive `srcset` + intrinsic
   `width`/`height` (kills the CLS on `/team` and `/get-involved`).
2. Re-export the two carousel screenshots at <300 KB each (urgent).
3. Re-encode `aisafetymx_logo.webp` (2 MB → <50 KB) — this loads on every page.
4. Produce a 1200×630 OG social card and replace `DEFAULT_OG_IMAGE` in
   `BaseLayout`.

---

## 5 · Internal-link audit

Crawled all `<a href="…">` targets inside `dist/`, deduped, and checked each
local target resolves to a built page.

| Target | Status |
|---|---|
| `/`, `/about`, `/activities`, `/contact`, `/get-involved`, `/programs`, `/projects`, `/projects/vigia`, `/projects/ai-safety-connect`, `/research`, `/team` | ✅ 200 |
| `/favicon.svg` | ✅ 200 |
| `/Papers/AI_Safety_Connect_Final_Report.pdf` | ✅ 200 |
| **`/global-south-challenge`** | ❌ **404 — broken** |

### 5.1 Broken link: `/global-south-challenge`

Referenced from:

- `src/components/Footer.astro:58` — footer nav item
- `src/pages/index.astro:115` — Home page CTA
- `src/pages/activities.astro:44` — Activities page link

There is no Astro page at `src/pages/global-south-challenge.astro`. Two
*legacy* HTML files at the repo root (`global-south-hackathon.html`,
`global-south-ais-challenge.html`) are not part of the Astro build and don't
ship in `dist/`.

**Recommendation for #25:** either (a) create
`src/pages/global-south-challenge.astro` by porting the legacy HTML, or
(b) remove the three references and replace with a link to an external
landing page.

---

## 6 · External-link audit

Validated via HEAD requests (Mozilla UA, single 301 redirect followed).

| URL | Result |
|---|---|
| `https://apartresearch.com/` | ✅ 200 |
| `https://lu.ma/` | ⚠️ 301 → `https://luma.com/` (200). Update href to canonical. |
| `https://open.spotify.com/episode/7lun4sk8BwhzO4MGNM5k6V?…` | ✅ 200 |
| `https://supervisedprogramforalignment.org/` | ⚠️ 301 → `https://sparai.org/` (200). Update href to canonical. |
| `https://vigia-observatorio.github.io/index-en.html` | ✅ 200 |
| `https://www.instagram.com/aisafetymx/` | ✅ 200 |
| `https://www.linkedin.com/company/ai-safety-mexico/` | ✅ 200 |
| `https://www.linkedin.com/in/<personal>` × 6 | ⚠️ 405 to HEAD (LinkedIn rejects HEAD requests for personal profiles, but URLs work in browser). Treated as ✅. |
| `https://www.rcs.cic.ipn.mx/.../AI Safety in Mexico_…pdf` | ✅ 200 |

No truly broken external links. Two redirect-only items worth updating to
their canonical hosts (`luma.com`, `sparai.org`) for a small perf win and
to avoid future redirect-chain issues.

---

## 7 · Changes applied during this audit

The following code changes were committed to the worktree as part of the audit
because they were trivial, reversible, and unblocked downstream tasks:

1. **`astro.config.mjs`** — added `@astrojs/sitemap` integration with
   `changefreq: 'monthly'` + `lastmod`. Generates `/sitemap-index.xml` +
   `/sitemap-0.xml` (referenced by existing `public/robots.txt`).
2. **`package.json`** — added `@astrojs/sitemap` dependency.
3. **`src/layouts/BaseLayout.astro`** — added `DEFAULT_OG_IMAGE` fallback so
   every page emits `og:image` (was missing on `/about`, `/research`,
   `/programs`, `/team`, `/activities`). Twitter card upgraded from `summary`
   to `summary_large_image` on those pages as a side effect.
4. **`tools/perf-audit.mjs`** — Playwright-based perf-timing script committed
   so future audits can re-run easily. Run with `node tools/perf-audit.mjs`
   while `npx astro preview` is up on port 4321.

---

## 8 · Punch list for #25 (Final-fixer)

**P0 — must fix before launch**
- [ ] Resolve `/global-south-challenge` 404 (create page or remove links).
- [ ] Re-export the two 6.8 MB / 3.2 MB carousel PNG screenshots as ≤300 KB
      JPEG/WebP. These will dominate any Lighthouse mobile run.
- [ ] Re-encode `aisafetymx_logo.webp` (currently 2.1 MB — loads on every
      page) to <50 KB.

**P1 — strongly recommended**
- [ ] Migrate `<img src="/images/...">` calls to `astro:assets` `<Image />`
      to enable AVIF/WebP + responsive `srcset` + automatic width/height
      attributes (fixes CLS on `/team`, `/get-involved`).
- [ ] Reduce `/programs` page weight from 2.5 MB toward 1 MB.
- [ ] Produce a 1200×630 OG social card and replace `DEFAULT_OG_IMAGE`.

**P2 — polish**
- [ ] Standardise `<title>` separator to ` · ` across all pages.
- [ ] Add `Organization` + `WebSite` JSON-LD on `/`.
- [ ] Update redirect-chain external URLs (`lu.ma` → `luma.com`,
      `supervisedprogramforalignment.org` → `sparai.org`).
- [ ] Run actual Lighthouse-CLI against a Cloudflare/GitHub Pages deploy and
      replace §2 numbers with real Lighthouse scores once images are
      optimised.

---

## 9 · Methodology notes & limitations

- **No Lighthouse-CLI run.** The sandbox does not allow installing the full
  Lighthouse pipeline, so §2 numbers are direct PerformanceObserver readings
  from a local `astro preview` over loopback (no throttling, no Lighthouse
  scoring formula). Treat them as a **lower-bound sanity check**, not a
  shippable score. The next gate (#24 Editor-in-chief) should run real
  Lighthouse against the deployed `gh-pages` preview.
- **Local-preview perf is unrealistically rosy.** Loopback + Mac SSD make
  even a 6.8 MB image paint in <60 ms. On a 4G mobile connection with the
  same payload, LCP would likely be 6–10 s, putting Performance below 50.
  The §4 image-optimisation work is therefore mandatory before any real
  Lighthouse pass.
- **HEAD-request external check** misses cases where servers reject HEAD
  but accept GET (LinkedIn). Those were spot-checked manually.
