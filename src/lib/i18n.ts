/**
 * Shared chrome strings for the bilingual AI Safety Mexico site.
 *
 * Source-of-truth: docs/I18N-ARCHITECTURE.md §3.
 *
 * Scope:
 *  - Header / Nav / MobileMenu labels & aria-labels.
 *  - Footer columns, items, tagline, copyright, social aria-label.
 *  - Breadcrumb defaults (home / back / aria).
 *  - BaseLayout skip-link, default meta description.
 *  - LanguageSwitcher labels + aria-labels.
 *  - Universal CTA verbs that repeat across pages.
 *
 * Out of scope (lives in sibling page files — Strategy B):
 *  - Hero copy, body prose, page-specific titles, project descriptions, etc.
 *
 * Add keys only with team-lead approval. Keep the `StringKey` union and
 * `strings` table in sync — TypeScript will error if a locale is missing a key.
 */

export type Locale = 'es' | 'en';

export const LOCALES = ['es', 'en'] as const;
export const DEFAULT_LOCALE: Locale = 'es';

/** Flat keyspace, dotted notation. */
export type StringKey =
  // Header / Nav -------------------------------------------------------------
  | 'header.nav.about'
  | 'header.nav.research'
  | 'header.nav.programs'
  | 'header.nav.projects'
  | 'header.nav.activities'
  | 'header.nav.getInvolved'
  | 'header.aria.primaryNav'
  | 'header.aria.brandHome'

  // Mobile drawer ------------------------------------------------------------
  | 'mobile.toggle.open'
  | 'mobile.toggle.close'
  | 'mobile.drawer.label'
  | 'mobile.drawer.closeBtn'
  | 'mobile.nav.label'

  // Footer -------------------------------------------------------------------
  | 'footer.col.explore'
  | 'footer.col.work'
  | 'footer.col.connect'
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
  | 'footer.copyright'
  | 'footer.aria.social'
  | 'footer.aria.brandHome'

  // Breadcrumb ---------------------------------------------------------------
  | 'breadcrumb.home'
  | 'breadcrumb.back'
  | 'breadcrumb.aria'

  // Layout / global ----------------------------------------------------------
  | 'layout.skipLink'
  | 'layout.defaultDesc'

  // Accessibility ------------------------------------------------------------
  | 'a11y.skipToContent'

  // Publications -------------------------------------------------------------
  | 'pub.readPaper'
  | 'pub.listenPodcast'

  // Language switcher --------------------------------------------------------
  | 'switcher.toEs'
  | 'switcher.toEn'
  | 'switcher.label'
  | 'switcher.es'
  | 'switcher.en'

  // Universal CTA verbs ------------------------------------------------------
  | 'cta.learnMore'
  | 'cta.readMore'
  | 'cta.getInvolved'
  | 'cta.contact'
  | 'cta.backHome';

