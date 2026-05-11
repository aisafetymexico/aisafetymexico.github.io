# AI Safety Mexico

Sitio oficial de AI Safety Mexico — organización mexicana sin fines de lucro dedicada a la investigación, educación y políticas sobre seguridad y alineación de la inteligencia artificial. Publicado en [www.aismx.org](https://www.aismx.org).

## Stack y arquitectura

- **Framework**: Astro 5 (output estático SSG)
- **Lenguajes**: TypeScript en modo strict, Astro components, vanilla CSS con design tokens
- **Tipografía**: Playfair Display (display) + Inter (texto), escalas fluidas con `clamp()`
- **i18n**: Español por defecto en `/`, inglés en `/en/`. LanguageSwitcher en header + detección automática de `navigator.language` en primera visita.
- **SEO**: `@astrojs/sitemap` con alternates hreflang, `robots.txt`, metadata canonical por página
- **QA**: Suites de Playwright (visual, funcional, accesibilidad, performance/SEO)
- **Hosting**: GitHub Pages con dominio personalizado (`CNAME` en `public/`)
- **Deploy**: GitHub Actions (`.github/workflows/deploy.yml`) en cada push a `main`

## Estructura del proyecto

```
src/
  pages/              Páginas Astro. Español en raíz, inglés en pages/en/
  components/         Componentes reusables (Hero, Card variants, Header, Nav,
                      MobileMenu, LanguageSwitcher, Footer, etc.)
  layouts/            BaseLayout.astro — chrome compartido + hreflang + detección
                      de idioma del navegador
  content/            Content collections (publications, projects) con schemas Zod
  lib/i18n.ts         Strings compartidos del chrome y helpers (t,
                      switchLocalePath, hreflangAlternates)
  styles/             tokens.css (paleta, tipografía, espaciado) + base.css
public/               Assets estáticos (images, Papers, CNAME, robots.txt)
docs/                 Documentación interna (ARCHITECTURE, DESIGN-SYSTEM,
                      I18N-ARCHITECTURE, reportes de QA)
playwright/           Suites de QA automatizado
.github/workflows/    Pipeline de deploy a GitHub Pages
```

## Desarrollo local

**Prerequisitos**: Node.js 22+ (mismo runtime que el workflow de CI).

```bash
npm install            # Instalar dependencias
npm run dev            # Servidor de desarrollo en http://localhost:4321
npm run build          # Build estático a dist/
npm run preview        # Previsualizar el build de producción
npm run check          # Type-check con astro check
```

## i18n

- **Español** es el idioma por defecto y vive en `/` (sin prefijo) para preservar URLs canónicas.
- **Inglés** vive en `/en/` y refleja cada slug del español (mismos paths, sin slugs traducidos).
- El **LanguageSwitcher** en el header permite alternar manualmente; la primera visita aplica una detección suave basada en `navigator.language`.
- El chrome compartido (nav, footer, etc.) lee strings desde `src/lib/i18n.ts`.

**Añadir una página nueva**:

1. Crear el archivo en `src/pages/<slug>.astro` (versión en español).
2. Crear el equivalente en `src/pages/en/<slug>.astro` (mismo slug, contenido en inglés).
3. Agregar las strings de chrome necesarias en `src/lib/i18n.ts` si aplica.
4. Verificar con `npm run build` que ambas rutas se emiten y que los alternates hreflang quedan correctos.

No hay `fallback` configurado a propósito: una página inglesa faltante surfacea como 404 en QA en lugar de enmascararse silenciosamente. Ver `docs/I18N-ARCHITECTURE.md` para detalles.

## Deployment

Cada push a `main` dispara `.github/workflows/deploy.yml`, que ejecuta `npm run build` y publica `dist/` a GitHub Pages. Tiempo aproximado de propagación: ~3 minutos desde el merge hasta www.aismx.org actualizado.

**Configuración requerida en GitHub Pages**:

- Settings -> Pages -> Source debe estar en **GitHub Actions** (no "Deploy from a branch").
- El dominio personalizado `www.aismx.org` se sirve vía el archivo `public/CNAME`.

## Flujo de contribución

Trabajamos PR-first sobre `main`. No pushear directo a `main` salvo hotfixes coordinados.

```bash
# 1. Partir de main al día
git checkout main
git pull

# 2. Crear un feature branch descriptivo
git checkout -b feature/<nombre-corto-descriptivo>

# 3. Hacer cambios locales y probar
npm run dev
npm run build          # debe quedar verde antes de subir

# 4. Commit y push
git add <archivos>
git commit -m "Mensaje claro en imperativo"
git push -u origin feature/<nombre-corto-descriptivo>

# 5. Abrir un Pull Request en GitHub apuntando a main
# 6. Review + merge -> deploy automático en ~3 min
```

**Política de review**:

- Cambios menores de copy o contenido: una persona puede aprobar y mergear (auto-merge OK).
- Cambios estructurales (componentes, design tokens, i18n, layouts): idealmente dos ojos.
- Branch protection no está configurado todavía; la disciplina PR-first es por convención.

**Convención de nombres de branch**: `feature/<descripcion>`, `fix/<descripcion>`, `content/<descripcion>`.

## Documentación interna

Para quien quiera profundizar en decisiones de diseño o arquitectura:

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — visión general del sistema
- [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) — tokens, tipografía, componentes
- [`docs/I18N-ARCHITECTURE.md`](docs/I18N-ARCHITECTURE.md) — estrategia bilingüe en detalle
- [`docs/`](docs/) — reportes de QA (visual, accesibilidad, performance, SEO, i18n)

## Contacto

Escríbenos a [contact@aismx.org](mailto:contact@aismx.org).
