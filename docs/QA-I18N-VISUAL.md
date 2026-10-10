# QA Visual i18n — 24 rutas en `es` + `en`

Owner: `visual-qa-i18n` · Task #9 · Sprint: i18n-rollout

## Cómo se ejecutó

1. `astro preview --port 5091 --host 127.0.0.1` (server estático sobre `dist/`).
2. `node playwright/i18n-shoot.mjs` — Chromium 1440×900, fullPage, dos contextos
   (`locale: es-MX` y `locale: en-US`) para que el snippet de auto-detección
   en `/` no contamine la captura del home español.
3. `node playwright/i18n-html-audit.mjs` — `fetch` directo + regex para `<html lang>`,
   `.skip-link`, `og:locale`, `rel="alternate" hreflang`, y filtración de strings
   ES → EN / EN → ES en chrome.
4. Inspección visual a las 24 PNG (énfasis en /en/* completas más spot-check de /es/*).

Outputs intermedios:
- `playwright/i18n/{locale}/{slug}-1440.png` — 24 capturas.
- `playwright/i18n/index.json` — metadatos extraídos vía Playwright (`html[lang]`,
  `title`, `headerText`, `footerText`, `bodyText`, `switcherCount`, `hreflangLinks`).
- `playwright/i18n/analysis.json` — issues heurísticos por ruta.
- `playwright/i18n/html-audit.json` — auditoría a nivel HTML.

## Resultado global

- **Build / rutas servidas:** 24/24 → HTTP 200.
- **`<html lang>`:** correcto en 24/24 (`es` en `/`, `en` en `/en/*`).
- **`og:locale`:** correcto en 24/24 (`es_MX` / `en_US`).
- **LanguageSwitcher visible y posicionado:** 24/24 (2 elementos detectados —
  header desktop + idéntico DOM en mobile drawer ocultado por CSS).
- **`<title>`:** 24/24 traducido al locale correspondiente.
- **Layout:** sin breakage estructural en 24/24. Jerarquía y grids paralelos
  entre `es` y `en` (home, projects, team, programs, activities, research,
  vigía, ai-safety-connect, get-involved, contact, GSH).
- **Switcher consistencia:** activo correcto (`is-active` + `aria-current`)
  en cada locale; mismo color y peso editorial; `href` cruzado correcto
  (`/about` ↔ `/en/about`, `/projects/vigia` ↔ `/en/projects/vigia`, `/` ↔ `/en`).

## Issues encontrados (priorizados)

| # | Severidad | Alcance | Resumen |
|---|-----------|---------|---------|
| 1 | **P0** | 24/24 rutas | Faltan `<link rel="alternate" hreflang>` en `<head>`. SEO crítico. |
| 2 | **P1** | 12/12 rutas `/en/*` | `skip-link` hardcodeado: `"Saltar al contenido"` en EN. |
| 3 | **P1** | `/en/research` | `PublicationCard` hardcodea `"Leer paper"` y `"Escuchar podcast"` (visible). |
| 4 | **P1** | `/en/projects` | `ProjectCard.ctaLabel` default = `"Conocer más"` se filtra en flagship grid. |
| 5 | **P2** | `/en/programs`, `/en/team` | `aria-label="Migas de pan"` en breadcrumb (a11y, no visible). |
| 6 | **P2** | `/en/research` | Abstract de "AI Safety in Mexico: A Pilot Survey in Yucatan" sigue en español (collection-level). |
| 7 | **P3** | inline JS de MobileMenu | Fallbacks `"Open main menu"`/`"Close main menu"` en literal JS. No user-facing (data-attrs siempre se inyectan localizados), solo code hygiene. |

### Detalle por issue

**#1 — hreflang alternates ausentes**
`src/layouts/BaseLayout.astro` no renderiza `<link rel="alternate" hreflang="es" …>` ni `hreflang="en"` ni `x-default`. El helper `hreflangAlternates(pathname, site)` en `src/lib/i18n.ts` está listo pero nunca se llama. Sitemap sí los emite vía `@astrojs/sitemap`, pero los crawlers leen del `<head>` página por página. Fix: invocar `hreflangAlternates(pathname, Astro.site)` y mapear a 3 `<link>` tags.

**#2 — skip-link**
`src/layouts/BaseLayout.astro:138` → `<a href="#main" class="skip-link">Saltar al contenido</a>`. Reemplazar el literal por `{t(lang, 'layout.skipLink')}` (importar `t` desde `../lib/i18n`).

**#3 — PublicationCard**
`src/components/PublicationCard.astro:71, 79` — strings hardcodeadas. Agregar prop `lang?: Locale` (default `'es'`), reemplazar literales por `t(lang, 'cta.readPaper')` y `t(lang, 'cta.listenPodcast')`. Falta agregar esas dos claves al keyspace en `src/lib/i18n.ts` (no existen aún). Propagar `lang="en"` desde `src/pages/en/research.astro` cuando se monta el `<PublicationCard>`.

**#4 — ProjectCard**
`src/components/ProjectCard.astro:43` → `ctaLabel = 'Conocer más'`. `src/pages/en/projects/index.astro:127-134` no pasa `ctaLabel`. Dos fixes posibles:
- (preferido) que el card acepte `lang` y use `t(lang, 'cta.learnMore')` como default; o
- pasar `ctaLabel="Learn more"` explícito desde la página EN.

**#5 — breadcrumb aria**
`src/components/PageHero.astro` recibe `lang` y lo forwardea correctamente a `<Breadcrumb>`. Pero `src/pages/en/programs.astro:97` y `src/pages/en/team.astro:152` invocan `<PageHero …/>` **sin** `lang="en"`. PageHero hace default a `es`, así que la aria queda `"Migas de pan"`. Resto de páginas EN sí pasan `lang="en"` (verificado en about, get-involved, contact, activities, research, gsh, projects/index, projects/vigia, projects/ai-safety-connect).

**#6 — Pilot Survey abstract**
El abstract del paper viene del content collection (`src/content/papers/*`). Hay sólo una versión (español). Esto es contenido autoral; depende de decisión editorial: traducir el abstract o etiquetar el paper como `lang: 'es'` y filtrar por locale. Fuera del scope técnico de las plantillas, pero documentado aquí porque es visible en `/en/research`.

**#7 — MobileMenu JS fallbacks**
`src/components/MobileMenu.astro` contiene `t.dataset.labelOpen??"Open main menu"` y `…?? "Close main menu"`. Las `data-label-open` y `data-label-close` sí se inyectan localizadas (`"Abrir menú principal"` en `/es/*`), así que estos fallbacks nunca disparan. Marca code hygiene únicamente.

## Tabla por ruta (resumen)

Leyenda: ✓ ok · ✗ issue.

### Spanish (`/`)

| Ruta | HTTP | `html[lang]` | switcher | skip-link | hreflang | Visible chrome leaks | Layout |
|------|------|--------------|----------|-----------|----------|----------------------|--------|
| `/` | 200 | es ✓ | ✓ | ✓ | ✗ #1 | — | ✓ |
| `/about` | 200 | es ✓ | ✓ | ✓ | ✗ #1 | — | ✓ |
| `/research` | 200 | es ✓ | ✓ | ✓ | ✗ #1 | — | ✓ |
| `/programs` | 200 | es ✓ | ✓ | ✓ | ✗ #1 | — | ✓ |
| `/projects` | 200 | es ✓ | ✓ | ✓ | ✗ #1 | — | ✓ |
| `/projects/vigia` | 200 | es ✓ | ✓ | ✓ | ✗ #1 | — | ✓ |
| `/projects/ai-safety-connect` | 200 | es ✓ | ✓ | ✓ | ✗ #1 | — | ✓ |
| `/team` | 200 | es ✓ | ✓ | ✓ | ✗ #1 | — | ✓ |
| `/activities` | 200 | es ✓ | ✓ | ✓ | ✗ #1 | — | ✓ |
| `/get-involved` | 200 | es ✓ | ✓ | ✓ | ✗ #1 | — | ✓ |
| `/contact` | 200 | es ✓ | ✓ | ✓ | ✗ #1 | — | ✓ |
| `/global-south-challenge` | 200 | es ✓ | ✓ | ✓ | ✗ #1 | — | ✓ |

### English (`/en/*`)

| Ruta | HTTP | `html[lang]` | switcher | skip-link | hreflang | Visible chrome leaks | Layout |
|------|------|--------------|----------|-----------|----------|----------------------|--------|
| `/en` | 200 | en ✓ | ✓ | ✗ #2 | ✗ #1 | — | ✓ |
| `/en/about` | 200 | en ✓ | ✓ | ✗ #2 | ✗ #1 | — | ✓ |
| `/en/research` | 200 | en ✓ | ✓ | ✗ #2 | ✗ #1 | "Leer paper", "Escuchar podcast" (#3); ES abstract (#6) | ✓ |
| `/en/programs` | 200 | en ✓ | ✓ | ✗ #2 | ✗ #1 | a11y aria #5 | ✓ |
| `/en/projects` | 200 | en ✓ | ✓ | ✗ #2 | ✗ #1 | "Conocer más" ×2 (#4) | ✓ |
| `/en/projects/vigia` | 200 | en ✓ | ✓ | ✗ #2 | ✗ #1 | — | ✓ |
| `/en/projects/ai-safety-connect` | 200 | en ✓ | ✓ | ✗ #2 | ✗ #1 | — | ✓ |
| `/en/team` | 200 | en ✓ | ✓ | ✗ #2 | ✗ #1 | a11y aria #5 | ✓ |
| `/en/activities` | 200 | en ✓ | ✓ | ✗ #2 | ✗ #1 | — | ✓ |
| `/en/get-involved` | 200 | en ✓ | ✓ | ✗ #2 | ✗ #1 | — | ✓ |
| `/en/contact` | 200 | en ✓ | ✓ | ✗ #2 | ✗ #1 | — | ✓ |
| `/en/global-south-challenge` | 200 | en ✓ | ✓ | ✗ #2 | ✗ #1 | — | ✓ |

## Recomendación para Task #11 (translation-editor)

Prioridad de fixes antes del native-English review:

1. Issue #1 (hreflang en BaseLayout) — bloqueante SEO.
2. Issue #2 (skip-link) — bloqueante a11y/UX (1-line fix).
3. Issues #3 y #4 — leaks visibles en `/en/research` y `/en/projects` (revisar
   strings de cards al añadir las claves `cta.readPaper`, `cta.listenPodcast`).
4. Issue #5 — 2 props `lang="en"` faltantes (1 línea cada uno).
5. Issue #6 — decisión editorial (traducir abstract o etiquetar por locale).
6. Issue #7 — opcional, no user-facing.

Una vez resueltos #1–#5, repetir `node playwright/i18n-shoot.mjs && node playwright/i18n-html-audit.mjs` para confirmar regresión a 0 leaks en chrome.
