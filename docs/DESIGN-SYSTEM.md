# AI Safety Mexico — Design System

> Sistema de diseño extraído de `css/style.css` (rama `restructure-homepage`) y formalizado para la migración a Astro.
>
> **Restricciones inviolables:**
> - **Paleta INTACTA.** Solo se permiten Navy `#1B2340`, Copper `#C4854A`, Cream `#FAF3E8`, Gold `#D4A853` y sus derivados ya existentes. No introducir hues nuevos.
> - **Tipografías INTACTAS.** Solo Playfair Display (titulares) e Inter (cuerpo).
> - El estilo es "Mexican Cultural Premium": editorial, sobrio, con acentos cálidos cobre/oro sobre fondo crema y profundidad navy.

---

## 1. Tokens de color

### 1.1 Tokens primitivos (paleta base — NO TOCAR)

Estos son los hex literales actuales en `:root`. Se mantienen como única fuente de color.

| Token CSS          | Hex        | Uso primario                                   |
| ------------------ | ---------- | ---------------------------------------------- |
| `--navy`           | `#1B2340`  | Texto premium, fondos impacto, header sticky   |
| `--navy-light`     | `#2A3456`  | Gradientes navy, hover en superficies oscuras  |
| `--copper`         | `#C4854A`  | Acento principal, CTAs, links, eyebrows        |
| `--copper-dark`    | `#A86E3A`  | Hover de copper, énfasis tipográfico (callout) |
| `--gold`           | `#D4A853`  | Acento secundario, sobre superficies navy      |
| `--cream`          | `#FAF3E8`  | Fondo cálido, partners, content-card           |
| `--white`          | `#FFFFFF`  | Superficie base de cards y secciones claras    |
| `--text`           | `#3A3A4A`  | Cuerpo de texto                                |
| `--text-light`     | `#6A6A7A`  | Texto secundario / descripciones               |
| `--text-muted`     | `#8A8A9A`  | Subtítulos, metadatos                          |
| `--border`         | `#E2DED6`  | Bordes neutros sobre cream/white               |

### 1.2 Tokens primitivos derivados (alfa / mezclas — ya en uso)

Estos valores ya aparecen en `style.css`. Se canonizan como tokens para evitar magic numbers.

| Token CSS                  | Valor                                   | Uso                                             |
| -------------------------- | --------------------------------------- | ----------------------------------------------- |
| `--navy-overlay-strong`    | `rgba(27,35,64,.85)`                    | Overlay navy de hero/event-promo                |
| `--navy-overlay`            | `rgba(27,35,64,.75)`                    | Hero / page-hero background                     |
| `--navy-overlay-soft`       | `rgba(27,35,64,.55)`                    | Carousel button background                      |
| `--surface-cream-overlay`   | `rgba(250,243,232,.85)`                 | Secciones tipo A (what-we-do, research)         |
| `--surface-white-overlay`   | `rgba(255,255,255,.92)`                 | Secciones tipo B (programs, team)               |
| `--copper-tint`             | `rgba(196,133,74,.08)`                  | Fondo de event-preview, paper grain dots        |
| `--copper-tint-strong`      | `rgba(196,133,74,.10)`                  | Fondo de mini-stat                              |
| `--copper-border-soft`      | `rgba(196,133,74,.25)`                  | Borde de event-note                             |
| `--copper-border`           | `rgba(196,133,74,.30)`                  | Borde de event-preview                          |
| `--white-text-strong`       | `rgba(255,255,255,.85)`                 | Texto sobre navy (subtítulos hero)              |
| `--white-text`              | `rgba(255,255,255,.80)`                 | Texto sobre navy (nav links, contact paragraph) |
| `--white-text-soft`         | `rgba(255,255,255,.70)`                 | Footer body                                     |
| `--white-text-muted`        | `rgba(255,255,255,.60)`                 | Footer links inactivos                          |
| `--white-text-faint`        | `rgba(255,255,255,.40)`                 | Footer copyright                                |

### 1.3 Tokens semánticos (NUEVOS — capa de intención)

Mapean intención → primitivo. **El consumo en componentes debe ser semántico**, nunca el primitivo directo.

