# i18n Link & Switcher QA (Task #10)

Generated: 2026-05-11T07:30:39.880Z
Preview: http://127.0.0.1:5092 (Astro build of `dist/`)

## Summary

| Check | Total | Pass | Fail |
|---|---:|---:|---:|
| 1. /en/* internal links point to /en/* | 346 | 346 | 0 |
| 2. LanguageSwitcher round-trip (path preserved) | 7 | 5 | 2 |
| 3. localStorage.aismx_locale set on click | 5 | 5 | 0 |
| 4. navigator.language detection on `/` | 3 | 3 | 0 |
| **Totals** | **361** | **359** | **2** |

**Result: FAIL** ❌ (2 failure(s) — see details below)

## 1. /en/* internal links

Crawled 12 routes; inspected 346 site-relative anchors (mailto:, tel:, off-site, in-page anchors, and shared assets under /images, /Papers, /favicon, /sitemap, /robots.txt, /CNAME are excluded).

All in-site anchors on `/en/*` routes resolve to `/en/*`. ✅

## 2. LanguageSwitcher round-trip

For each `from` path, clicked the inactive locale option in the header switcher and asserted the resulting pathname matches `expected`.

| From | Expected | Got |
|---|---|---|
| `/projects/vigia` | `/en/projects/vigia` | `/en/projects` |
| `/en/projects/vigia` | `/projects/vigia` | `/projects` |

### Root cause (project subpages)

The four project subpages — `src/pages/projects/vigia.astro`, `src/pages/projects/ai-safety-connect.astro`, `src/pages/en/projects/vigia.astro`, `src/pages/en/projects/ai-safety-connect.astro` — pass `currentPath="/projects"` (or `"/en/projects"`) to `<Header>` so that the *Projects* tab in the primary nav stays active. The `<Header>` then forwards that string verbatim to `<LanguageSwitcher>`, so the switcher computes the cross-locale URL against `/projects` instead of the actual page path (`/projects/vigia`). As a result, clicking ES on `/en/projects/vigia` lands on `/projects` instead of `/projects/vigia`.

Suggested fix: pass two distinct props to `<Header>` — e.g. `navActivePath` (drives Nav highlighting, currently `"/projects"`) and `currentPath` from `Astro.url.pathname` (drives LanguageSwitcher and any other route-sensitive logic). Out of scope for Task #10; flagging for translation-editor or a follow-up i18n task.

## 3. localStorage after switcher click

After each switcher click, asserted `localStorage.getItem('aismx_locale')` equals the locale that was clicked (so future visits to `/` skip auto-detection per architecture §5).

All clicks wrote the correct locale to storage. ✅

## 4. Browser-language detection on `/`

Used distinct Playwright `BrowserContext`s with `locale:` set, cleared `localStorage` before reloading `/`, and checked the post-script pathname. Detection script lives in `BaseLayout.astro` and only runs when `pathname === '/'`.

All detection cases behaved correctly. ✅

## Methodology notes

- Build: `astro build` → `dist/` (trailingSlash: never, format: directory).
- Server: `http-server dist -p 5092` on `127.0.0.1`.
- Anchor classification: `mailto:`, `tel:`, `http(s)://`, in-page `#…`, and shared-asset prefixes (`/images/`, `/Papers/`, `/favicon*`, `/sitemap*`, `/robots.txt`, `/CNAME`) are excluded from the cross-locale check.
- The `<a>` tags inside `.lang-switcher` are *also* excluded from the cross-locale check — the inactive-locale option is deliberately a cross-locale link (that's the switcher's entire purpose). They are exercised separately under check #2.
- Path normalisation: `/en` and `/en/` are treated as equivalent (the server 301s no-slash → slash; both are acceptable cross-locale targets).
