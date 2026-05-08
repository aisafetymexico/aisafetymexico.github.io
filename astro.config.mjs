// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// AI Safety Mexico — Astro configuration
// - Custom domain: www.aismx.org (CNAME at repo root)
// - Therefore base is '/' (NOT a project page).
// - GitHub Pages deploys the `dist/` folder produced by `astro build`.
export default defineConfig({
  site: 'https://www.aismx.org',
  base: '/',
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
  // SEO: generates /sitemap-index.xml + /sitemap-0.xml referenced by /robots.txt.
  integrations: [
    sitemap({
      changefreq: 'monthly',
      lastmod: new Date(),
    }),
  ],
  // Spanish-first per ARCHITECTURE.md §7.
  // i18n routing intentionally disabled (multi-language is out of scope v1).
  vite: {
    // Reserved for future build-time tweaks. Keep empty for now.
  },
});