```css
:root {
    /* Texto */
    --color-text-primary:    var(--text);          /* #3A3A4A */
    --color-text-secondary:  var(--text-light);    /* #6A6A7A */
    --color-text-muted:      var(--text-muted);    /* #8A8A9A */
    --color-text-heading:    var(--navy);
    --color-text-on-dark:    var(--white);
    --color-text-on-dark-muted: var(--white-text); /* rgba(255,255,255,.80) */
    --color-text-inverse:    var(--white);

    /* Superficies */
    --color-bg-base:         var(--white);
    --color-bg-warm:         var(--cream);
    --color-bg-elevated:     var(--white);                  /* cards */
    --color-bg-section-warm: var(--surface-cream-overlay);  /* type A */
    --color-bg-section-base: var(--surface-white-overlay);  /* type B */
    --color-bg-impact:       var(--navy);                   /* type C */
    --color-bg-overlay-dark: var(--navy-overlay);           /* hero */

    /* Acentos */
    --color-accent:          var(--copper);
    --color-accent-hover:    var(--copper-dark);
    --color-accent-soft:     var(--copper-tint);
    --color-accent-secondary:var(--gold);                   /* sobre navy */

    /* Bordes */
    --color-border:          var(--border);
    --color-border-accent:   var(--copper-border-soft);
    --color-border-on-dark:  rgba(255,255,255,.5);

    /* Estado / utilidades */
    --color-link:            var(--copper);
    --color-link-hover:      var(--copper-dark);
    --color-focus-ring:      var(--copper);

    /* Sucesos puntuales (registro/CTA verde — heredado) */
    --color-cta-register:    #3df284;
    --color-cta-register-hover: #33e37d;
    --color-cta-register-text: #06110c;
    --color-prize-badge-bg:  #80ffca;
    --color-prize-badge-text:#0f2b20;
}
```

### 1.4 Gradientes canónicos

| Token                          | Definición                                                                                  | Uso                                |
| ------------------------------ | ------------------------------------------------------------------------------------------- | ---------------------------------- |
| `--gradient-navy-impact`       | `linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)`                           | Stats bar (sección impacto)        |
| `--gradient-cream-paper`       | `linear-gradient(180deg, rgba(250,243,232,.92), rgba(255,255,255,.94))`                     | Section-carousel (paper grain)     |
| `--gradient-edge-accent`       | `linear-gradient(90deg, transparent 0%, var(--copper) 20%, var(--gold) 50%, var(--copper) 80%, transparent 100%)` | Edge accent (transición navy → claro) |
| `--gradient-badge-warm`        | `linear-gradient(135deg, var(--gold), var(--copper))`                                       | Project badge                      |
| `--gradient-event-promo`       | `linear-gradient(180deg, rgba(27,35,64,.95), rgba(27,35,64,.85))`                           | Event promo card                   |

---

## 2. Escala tipográfica fluida

### 2.1 Familias

