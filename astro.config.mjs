// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// AI Safety Mexico — Astro configuration
// - Custom domain: www.aismx.org (CNAME at repo root)
// - Therefore base is '/' (NOT a project page).
// - GitHub Pages deploys the `dist/` folder produced by `astro build`.
//
// i18n routing (see docs/I18N-ARCHITECTURE.md §1):
// - Spanish is the default locale at `/` (no prefix) — preserves canonical URLs.
// - English mirrors every Spanish slug under `/en/`.
// - Slugs are identical across locales (no localized slugs).
// - `prefixDefaultLocale: false` keeps Spanish at root.
// - `redirectToDefaultLocale: false` prevents Astro emitting a 307 from `/foo` to `/es/foo`.
// - No `fallback`: every page is hand-authored in both locales (Strategy B); a missing
//   English page surfaces as a 404 in QA instead of being silently masked.
export default defineConfig({
  site: 'https://www.aismx.org',
  base: '/',
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },

  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },

  // SEO: generates /sitemap-index.xml + /sitemap-0.xml referenced by /robots.txt.
  // Passing `i18n` to @astrojs/sitemap emits <xhtml:link rel="alternate" hreflang="..."/>
  // pairs once both locale URLs exist.
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es-MX',
          en: 'en-US',
        },
      },
      changefreq: 'monthly',
      lastmod: new Date(),
    }),
  ],
  vite: {
    // Reserved for future build-time tweaks. Keep empty for now.
  },
});
