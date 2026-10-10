# I18N Architecture — AI Safety Mexico

> Source of truth for the bilingual (es / en) rollout of `www.aismx.org`.
> Owner: i18n-architect · Status: APPROVED (Phase 1)
> Consumers: astro-i18n-config (Task #2), i18n-strings (#3), switcher-and-detection (#4), translators (#5–#8).

---

## 0. Constraints recap

- Hosting: GitHub Pages (static, no server-side rewrites, no edge middleware).
- Astro 5.14 with `output: 'static'`, `trailingSlash: 'never'`, `build.format: 'directory'`.
- Custom apex domain: `https://www.aismx.org` (CNAME at repo root).
- Existing pages are Spanish-first (canonical content). English ships as a fully-mirrored locale.
- BaseLayout already accepts `lang: 'es' | 'en'` and writes the correct `<html lang>` plus `og:locale`.
- No build process changes outside `astro.config.mjs`. No new runtime deps.

---

## 1. Routing

### Definitive contract

| Locale | URL shape | Examples |
|---|---|---|
| **es** (default) | `/<slug>` (no prefix) | `/`, `/about`, `/projects/vigia` |
| **en** | `/en/<slug>` | `/en`, `/en/about`, `/en/projects/vigia` |

- Spanish is the **default locale** and lives at the URL root (no `/es/` prefix). This preserves every existing canonical URL and avoids 301 redirects on launch day.
- English mirrors every Spanish slug under `/en/`. The English home is reachable at both `/en` and `/en/` (Astro emits `/en/index.html`; with `trailingSlash: 'never'` and `format: 'directory'` GitHub Pages serves both).
- Slugs are **identical across locales** (no localized slugs). `/about` ↔ `/en/about`. Rationale: simpler switcher math, simpler sitemap, no SEO churn, no risk of orphaned pages.

### Astro config (input for Task #2)

`astro.config.mjs`:

```js
export default defineConfig({
  site: 'https://www.aismx.org',
  base: '/',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'directory' },

  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,   // Spanish at /
      redirectToDefaultLocale: false,
    },
    // No fallback strategy needed: every page exists in both locales (see §6).
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es-MX', en: 'en-US' },
      },
      changefreq: 'monthly',
      lastmod: new Date(),
    }),
  ],
});
```

Notes for Task #2:
- The `i18n` block is required so Astro emits correct `Astro.currentLocale` and so `@astrojs/sitemap` writes `<xhtml:link rel="alternate" hreflang="...">` pairs.
- `redirectToDefaultLocale: false` — we explicitly do **not** want Astro generating a 307 from `/foo` to `/es/foo`; Spanish stays unprefixed.
- Do **not** set `fallback`. We hand-author all English pages (Strategy B below); fallback would mask missing pages instead of surfacing them in QA.
- Sitemap config: passing `i18n` to `@astrojs/sitemap` produces `hreflang` alternates automatically once both URLs exist.

### `<head>` additions (BaseLayout, Phase 2)

Each page must emit hreflang pairs and a Spanish `x-default`:

```astro
<link rel="alternate" hreflang="es-mx" href={esUrl} />
<link rel="alternate" hreflang="en" href={enUrl} />
<link rel="alternate" hreflang="x-default" href={esUrl} />
```

Helper lives in `src/lib/i18n.ts` (see §3.3).

---

## 2. Translation strategy — chosen: **B (sibling page files)**

### The three options considered

**A. Astro native i18n + content collections per locale.** Single `.astro` template per route, content sourced from `src/content/<locale>/...`. Astro emits both URLs from one `getStaticPaths`.
- Pros: DRY, one template per page.
- Cons: forces us to **break apart every page into content schemas**. Pages today are hand-authored Astro with rich JSX (Hero, FeatureGrid, ActivityCard, ad-hoc one-off compositions). Pulling all of that into MDX/JSON collections is a 2-week refactor and a strict regression on authoring velocity. Doesn't fit our content pattern.

**B. Sibling page files reusing the same components.** Spanish lives at `src/pages/<slug>.astro` (unchanged). English lives at `src/pages/en/<slug>.astro`. Both import the same shared layout + components, but pass locale-specific copy.
- Pros: zero refactor for existing pages; translators work in plain `.astro` next to the original; chrome (Header/Footer) reads strings from `src/lib/i18n.ts` so no duplication of nav labels; URL routing is mechanical (Astro maps file path to URL); failure modes are obvious (a missing `en/foo.astro` simply doesn't build that URL).
- Cons: page-body copy is duplicated across two files. **This is acceptable**: copy duplication is a one-time cost paid by translators; the alternative is a scope-creep refactor of every page.

**C. Single page with strings dict.** One `.astro` file per route, all strings looked up from a `t(key)` table by `Astro.currentLocale`.
- Pros: maximum DRY.
- Cons: requires extracting **every body string** (paragraphs, list items, CTAs in-context, hero subtitles, ActivityCard descriptions, FactList rows, …) into keyed dictionaries. With ~12 long-form pages, this is several hundred keys, each of which is brittle when prose changes. Worst-of-both for our content-heavy site.

### Decision: **Strategy B**

**Why B over A/C:**
1. The pages are essay-like, not data-driven. Strategy A's schema-first model fits CMS-style sites; ours is editorial-prose-first.
2. Translators can read the Spanish page as the brief and write the English one next to it. No mental model of a key-naming convention.
3. Chrome (Header, Footer, Breadcrumb, MobileMenu, CtaSection labels passed as props) **is** shared — those strings move to `src/lib/i18n.ts` (Strategy C scoped to chrome only). This captures ~95% of the DRY benefit without the prose-key tax.
4. Pages that *are* data-driven today (Team cards, Project metadata) can opt into a small dict pattern locally (see §3.2) without forcing the whole site to.

**The hybrid in one sentence:** *Chrome strings live in a typed module (`src/lib/i18n.ts`). Page bodies are duplicated as sibling `.astro` files.*

### File layout after the rollout

```
src/pages/
  index.astro                         (es) /
  about.astro                         (es) /about
  research.astro                      (es) /research
  programs.astro                      (es) /programs
  team.astro                          (es) /team
  activities.astro                    (es) /activities
  get-involved.astro                  (es) /get-involved
  contact.astro                       (es) /contact
  global-south-challenge.astro        (es) /global-south-challenge
  projects/
    index.astro                       (es) /projects
    vigia.astro                       (es) /projects/vigia
    ai-safety-connect.astro           (es) /projects/ai-safety-connect
  en/
    index.astro                       (en) /en
    about.astro                       (en) /en/about
    research.astro                    (en) /en/research
    programs.astro                    (en) /en/programs
    team.astro                        (en) /en/team
    activities.astro                  (en) /en/activities
    get-involved.astro                (en) /en/get-involved
    contact.astro                     (en) /en/contact
    global-south-challenge.astro      (en) /en/global-south-challenge
    projects/
      index.astro                     (en) /en/projects
      vigia.astro                     (en) /en/projects/vigia
      ai-safety-connect.astro         (en) /en/projects/ai-safety-connect
```

12 routes × 2 locales = 24 page files.

### Per-page contract for translators

Every English page **must**:
1. Import the same components as its Spanish sibling.
2. Set `<BaseLayout lang="en" pathname="/en/...">`.
3. Pass `currentPath="/en/<slug>"` to `<Header>` (this drives active-state highlighting AND tells the switcher its "other half").
4. Pull chrome strings via `t('en', 'header.nav.about')` etc. — never hard-code "About us" / "Get involved".
5. Mirror the Spanish page's `<SectionHeading>`/section structure 1:1. **Do not add or remove sections.** If a section is missing, ship a placeholder rather than re-architect.

---

## 3. Shared strings module — `src/lib/i18n.ts`

### 3.1 What goes in the module

**In scope (chrome, shared widely, ≤120 keys total):**
- Header nav labels + aria-labels.
- MobileMenu open/close labels + aria.
- Footer column headings, column items (labels mirror nav), tagline, copyright suffix, social-block aria-label.
- Breadcrumb defaults: "Inicio"/"Home", "Atrás"/"Back", aria-label "Migas de pan"/"Breadcrumb".
- BaseLayout skip-link ("Saltar al contenido"/"Skip to content"), default meta description.
- LanguageSwitcher labels + aria-labels.
- Universal CTA verbs that appear on most pages: "Saber más"/"Learn more", "Conoce más"/"Read more", "Colabora"/"Get involved", "Contacto"/"Contact".
- Standard error/fallback copy: 404 messages, "Volver al inicio"/"Back to home".

**Out of scope (lives in page files via Strategy B):**
- Hero copy, body prose, page-specific section titles, project descriptions, team bios, FAQs, activity descriptions, GSH program content.
- Anything that would change if the *content* of a page changed.

### 3.2 Module shape (informational — Task #3 implements)

```ts
// src/lib/i18n.ts

export type Locale = 'es' | 'en';
export const LOCALES = ['es', 'en'] as const;
export const DEFAULT_LOCALE: Locale = 'es';

/** Flat keyspace, dotted notation. Add keys only with team-lead approval. */
export type StringKey =
  | 'header.nav.about'
  | 'header.nav.research'
  | 'header.nav.programs'
  | 'header.nav.projects'
  | 'header.nav.activities'
  | 'header.nav.getInvolved'
  | 'header.aria.primaryNav'
  | 'header.aria.brandHome'   // "AI Safety Mexico — Inicio"

  | 'mobile.toggle.open'      // "Abrir menú principal"
  | 'mobile.toggle.close'     // "Cerrar menú principal"
  | 'mobile.drawer.label'     // "Menú principal"
  | 'mobile.drawer.closeBtn'  // "Cerrar menú"
  | 'mobile.nav.label'        // "Navegación principal (móvil)"

  | 'footer.col.explore'      // "Explora"
  | 'footer.col.work'         // "Trabajo"
  | 'footer.col.connect'      // "Conecta"
  | 'footer.item.home'
  | 'footer.item.about'
  | 'footer.item.team'
  | 'footer.item.activities'
  | 'footer.item.research'
  | 'footer.item.programs'
  | 'footer.item.projects'
  | 'footer.item.gsh'
  | 'footer.item.getInvolved'
  | 'footer.item.contact'
  | 'footer.tagline'
  | 'footer.copyright'        // "Todos los derechos reservados." / "All rights reserved."
  | 'footer.aria.social'

  | 'breadcrumb.home'         // "Inicio" / "Home"
  | 'breadcrumb.back'         // "Atrás" / "Back"
  | 'breadcrumb.aria'         // "Migas de pan" / "Breadcrumb"

  | 'layout.skipLink'         // "Saltar al contenido" / "Skip to content"
  | 'layout.defaultDesc'

  | 'switcher.toEs'           // "Cambiar a español"
  | 'switcher.toEn'           // "Switch to English"
  | 'switcher.label'          // aria-label on the toggle group
  | 'switcher.es'             // visible "ES"
  | 'switcher.en'             // visible "EN"

  | 'cta.learnMore'           // "Saber más" / "Learn more"
  | 'cta.readMore'            // "Leer más" / "Read more"
  | 'cta.getInvolved'         // "Colabora" / "Get involved"
  | 'cta.contact';            // "Contacto" / "Contact"

const strings: Record<Locale, Record<StringKey, string>> = {
  es: { /* … */ },
  en: { /* … */ },
};

export function t(locale: Locale, key: StringKey): string { /* … */ }

/** Returns the locale prefix used in URLs ('' for es, '/en' for en). */
export function localePrefix(locale: Locale): string {
  return locale === 'es' ? '' : '/en';
}

/** Returns the *other* locale's URL for the same logical page. Pure. */
export function switchLocalePath(currentPath: string): { locale: Locale; href: string } {
  // Strip leading '/en' if present; the rest is the canonical (es) path.
  if (currentPath === '/en' || currentPath.startsWith('/en/')) {
    const rest = currentPath.slice(3) || '/';
    return { locale: 'es', href: rest };
  }
  const rest = currentPath === '/' ? '' : currentPath;
  return { locale: 'en', href: `/en${rest}` };
}

/** Derive locale from the current URL pathname (for components that don't get it as a prop). */
export function localeFromPath(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'es';
}

/** Build absolute hreflang pairs for a given logical path. */
export function hreflangAlternates(pathname: string, site: URL): {
  es: string; en: string; xDefault: string;
} {
  const { href: other } = switchLocalePath(pathname);
  const current = pathname;
  const isEn = localeFromPath(pathname) === 'en';
  const esPath = isEn ? other : current;
  const enPath = isEn ? current : other;
  return {
    es: new URL(esPath, site).toString(),
    en: new URL(enPath, site).toString(),
    xDefault: new URL(esPath, site).toString(),
  };
}
```

### 3.3 Component touch-up plan (Phase 2 — informs #3 + #4)

These components must be updated to read from `i18n.ts` instead of hard-coding Spanish:

- `Header.astro` — accept `lang` prop (default `'es'`); pass localized nav items to `<Nav>`; localize `aria-label` on brand link.
- `Nav.astro` — drop `DEFAULT_ITEMS`. Take `lang` prop, build items from `t()` calls. Localize `aria-label="Navegación principal"`.
- `MobileMenu.astro` — take `lang` prop. Localize toggle aria-labels (initial + open state) and the inline script's swapped label (`'Cerrar menú principal'` → `t(lang, 'mobile.toggle.close')`). The script needs the localized strings injected via data-attributes on the toggle, e.g. `data-label-open` / `data-label-close`, to keep the JS locale-agnostic.
- `Footer.astro` — take `lang` prop. Localize column headings, items, tagline, copyright, social aria-label.
- `Breadcrumb.astro` — accept `lang`; use `t(lang, 'breadcrumb.aria')` for the nav aria-label and `t(lang, 'breadcrumb.back')` as the default `backLabel`. The first item's label (currently passed by each page as `'Inicio'`) becomes `t(lang, 'breadcrumb.home')`. **Pages must update their breadcrumb usage in #5–#8.**
- `BaseLayout.astro` — accept `pathname` as currently does; add `<LanguageSwitcher>` is wired via Header (not here). Localize the skip-link text via `t(lang, 'layout.skipLink')`. Emit hreflang triples (see §1).

---

## 4. LanguageSwitcher — pixel spec

### 4.1 Location & visual

- **Lives inside `<Header>`**, rendered as the **last child** of `.site-header__inner`, *to the right of `<Nav>`* on desktop (≥1024px).
- On tablet/mobile (<1024px) where `<Nav>` collapses into the hamburger drawer, the switcher remains **inline in the header bar**, immediately *left* of the hamburger toggle. It does **not** move into the drawer. Reason: language is a meta-control, not a navigation destination, and keeping it visible at all viewports prevents the "I'm stuck in the wrong language" UX trap.

### 4.2 UI specification

Visual format: **`ES | EN`**, a two-segment toggle. Minimal, no chip background, no border.

```
┌─────────────────────────────────────────────────────────────┐
│  [logo] AI SAFETY MEXICO    [nav links]      ES | EN   [☰]  │
└─────────────────────────────────────────────────────────────┘
```

Markup:
```html
<div class="lang-switcher" role="group" aria-label="Idioma / Language">
  <a class="lang-switcher__option is-active"
     href="/about"
     hreflang="es"
     lang="es"
     aria-current="true">ES</a>
  <span class="lang-switcher__sep" aria-hidden="true">|</span>
  <a class="lang-switcher__option"
     href="/en/about"
     hreflang="en"
     lang="en">EN</a>
</div>
```

Styles (numbers normative for Task #4):
- Container: `display: inline-flex; align-items: center; gap: 6px; margin-left: 12px;` (8px on `<1024px`).
- Option `<a>`:
  - `font-family: var(--font-body); font-size: 0.85rem; font-weight: 600; letter-spacing: 0.04em;`
  - `padding: 4px 6px; border-radius: 4px;`
  - Inactive color: `var(--color-text-on-dark-muted)`.
  - Active state (`.is-active`): color `var(--color-text-on-dark)`, weight `700`. **No background fill, no underline.** Active is signaled by weight + opacity contrast only — consistent with the editorial restraint of the rest of the chrome.
  - Hover (inactive only): color → `var(--color-text-on-dark)`; no background.
  - `:focus-visible`: `outline: 2px solid var(--color-accent-secondary); outline-offset: 2px; border-radius: 4px;` (matches Header's focus pattern).
- Separator `|`: `color: var(--color-border-on-dark); user-select: none; font-size: 0.85rem;`.
- A11y:
  - Container `role="group" aria-label="Idioma / Language"` (bilingual label — switcher is the one chrome element where bilingual aria copy is justifiable since it serves both audiences).
  - Active option has `aria-current="true"`. The non-active option has `hreflang` set so screen readers announce the destination language.
  - Both options carry the `lang` attribute matching their target language so AT pronounces "ES" and "EN" correctly.

### 4.3 Behavior (pixel-by-pixel)

1. **Active marking.** The switcher receives `currentPath` from its parent (`<Header>`). It computes the active locale with `localeFromPath(currentPath)` and applies `.is-active` + `aria-current` to that option.
2. **Click on the inactive option.** Performs a **plain anchor navigation** to `switchLocalePath(currentPath).href` — no JS click handler intercepts. Anchor is `<a href="…">`, not a button. This makes the switcher work without JS, opens-in-new-tab via middle-click, and is bookmarkable.
3. **Path preservation.** `/about` ↔ `/en/about`, `/projects/vigia` ↔ `/en/projects/vigia`, `/` ↔ `/en`. The function in §3.2 is the single source of truth.
4. **localStorage write.** A small inline script attached to the switcher writes the *target* locale to `localStorage` **before** the navigation completes:
   ```html
   <script is:inline>
     document.querySelectorAll('.lang-switcher__option').forEach((a) => {
       a.addEventListener('click', () => {
         try { localStorage.setItem('aismx_locale', a.getAttribute('hreflang')); } catch (e) {}
       });
     });
   </script>
   ```
   Click event fires before navigation; even if `localStorage` is blocked (private mode, quota), navigation still proceeds because we never `preventDefault`.
5. **No flash.** Because navigation is a full page load, there is no FOUC. The destination page renders with the correct `<html lang>` from the start.
6. **Scroll position.** Not preserved (a hard navigation resets scroll). Acceptable — the equivalent page in the other language has the same scroll anchors and the user lands at the top of the translated content.

### 4.4 Component skeleton (input for Task #4)

```astro
---
// src/components/LanguageSwitcher.astro
import { localeFromPath, switchLocalePath, t } from '../lib/i18n';

export interface Props { currentPath: string }
const { currentPath } = Astro.props;
const active = localeFromPath(currentPath);
const { href: other } = switchLocalePath(currentPath);
const esHref = active === 'es' ? currentPath : other;
const enHref = active === 'en' ? currentPath : other;
---
<div class="lang-switcher" role="group" aria-label="Idioma / Language">
  <a class:list={['lang-switcher__option', { 'is-active': active === 'es' }]}
     href={esHref} hreflang="es" lang="es"
     aria-current={active === 'es' ? 'true' : undefined}
     aria-label={t(active, 'switcher.toEs')}>ES</a>
  <span class="lang-switcher__sep" aria-hidden="true">|</span>
  <a class:list={['lang-switcher__option', { 'is-active': active === 'en' }]}
     href={enHref} hreflang="en" lang="en"
     aria-current={active === 'en' ? 'true' : undefined}
     aria-label={t(active, 'switcher.toEn')}>EN</a>
</div>

<script is:inline>
  (() => {
    if (window.__aismxLangSwitcherBound) return;
    window.__aismxLangSwitcherBound = true;
    const bind = () => {
      document.querySelectorAll('.lang-switcher__option').forEach((a) => {
        a.addEventListener('click', () => {
          try { localStorage.setItem('aismx_locale', a.getAttribute('hreflang')); } catch (e) {}
        });
      });
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bind);
    } else { bind(); }
  })();
</script>
```

Styles per §4.2; omitted here for brevity (Task #4 transcribes).

### 4.5 Integration into Header

`Header.astro` currently does:
```astro
<Nav currentPath={currentPath} items={navItems} />
```

After Task #4 it becomes:
```astro
<Nav currentPath={currentPath} items={navItems} lang={lang} />
<LanguageSwitcher currentPath={currentPath} />
```

The flex container `.site-header__inner` already uses `justify-content: space-between` with the brand on one side and a single nav cluster on the other; wrap `<Nav>` + `<LanguageSwitcher>` in a `<div class="site-header__cluster">` with `display: inline-flex; align-items: center; gap: 12px;` so they sit together on the right.

---

## 5. Automatic browser-language detection

### 5.1 Behavior contract (exact)

The detection script:
1. Runs **only on the Spanish home page (`/`)**. On every other URL — including `/en`, every deep link, and any locale's interior page — it is a no-op. Rationale: a visitor following a shared link wants the page they were sent, not a surprise redirect.
2. Reads `localStorage.getItem('aismx_locale')`. If present (`'es'` or `'en'`), it **does not redirect** — the user has already expressed a preference (either via the switcher or a previous detection). This makes the detection a one-shot first-visit experience.
3. If no preference exists, reads `navigator.language` (or first entry of `navigator.languages`). If the value matches `/^en\b/i` (i.e. `en`, `en-US`, `en-GB`, `en-AU`, …), the script:
   - Writes `localStorage.setItem('aismx_locale', 'en')` (prevents future redirects on this device).
   - Replaces the URL with `/en` via `location.replace('/en')` (uses `replace`, not `assign`, so the user's back button doesn't loop them back to `/`).
4. If the language is anything else (`es-MX`, `es-ES`, `pt-BR`, `fr-FR`, `de-DE`, …), the script writes `localStorage.setItem('aismx_locale', 'es')` and does nothing else. Spanish is the default and the appropriate fallback for the global-south audience (more aligned with our mission than English).

Edge cases handled:
- **localStorage disabled / quota exceeded**: script `try/catch`s every storage access; if storage fails, it skips the write but the redirect still works (the user just gets re-detected on the next visit, which is acceptable).
- **JS disabled**: no redirect happens; Spanish home renders normally. Acceptable: detection is a progressive enhancement, not a correctness requirement.
- **Search-engine crawlers**: bots typically don't execute JS-driven redirects and don't carry an `en` `navigator.language`. They'll index `/` as Spanish and `/en` as English via the hreflang pairs — exactly what we want.
- **Pre-rendered HTML**: because the script lives inline, there is a flash-of-Spanish-content for ~50–200ms before the redirect fires. Mitigation: the script is placed **at the top of `<head>`**, *before* fonts and CSS, and uses `location.replace` synchronously. For a static-host site this is the accepted trade-off; the only way to eliminate the flash is server-side `Accept-Language` redirects, which GitHub Pages cannot do.

### 5.2 Where the script lives

`BaseLayout.astro`, immediately after `<meta name="viewport">` and before any `<link>` tags. It is conditional on `pathname === '/'` (so on every other page Astro renders nothing into the document, not even an empty `<script>`):

```astro
{pathname === '/' && (
  <script is:inline>{`
    (function () {
      try {
        var stored = null;
        try { stored = localStorage.getItem('aismx_locale'); } catch (e) {}
        if (stored === 'es' || stored === 'en') return;

        var nav = (navigator.languages && navigator.languages[0]) || navigator.language || '';
        var prefersEn = /^en\\b/i.test(nav);

        if (prefersEn) {
          try { localStorage.setItem('aismx_locale', 'en'); } catch (e) {}
          location.replace('/en');
        } else {
          try { localStorage.setItem('aismx_locale', 'es'); } catch (e) {}
        }
      } catch (e) { /* swallow */ }
    })();
  `}</script>
)}
```

Notes:
- `is:inline` keeps Astro from bundling it and ensures it executes synchronously in the document order.
- The regex `^en\b` matches the BCP47 language subtag boundary, so `en`, `en-US`, `en_GB` all match while `eng-fake` or `englishsomething` do not.
- Double-escaped `\\b` because the script is inside a template literal.

### 5.3 What detection deliberately does **not** do

- It does not run on `/en` (where, if a user landed there, they're already where they want to be — and the switcher's localStorage write covers the round-trip).
- It does not run on any interior page. Deep-linking integrity is non-negotiable.
- It does not display a banner offering English ("It looks like you speak English — switch?"). The switcher in the header is always visible and always one click away. Banners are noisy and frequently dismissed without effect.

---

## 6. Fallback plan: missing translations

**Policy: every published page exists in both locales. Period.** There is no graceful fallback mode at runtime.

Specifically:
- If a Spanish page exists and the English counterpart does not yet exist (in-progress translation), the **English URL returns the site 404 page**, not a redirect to Spanish. Reason: silently routing a user to a different language is a worse UX than an honest 404, *and* it pollutes analytics with cross-locale sessions.
- The site 404 page is rendered as `src/pages/404.astro` (Spanish) plus `src/pages/en/404.astro` (English). Each is locale-correct and links back to its own home + a list of top destinations. The English 404 carries an "Esta página no está disponible en inglés. Ver en español →" link (and the Spanish 404 carries the mirror).
- Astro on GitHub Pages serves `404.html` automatically when a path is missing. We rely on whatever 404.html sits at the root (Astro builds `src/pages/404.astro` → `404.html`). The English `/en/404.astro` builds to `/en/404/index.html`; **this is not served automatically by GitHub Pages.** Acceptable: the Spanish 404 is what users hit, and it links to the English home.
- **Hard rule for QA (#9, #10):** if Playwright finds an English link that 404s, the build is broken — fix the missing translation, do not paper over with a redirect.

The translator tasks (#5–#8) collectively cover all 12 routes (see §7), so there should be no missing pages by the time Phase 4 QA runs.

---

## 7. Pages to translate (definitive list — 12)

Translator assignment is in TaskList; this is the canonical inventory.

| # | ES path | EN path | Owner task |
|---|---|---|---|
| 1 | `/` | `/en` | #5 translator-1 |
| 2 | `/about` | `/en/about` | #5 translator-1 |
| 3 | `/research` | `/en/research` | #5 translator-1 |
| 4 | `/programs` | `/en/programs` | #6 translator-2 |
| 5 | `/team` | `/en/team` | #6 translator-2 |
| 6 | `/projects` | `/en/projects` | #7 translator-3 |
| 7 | `/projects/vigia` | `/en/projects/vigia` | #7 translator-3 |
| 8 | `/projects/ai-safety-connect` | `/en/projects/ai-safety-connect` | #7 translator-3 |
| 9 | `/activities` | `/en/activities` | #8 translator-4 |
| 10 | `/get-involved` | `/en/get-involved` | #8 translator-4 |
| 11 | `/contact` | `/en/contact` | #8 translator-4 |
| 12 | `/global-south-challenge` | `/en/global-south-challenge` | #8 translator-4 |

Translator deliverable per page (mandatory):
1. New `src/pages/en/<slug>.astro` file mirroring the Spanish sibling structurally.
2. `<BaseLayout lang="en" pathname="/en/<slug>" title="…" description="…">`.
3. `<Header slot="header" currentPath="/en/<slug>" lang="en" />` and `<Footer slot="footer" lang="en" />`.
4. Breadcrumb's first item: `{ label: t('en', 'breadcrumb.home'), href: '/en' }`.
5. All chrome strings via `t('en', …)`. No hard-coded English strings outside the page body.
6. Same images, same component composition, same CTA structure — only prose changes.
7. Translation register: editorial English, no idiomatic Spanish carry-overs, lowercase month names ("March 2026" not "Marzo 2026"), `en-US` number formatting.
8. Confirm the page builds with `npm run check` before marking task complete.

---

## 8. Handoff to Phase 2

### Task #2 — astro-i18n-config
- Apply the `i18n` block in §1 to `astro.config.mjs`.
- Update sitemap config to emit hreflang.
- Verify `npm run build` succeeds and produces `dist/en/index.html`.

### Task #3 — i18n-strings
- Create `src/lib/i18n.ts` with the shape in §3.2 (all 40+ keys filled in for both locales).
- Refactor `Header`, `Nav`, `MobileMenu`, `Footer`, `Breadcrumb`, `BaseLayout` to accept a `lang` prop and consume `t()` for chrome strings.
- Update `Header` to default `lang='es'` (so existing Spanish pages keep building unchanged), and thread `lang` to `Nav`, `MobileMenu`, `LanguageSwitcher`.
- For MobileMenu's JS: emit `data-label-open` / `data-label-close` on the toggle button; have the inline script read those instead of the hard-coded strings.

### Task #4 — switcher-and-detection
- Build `src/components/LanguageSwitcher.astro` per §4.4 with the styles in §4.2.
- Wire it into `Header` per §4.5.
- Add the detection script to `BaseLayout` per §5.2.
- The Spanish chrome can still render before the strings module exists (defaults), but #4 should land *after* #3 to avoid double work.

### Phase 2 is parallelizable
- #2, #3, #4 can run concurrently. #2 is pure config; #3 is strings + chrome props; #4 is one new component + one inline script. They touch disjoint files except for `Header.astro` (lightly shared between #3 and #4) — coordinate that one file via the i18n branch.

### Phase 3 unblock criteria
- Translators (#5–#8) start once **all three** of #2/#3/#4 are merged. They depend on:
  - The router emitting `/en/...` URLs (from #2),
  - The chrome rendering localized strings (from #3),
  - The switcher being present so translators can visually validate their work (from #4).

---

## 9. Open questions (none blocking Phase 2)

- Q: Translate URL slugs (e.g. `/en/equipo` → `/en/team`)? **No** — see §1, decided.
- Q: Add `pt` or other locales? **Out of scope v1.** The architecture (file naming + `i18n.ts` module + sibling pages) generalizes cleanly; adding a third locale is mechanical.
- Q: Use Astro Content Collections for translatable copy in a future v2? **Possible.** The current design does not preclude it — a page can opt into reading from `src/content/<locale>/...` without affecting the rest of the site.

---

End of architecture spec.