```css
:root {
    --font-display: 'Playfair Display', Georgia, 'Times New Roman', serif;
    --font-body:    'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

- **Playfair Display** (700 / 800): hero-title, section-heading, page-hero-title, card titles, stat-number, footer-name, project-spotlight-title, team-name, pillar-title, callout en serif si aplica.
- **Inter** (400 / 500 / 600 / 700): body, nav, buttons, eyebrows (uppercase), tags, fact-list, mini-stats, captions.

### 2.2 Pesos canónicos

| Peso | Token                   | Uso                                                    |
| ---- | ----------------------- | ------------------------------------------------------ |
| 400  | `--fw-regular`          | Cuerpo por defecto                                     |
| 500  | `--fw-medium`           | Nav links, stat-label                                  |
| 600  | `--fw-semibold`         | Botones, tags, partners, links de énfasis              |
| 700  | `--fw-bold`             | Section/card headings, eyebrows, badges                |
| 800  | `--fw-extrabold`        | Hero-title, stat-number, section-number                |

### 2.3 Escala fluida (`clamp(min, preferred, max)`)

Mobile-first: el `min` corresponde a ≤480px, el `max` a ≥1280px. La preferencia usa `vw` para escalar suavemente entre breakpoints.

```css
:root {
    /* Display / titulares — Playfair */
    --fs-display:     clamp(2.0rem, 1.30rem + 3.20vw, 3.20rem);  /* hero-title:        ~32→51.2px */
    --fs-h1:          clamp(1.55rem, 1.10rem + 2.05vw, 2.40rem);  /* page-hero-title:   ~24.8→38.4px */
    --fs-h2:          clamp(1.60rem, 1.25rem + 1.55vw, 2.00rem);  /* section-heading:   ~25.6→32px   */
    --fs-h3:          clamp(1.30rem, 1.10rem + 0.85vw, 1.75rem);  /* event-promo h3 / project-spotlight-title */
    --fs-h4:          clamp(1.20rem, 1.05rem + 0.55vw, 1.40rem);  /* team-subheading */
    --fs-h5:          clamp(1.10rem, 1.00rem + 0.45vw, 1.30rem);  /* program/event-hub card titles */
    --fs-h6:          clamp(1.05rem, 0.98rem + 0.30vw, 1.20rem);  /* collab-title, pillar-title */

    /* Cuerpo y soporte — Inter */
    --fs-lead:        clamp(1.05rem, 1.00rem + 0.30vw, 1.15rem);  /* hero-subtitle, page-hero-subtitle */
    --fs-body:        clamp(0.95rem, 0.92rem + 0.15vw, 1.00rem);  /* body por defecto = 16px desktop */
    --fs-small:       clamp(0.85rem, 0.83rem + 0.10vw, 0.92rem);  /* fact-list, card secondary */
    --fs-caption:     clamp(0.78rem, 0.76rem + 0.10vw, 0.85rem);  /* footer copy, partner labels */
    --fs-eyebrow:     clamp(0.72rem, 0.70rem + 0.10vw, 0.82rem);  /* hero-overline, section-eyebrow */

    /* Numérico de impacto */
    --fs-stat:        clamp(1.70rem, 1.20rem + 2.20vw, 2.80rem);  /* stat-number */

    /* Line-heights */
    --lh-tight:       1.10;   /* hero-title, project-spotlight-title */
    --lh-snug:        1.20;
    --lh-normal:      1.50;
    --lh-relaxed:     1.70;   /* default body */
    --lh-loose:       1.75;   /* hero-subtitle, prizes */

    /* Letter-spacing */
    --ls-tight:       -0.01em;
    --ls-normal:      0;
    --ls-wide:        0.3px;
    --ls-uppercase:   0.35em;  /* eyebrow, event-promo-label */
    --ls-uppercase-xl:0.40em;  /* hero-overline */
}
```

### 2.4 Estilos de rol (referencia para el componente)

| Rol                | Family             | Size           | Weight | LH              | Casos                                         |
| ------------------ | ------------------ | -------------- | ------ | --------------- | --------------------------------------------- |
| Display / Hero     | `--font-display`   | `--fs-display` | 800    | `--lh-tight`    | `.hero-title`                                  |
| H1 (page-hero)     | `--font-display`   | `--fs-h1`      | 700    | `--lh-snug`     | `.page-hero-title`                             |
| H2 (section)       | `--font-display`   | `--fs-h2`      | 700    | `--lh-snug`     | `.section-heading`                             |
| H3                 | `--font-display`   | `--fs-h3`      | 700    | `--lh-snug`     | `.project-spotlight-title`, `.event-promo h3`  |
| H4                 | `--font-display`   | `--fs-h4`      | 700    | `--lh-snug`     | `.team-subheading`                             |
| H5                 | `--font-display`   | `--fs-h5`      | 700    | `--lh-snug`     | `.program-card-title`, `.event-hub-card h3`    |
| H6                 | `--font-display`   | `--fs-h6`      | 700    | `--lh-snug`     | `.collab-title`, `.pillar-title`, `.team-name` |
| Lead               | `--font-body`      | `--fs-lead`    | 400    | `--lh-loose`    | `.hero-subtitle`, `.page-hero-subtitle`        |
| Body               | `--font-body`      | `--fs-body`    | 400    | `--lh-relaxed`  | `<p>` por defecto                              |
| Small              | `--font-body`      | `--fs-small`   | 400/500| `--lh-normal`   | `.fact-list li`, `.team-role`, `.partner`      |
| Caption            | `--font-body`      | `--fs-caption` | 400    | `--lh-normal`   | `.footer-copy`                                 |
| Eyebrow (uppercase)| `--font-body`      | `--fs-eyebrow` | 700    | 1               | `.hero-overline`, `.section-eyebrow`, `.event-promo-label` |
| Stat number        | `--font-display`   | `--fs-stat`    | 800    | `--lh-tight`    | `.stat-number`                                 |

---

## 3. Sistema de espaciado (8-base)

Escala canónica con `4px` como sub-step y `8px` como base. Cubre los valores que ya aparecen en `style.css` (4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 40, 48, 56, 60, 64, 72, 80, 88, 96, 112).

```css
:root {
    --space-0:   0;
    --space-1:   4px;     /* gaps mínimos, márgenes finos                     */
    --space-2:   8px;     /* gap entre nav items, gaps de chips                */
    --space-3:   12px;    /* button padding-y, eyebrow margin                  */
    --space-4:   16px;    /* section margin pequeño, gap base                  */
    --space-5:   20px;    /* card content padding lateral                      */
    --space-6:   24px;    /* gap de grids, padding de cards medianas           */
    --space-7:   28px;    /* button padding-x, advisor-card                    */
    --space-8:   32px;    /* card padding XL, gaps de grids amplios            */
    --space-9:   40px;    /* hero gap, section divider                         */
    --space-10:  48px;    /* footer padding-bottom, mobile section padding     */
    --space-12:  64px;    /* section padding-y compacto                        */
    --space-14:  80px;    /* section padding-y default                         */
    --space-16:  96px;    /* section padding-y impact (stats)                  */
    --space-20: 112px;    /* section-contact padding-y                         */
}
```

**Reglas de uso:**
- Padding de sección por defecto: `var(--space-14) 0` (80px y).
- Padding de sección compacta (partners, advisors, past-activities): `var(--space-12) 0`.
- Padding de sección impacto (stats, contact): `var(--space-16) 0` o `var(--space-20) 0`.
- Gap base de grids: `var(--space-6)` (24px); grids de team usan `28px` → redondeo a `--space-7`.
- Card padding default: `var(--space-8)` (32px desktop), `var(--space-5)–var(--space-6)` mobile.

---

## 4. Radii, shadows, transitions

### 4.1 Border radius

```css
:root {
    --radius-xs:    4px;     /* mini-stat, fact-list li, callout                  */
    --radius-sm:    6px;     /* botones, lightbox-img                             */
    --radius:      10px;     /* cards, content-card, programs, partners            */
    --radius-lg:   16px;     /* carousel-container, project-spotlight              */
    --radius-xl:   22px;     /* hero-image                                         */
    --radius-pill:999px;     /* btn-nav, key-fact-chip, section-toc-chip, badges   */
    --radius-full: 50%;      /* avatares, indicators, social icons                 */
}
```

### 4.2 Sombras

```css
:root {
    --shadow-xs:        0 2px 10px rgba(27,35,64,.06);     /* key-fact-chip                  */
    --shadow-sm:        0 2px 12px rgba(27,35,64,.04);     /* callout, certificate-img       */
    --shadow:           0 4px 24px rgba(27,35,64,.08);     /* card por defecto               */
    --shadow-lg:        0 8px 40px rgba(27,35,64,.12);     /* card hover, project-spotlight  */
    --shadow-hero:      0 24px 60px rgba(0,0,0,.18);       /* hero-image                     */
    --shadow-cta:       0 16px 28px rgba(27,35,64,.16);    /* btn-hero                       */
    --shadow-spotlight: 0 12px 50px rgba(27,35,64,.16);    /* project-spotlight hover        */
    --shadow-event-note:0 20px 40px rgba(27,35,64,.08);    /* event-note                     */
    --shadow-header:    0 2px 20px rgba(0,0,0,.25);        /* site-header.scrolled           */
    --shadow-mobile-nav:-4px 0 30px rgba(0,0,0,.30);       /* mobile drawer                  */

    /* Insets — refuerzan jerarquía sin objeto físico */
    --inset-section-warm:  inset 0 8px 16px rgba(27,35,64,.05);
    --inset-section-impact:inset 0 8px 16px rgba(0,0,0,.18);
    --inset-section-stats: inset 0 8px 16px rgba(0,0,0,.22);
}
```

### 4.3 Transitions

```css
:root {
    --transition-fast:  .15s ease;
    --transition:       .25s ease;       /* default — coincide con valor actual */
    --transition-slow:  .35s ease;       /* mobile drawer                        */
    --transition-carousel: .5s ease;     /* carousel slide transform             */
}
```

**Properties canónicas a transicionar:**
- Cards: `box-shadow`, `transform` (`translateY(-4px)` en hover).
- Botones: `background`, `border-color`, `color`.
- Links: `color`.
- Header sticky: `padding`, `box-shadow`.

### 4.4 Z-index scale

```css
:root {
    --z-base:        1;
    --z-decoration:  2;     /* edge-accent ::before               */
    --z-sticky:    1000;    /* site-header                        */
    --z-mobile-nav:  999;
    --z-mobile-toggle:1001;
    --z-lightbox:  9999;
}
```

---

## 5. Breakpoints

Mobile-first. Un único media query por breakpoint, ascendente.

```css
:root {
    --bp-sm:   480px;   /* móvil compacto                          */
    --bp-md:   768px;   /* móvil grande / tablet pequeña           */
    --bp-lg:  1024px;   /* tablet / laptop pequeña                 */
    --bp-xl:  1280px;   /* desktop                                 */
    --bp-2xl: 1440px;   /* desktop ancho                           */
}