const strings: Record<Locale, Record<StringKey, string>> = {
  es: {
    // Header / Nav
    'header.nav.about': 'Sobre nosotros',
    'header.nav.research': 'Investigación',
    'header.nav.programs': 'Programas',
    'header.nav.projects': 'Proyectos',
    'header.nav.activities': 'Actividades',
    'header.nav.getInvolved': 'Colabora',
    'header.aria.primaryNav': 'Navegación principal',
    'header.aria.brandHome': 'AI Safety Mexico — Inicio',

    // Mobile drawer
    'mobile.toggle.open': 'Abrir menú principal',
    'mobile.toggle.close': 'Cerrar menú principal',
    'mobile.drawer.label': 'Menú principal',
    'mobile.drawer.closeBtn': 'Cerrar menú',
    'mobile.nav.label': 'Navegación principal (móvil)',

    // Footer
    'footer.col.explore': 'Explora',
    'footer.col.work': 'Trabajo',
    'footer.col.connect': 'Conecta',
    'footer.item.home': 'Inicio',
    'footer.item.about': 'Sobre nosotros',
    'footer.item.team': 'Equipo',
    'footer.item.activities': 'Actividades',
    'footer.item.research': 'Investigación',
    'footer.item.programs': 'Programas',
    'footer.item.projects': 'Proyectos',
    'footer.item.gsh': 'Global South Challenge',
    'footer.item.getInvolved': 'Colabora',
    'footer.item.contact': 'Contacto',
    'footer.tagline': 'Investigación, educación y gobernanza de IA en México.',
    'footer.copyright': 'Todos los derechos reservados.',
    'footer.aria.social': 'Redes sociales',
    'footer.aria.brandHome': 'AI Safety Mexico — Inicio',

    // Breadcrumb
    'breadcrumb.home': 'Inicio',
    'breadcrumb.back': 'Atrás',
    'breadcrumb.aria': 'Migas de pan',

    // Layout
    'layout.skipLink': 'Saltar al contenido',
    'layout.defaultDesc':
      'AI Safety Mexico — investigación, educación y gobernanza para una IA segura.',

    // Accessibility
    'a11y.skipToContent': 'Saltar al contenido',

    // Publications
    'pub.readPaper': 'Leer paper',
    'pub.listenPodcast': 'Escuchar podcast',

    // Language switcher
    'switcher.toEs': 'Cambiar a español',
    'switcher.toEn': 'Switch to English',
    'switcher.label': 'Idioma / Language',
    'switcher.es': 'ES',
    'switcher.en': 'EN',

    // Universal CTA verbs
    'cta.learnMore': 'Conocer más',
    'cta.readMore': 'Leer más',
    'cta.getInvolved': 'Colabora',
    'cta.contact': 'Contacto',
    'cta.backHome': 'Volver al inicio',
  },

  en: {
    // Header / Nav
    'header.nav.about': 'About us',
    'header.nav.research': 'Research',
    'header.nav.programs': 'Programs',
    'header.nav.projects': 'Projects',
    'header.nav.activities': 'Activities',
    'header.nav.getInvolved': 'Get involved',
    'header.aria.primaryNav': 'Primary navigation',
    'header.aria.brandHome': 'AI Safety Mexico — Home',

    // Mobile drawer
    'mobile.toggle.open': 'Open main menu',
    'mobile.toggle.close': 'Close main menu',
    'mobile.drawer.label': 'Main menu',
    'mobile.drawer.closeBtn': 'Close menu',
    'mobile.nav.label': 'Primary navigation (mobile)',

    // Footer
    'footer.col.explore': 'Explore',
    'footer.col.work': 'Work',
    'footer.col.connect': 'Connect',
    'footer.item.home': 'Home',
    'footer.item.about': 'About us',
    'footer.item.team': 'Team',
    'footer.item.activities': 'Activities',
    'footer.item.research': 'Research',
    'footer.item.programs': 'Programs',
    'footer.item.projects': 'Projects',
    'footer.item.gsh': 'Global South Challenge',
    'footer.item.getInvolved': 'Get involved',
    'footer.item.contact': 'Contact',
    'footer.tagline': 'AI safety research, education, and governance in Mexico.',
    'footer.copyright': 'All rights reserved.',
    'footer.aria.social': 'Social media',
    'footer.aria.brandHome': 'AI Safety Mexico — Home',

    // Breadcrumb
    'breadcrumb.home': 'Home',
    'breadcrumb.back': 'Back',
    'breadcrumb.aria': 'Breadcrumb',

    // Layout
    'layout.skipLink': 'Skip to content',
    'layout.defaultDesc':
      'AI Safety Mexico — research, education, and governance for safe AI.',

    // Accessibility
    'a11y.skipToContent': 'Skip to content',

    // Publications
    'pub.readPaper': 'Read paper',
    'pub.listenPodcast': 'Listen to podcast',

    // Language switcher
    'switcher.toEs': 'Cambiar a español',
    'switcher.toEn': 'Switch to English',
    'switcher.label': 'Idioma / Language',
    'switcher.es': 'ES',
    'switcher.en': 'EN',

    // Universal CTA verbs
    'cta.learnMore': 'Learn more',
    'cta.readMore': 'Read more',
    'cta.getInvolved': 'Get involved',
    'cta.contact': 'Contact',
    'cta.backHome': 'Back to home',
  },
};

/** Translate a key for the given locale. Throws in dev if the key is missing. */
export function t(locale: Locale, key: StringKey): string {
  const table = strings[locale] ?? strings[DEFAULT_LOCALE];
  const value = table[key];
  if (value === undefined) {
    // Surface missing keys loudly; do not silently fall back to ''.
    throw new Error(`i18n: missing key "${key}" for locale "${locale}"`);
  }
  return value;
}

/** Returns the URL prefix used for a given locale ('' for es, '/en' for en). */
export function localePrefix(locale: Locale): string {
  return locale === 'es' ? '' : '/en';
}

/** Returns the *other* locale's URL for the same logical page. Pure. */
export function switchLocalePath(currentPath: string): {
  locale: Locale;
  href: string;
} {
  // Strip leading '/en' if present; the rest is the canonical (es) path.
  if (currentPath === '/en' || currentPath.startsWith('/en/')) {
    const rest = currentPath.slice(3) || '/';
    return { locale: 'es', href: rest };
  }
  const rest = currentPath === '/' ? '' : currentPath;
  return { locale: 'en', href: `/en${rest}` };
}

/** Derive locale from a URL pathname. */
export function localeFromPath(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'es';
}

/**
 * Build an in-locale URL: prefixes `/en` for English, leaves Spanish bare.
 * Pass a leading-slash path (e.g. `/about`); root is `'/'`.
 */
export function localizedPath(locale: Locale, path: string): string {
  if (locale === 'es') return path;
  if (path === '/') return '/en';
  return `/en${path}`;
}

/** Build absolute hreflang pairs for a given logical path. */
export function hreflangAlternates(
  pathname: string,
  site: URL,
): { es: string; en: string; xDefault: string } {
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
