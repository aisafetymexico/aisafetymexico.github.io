// Heuristic analyzer for the captured i18n screenshots/text.
// Reads playwright/i18n/index.json and flags untranslated strings on /en/* pages.
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve('playwright/i18n');
const data = JSON.parse(await fs.readFile(path.join(ROOT, 'index.json'), 'utf8'));

// Spanish-only stop-words / function words that should NEVER appear in /en/* body.
// Kept conservative: pure-Spanish tokens that have no English collisions.
const SPANISH_MARKERS = [
  /\bnosotros\b/i,
  /\bnuestra?s?\b/i,
  /\bsobre\b/i,
  /\binvestigaci(ó|o)n\b/i,
  /\bequipo\b/i,
  /\bcolabora(r|ci(ó|o)n)?\b/i,
  /\bcontacto\b/i,
  /\binicio\b/i,
  /\bsaltar al contenido\b/i,
  /\bmigas de pan\b/i,
  /\batr(á|a)s\b/i,
  /\babrir men(ú|u)\b/i,
  /\bcerrar men(ú|u)\b/i,
  /\bnavegaci(ó|o)n\b/i,
  /\bidioma\b/i,
  /\bcambiar a espa(ñ|n)ol\b/i,
  /\bsaber m(á|a)s\b/i,
  /\bleer m(á|a)s\b/i,
  /\bvolver al inicio\b/i,
  /\btodos los derechos reservados\b/i,
  /\binvestigaci(ó|o)n, educaci(ó|o)n y gobernanza\b/i,
  /\bredes sociales\b/i,
  /\bm(é|e)xico (es|tiene|cuenta)\b/i, // typical body intros
  /\bproyectos?\b/i,
  /\bprogramas?\b/i,
  /\bactividades\b/i,
  /\bmiembros\b/i,
  /\bact(ú|u)a\b/i,
];

// Specific allowed loanwords/proper nouns in EN: keep this short.
const EN_ALLOW = [
  /\bAI Safety Mexico\b/, // brand
  /\bAI Safety Connect\b/, // project name
  /\bVIG[ÍI]A\b/, // project name
  /\bGlobal South\b/,
  /\bIdioma \/ Language\b/, // switcher tooltip is intentionally bilingual
];

function maskAllowed(text) {
  let out = text;
  for (const re of EN_ALLOW) out = out.replace(re, '____');
  return out;
}

const summary = [];

for (const entry of data) {
  const issues = [];
  const isEn = entry.locale === 'en';
  const isEs = entry.locale === 'es';

  // 1. status
  if (entry.status !== 200) issues.push(`HTTP ${entry.status}`);

  // 2. html lang attr matches locale
  if (entry.htmlLang && entry.htmlLang.toLowerCase().split('-')[0] !== entry.locale) {
    issues.push(`html[lang]="${entry.htmlLang}" ≠ ${entry.locale}`);
  }

  // 3. switcher visible
  if (!entry.switcherCount || entry.switcherCount < 1) {
    issues.push('LanguageSwitcher not detected');
  }

  // 4. hreflang alternates present
  if (!entry.hreflangLinks || entry.hreflangLinks.length < 2) {
    issues.push(
      `hreflang alternates missing (found ${entry.hreflangLinks?.length ?? 0})`,
    );
  } else {
    const langs = entry.hreflangLinks.map((l) => l.hreflang);
    if (!langs.includes('es') && !langs.includes('es-MX'))
      issues.push('hreflang es missing');
    if (!langs.includes('en') && !langs.includes('en-US'))
      issues.push('hreflang en missing');
  }

  // 5. untranslated Spanish strings on /en/*
  if (isEn) {
    const masked = maskAllowed(
      [entry.headerText, entry.footerText, entry.bodyText].filter(Boolean).join('\n'),
    );
    const hits = new Set();
    for (const re of SPANISH_MARKERS) {
      const m = masked.match(re);
      if (m) hits.add(m[0]);
    }
    if (hits.size > 0) {
      issues.push(`Spanish markers: ${[...hits].slice(0, 8).join(', ')}`);
    }
  }

  // 6. /es/* should NOT show "Skip to content" or "Get involved" (chrome leak)
  if (isEs) {
    const masked = [entry.headerText, entry.footerText, entry.bodyText]
      .filter(Boolean)
      .join('\n');
    const enChromeLeaks = [
      /\bSkip to content\b/i,
      /\bGet involved\b/i,
      /\bAbout us\b/i,
      /\bMain menu\b/i,
      /\bBack to home\b/i,
      /\bLearn more\b/i,
      /\bRead more\b/i,
    ]
      .map((re) => masked.match(re)?.[0])
      .filter(Boolean);
    if (enChromeLeaks.length) {
      issues.push(`EN chrome leak: ${[...new Set(enChromeLeaks)].join(', ')}`);
    }
  }

  // 7. <title> should not be empty
  if (!entry.title || entry.title.trim() === '') {
    issues.push('empty <title>');
  }

  summary.push({ ...entry, issues });
}

await fs.writeFile(
  path.join(ROOT, 'analysis.json'),
  JSON.stringify(summary, null, 2),
);

// Pretty-print a compact table.
console.log(
  '\n' +
    'locale slug                                status switcher hreflang issues',
);
for (const s of summary) {
  const hf = s.hreflangLinks?.length ?? 0;
  console.log(
    `${s.locale.padEnd(6)} ${s.slug.padEnd(34)} ${String(s.status).padEnd(6)} ${String(s.switcherCount ?? 0).padEnd(8)} ${String(hf).padEnd(8)} ${s.issues.join(' | ') || '—'}`,
  );
}

const total = summary.length;
const withIssues = summary.filter((s) => s.issues.length).length;
console.log(`\n${withIssues}/${total} routes with issues`);