/* Mobile-first */
@media (min-width: 480px)  { /* fuera de XS */ }
@media (min-width: 768px)  { /* tablet+ */ }
@media (min-width: 1024px) { /* desktop+ */ }
@media (min-width: 1280px) { /* desktop ancho */ }
@media (min-width: 1440px) { /* XL */ }
```

**Mapeo desde el CSS actual** (que era desktop-first con `max-width`): los bloques `@media (max-width: 1024px) { … }` y `@media (max-width: 768px) { … }` deben re-expresarse como `@media (min-width: 768px) { … }` y `@media (min-width: 1024px) { … }`, invirtiendo defaults.

**Container widths:**
- `--container-max: 1200px`
- `--container-narrow: 800px` (footer, content)
- `--container-hero: 1080px`
- `--container-carousel: 860px`
- Padding lateral: `0 20px` (desktop) / `0 12px` (≤480px).

---

## 6. Inventario de componentes (component-library backlog)

Lista canónica de componentes Astro que la siguiente fase (#7–#11) debe construir. Cada uno declara: archivo, props, slots, casos de uso. Los nombres siguen `PascalCase` y residen en `src/components/<categoría>/`.

### 6.1 Layout / Shell (Task #7)

| Componente            | Props                                                                                              | Slots                       | Casos de uso                                |
| --------------------- | -------------------------------------------------------------------------------------------------- | --------------------------- | ------------------------------------------- |
| `BaseLayout.astro`    | `title:string`, `description:string`, `lang?:'es'\|'en'`, `ogImage?:string`, `pathname:string`     | `default`, `head?`          | Layout raíz para todas las páginas          |
| `SiteHeader.astro`    | `currentPath:string`                                                                               | —                           | Header sticky con logo + nav                |
| `MainNav.astro`       | `items:NavItem[]`, `currentPath:string`                                                            | —                           | Nav principal (desktop + drawer móvil)      |
| `MobileToggle.astro`  | `targetId:string`                                                                                  | —                           | Hamburguesa accesible para abrir drawer     |
| `SiteFooter.astro`    | `social?:SocialLink[]`                                                                             | `default?`                  | Footer global                               |
| `Breadcrumb.astro`    | `items:{label:string,href?:string}[]`                                                              | —                           | Páginas internas (about, projects, etc.)    |
| `Container.astro`     | `size?:'narrow'\|'default'\|'wide'`, `as?:string`                                                  | `default`                   | Wrapper de ancho consistente                |
| `Section.astro`       | `tone:'warm'\|'base'\|'impact'\|'cream'`, `padding?:'compact'\|'default'\|'impact'`, `inset?:bool`, `edgeAccent?:bool`, `id?:string` | `default` | Wrapper que aplica tokens A/B/C/D del CSS actual |

### 6.2 Hero (Task #8)

| Componente            | Props                                                                                              | Slots                       | Casos de uso                                |
| --------------------- | -------------------------------------------------------------------------------------------------- | --------------------------- | ------------------------------------------- |
| `Hero.astro`          | `overline?:string`, `title:string`, `subtitle?:string`, `image?:ImgRef`, `actions?:CtaRef[]`       | `default?`                  | Home hero principal                         |
| `PageHero.astro`      | `title:string`, `subtitle?:string`, `breadcrumb?:Breadcrumb`                                       | —                           | Hero compacto sub-páginas                   |
| `EventPageHero.astro` | `image:ImgRef`, `cta?:CtaRef`                                                                      | —                           | Hero edge-to-edge para landings de evento   |
| `HeroOverline.astro`  | `text:string`, `tone?:'gold'\|'copper'`                                                            | —                           | Etiqueta narrativa "AI SAFETY MEXICO · …"  |

### 6.3 Sistema de cards (Task #9)

| Componente              | Props                                                                                                        | Slots                       | Casos de uso                                |
| ----------------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------- | ------------------------------------------- |
| `Card.astro`            | `as?:string`, `padding?:Spacing`, `elevated?:bool`, `interactive?:bool`, `bordered?:bool`                    | `default`                   | Base reutilizable                           |
| `ProgramCard.astro`     | `title:string`, `actions?:CtaRef[]`, `certificates?:ImgRef[]`                                                | `default`                   | Cursos abiertos + institucionales           |
| `TeamCard.astro`        | `name:string`, `role:string`, `photo:ImgRef`, `linkedin?:string`                                             | —                           | Core team + advisors + colaboradores        |
| `PillarCard.astro`      | `icon:string\|IconRef`, `title:string`, `text:string`                                                        | —                           | Quiénes somos (4-up)                        |
| `CollabCard.astro`      | `icon:string\|IconRef`, `title:string`, `text:string`, `cta?:CtaRef`                                         | —                           | "Colabora con nosotros"                     |
| `ProjectSpotlight.astro`| `badge?:string`, `title:string`, `media?:ImgRef`, `stats?:MiniStat[]`, `cta?:CtaRef`                         | `default`                   | VIGÍA, AI Safety Connect destacados         |
| `EventPreview.astro`    | `title:string`, `subtitle?:string`, `href:string`                                                            | —                           | Tarjeta de evento futuro                    |
| `EventHubCard.astro`    | `image:ImgRef`, `title:string`, `featured?:bool`                                                             | `default`                   | Hubs en hackathon                           |
| `PrizeCard.astro`       | `badge:string`, `title:string`                                                                               | `default`                   | Premios en hackathon                        |
| `AdvisorCard.astro`     | `name:string`, `affiliation?:string`                                                                         | —                           | Lista de advisors                           |
| `EventPromo.astro`      | `label:string`, `title:string`, `description?:string`, `cta?:CtaRef`                                         | —                           | Banner navy de evento dentro de sección B   |

### 6.4 Bloques de contenido (Task #10)

| Componente              | Props                                                                                                        | Slots                       | Casos de uso                                |
| ----------------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------- | ------------------------------------------- |
| `SectionHeading.astro`  | `eyebrow?:string`, `title:string`, `description?:string`, `tone?:'light'\|'dark'`, `align?:'left'\|'center'`, `as?:string` | — | H2 + eyebrow + descripción + accent line   |
| `SectionEyebrow.astro`  | `text:string`, `number?:string`, `tone?:'copper'\|'gold'`                                                    | —                           | Wayfinding narrativo                        |
| `SectionDivider.astro`  | `variant:'line'\|'dots'\|'zigzag'`                                                                           | —                           | Cierre decorativo entre secciones           |
| `Callout.astro`         | `tone?:'copper'\|'navy'`                                                                                     | `default`                   | Pull-out con borde lateral                  |
| `FactList.astro`        | `items:{icon?:string,label:string,value:string}[]`                                                           | —                           | Hechos clave con icono                      |
| `KeyFacts.astro`        | `items:{icon?:string,text:string}[]`                                                                         | —                           | Chips factuales                             |
| `MiniStats.astro`       | `items:{icon?:string,text:string}[]`                                                                         | —                           | Stats compactas dentro de cards             |
| `StatsBar.astro`        | `stats:{value:string,label:string}[]`                                                                        | —                           | Sección stats Type C                        |
| `Tag.astro`             | `as?:'span'\|'a'`, `href?:string`                                                                            | `default`                   | Tag chips                                   |
| `TagList.astro`         | `items:string[]`                                                                                             | —                           | Lista de tags                               |
| `Partner.astro`         | `name:string`, `logo?:ImgRef`, `href?:string`                                                                | —                           | Partners pill                               |
| `PartnersRow.astro`     | `partners:Partner[]`                                                                                         | —                           | Sección partners                            |
| `EventNote.astro`       | `label:string`                                                                                               | `default`                   | Nota destacada en evento                    |
| `ContentCard.astro`     | `padded?:bool`                                                                                               | `default`                   | Bloque editorial (about, content pages)     |
| `ProjectBadge.astro`    | `text:string`                                                                                                | —                           | Badge gradient gold→copper                  |
| `SectionToc.astro`      | `items:{href:string,label:string}[]`                                                                         | —                           | TOC interno (Trayectoria)                   |

### 6.5 Componentes interactivos (Task #11)

| Componente              | Props                                                                                                        | Slots                       | Casos de uso                                |
| ----------------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------- | ------------------------------------------- |
| `Carousel.astro`        | `slides:{src:ImgRef,alt:string}[]`, `autoplay?:bool`, `interval?:number`                                     | —                           | Carrusel actividades home                   |
| `Lightbox.astro`        | `triggerSelector?:string`                                                                                    | `default?`                  | Galería de fotos / certificados             |
| `ScrollReveal.astro`    | `as?:string`, `delay?:number`, `threshold?:number`                                                           | `default`                   | Fade-in al scroll                           |
| `SmoothScrollAnchor.astro`| `href:string`                                                                                              | `default`                   | Anchors con scroll suave                    |
| `ContactForm.astro`     | `endpoint:string`, `successMessage?:string`                                                                  | —                           | Formulario "Get involved"                   |
| `ActiveNavObserver.client.ts` | —                                                                                                      | —                           | Marca link activo según scroll position     |
| `StickyHeaderObserver.client.ts` | —                                                                                                   | —                           | Toggle `.scrolled` en header                |

### 6.6 UI primitivos compartidos

| Componente              | Props                                                                                                        | Casos de uso                                |
| ----------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| `Button.astro`          | `as?:'a'\|'button'`, `href?:string`, `variant:'primary'\|'secondary'\|'outline'\|'register'`, `size?:'md'\|'lg'`, `type?:string` | Todos los CTAs                              |
| `Link.astro`            | `href:string`, `variant?:'inline'\|'plain'`, `external?:bool`                                                | Links de cuerpo                             |
| `Icon.astro`            | `name:string`, `size?:number`, `decorative?:bool`                                                            | Iconos (social, decorativos)                |
| `Img.astro`             | `src:ImageMetadata`, `alt:string`, `sizes?:string`, `loading?:'eager'\|'lazy'`                               | Wrapper sobre `astro:assets`                |

### 6.7 Tipos compartidos (`src/lib/types.ts`)

```ts
export type CtaRef = { label: string; href: string; variant?: 'primary' | 'secondary' | 'outline' | 'register'; external?: boolean };
export type NavItem = { label: string; href: string; cta?: boolean };
export type SocialLink = { name: string; href: string; icon: string };
export type ImgRef = { src: ImageMetadata | string; alt: string };
export type Breadcrumb = { items: { label: string; href?: string }[] };
export type MiniStat = { icon?: string; text: string };
```

---

## 7. Reglas de adopción para component-library

1. **Solo tokens semánticos en componentes.** Los primitivos de la sección 1.1 viven únicamente en `tokens.css`.
2. **Tipografía vía role classes**, no `font-size` literal en componentes.
3. **Espaciado vía `--space-*`**, jamás magic numbers fuera de la escala.
4. **Mobile-first**: defaults en mobile, escalada con `min-width`.
5. **Mantener paleta y tipografías intactas** — cualquier propuesta de variación se rechaza.
6. **Edge-accent y dividers** son piezas decorativas opcionales por sección, no defaults.
7. **Accesibilidad como base**: contraste mínimo AA verificado por el auditor (Task #22) sobre estos tokens.
