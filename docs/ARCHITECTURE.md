# AI Safety Mexico — Architecture Specification

> Information architecture, sitemap, navigation patterns, and page templates for the multi-page Astro rebuild.
> Reference inspirations: **RAND Corporation** (research-credible, scannable, taxonomy-first) and **Coefficient Giving** (mission-led, narrative hero, focused CTAs).
> Source of truth for current content: `/Users/mpinelo/projects/aismx/aisafetymexico.github.io/.claude/worktrees/restructure-homepage/index.html`.

---

## 1. Sitemap

Definitive URL slugs (lowercase, hyphenated, English where the term is global, Spanish content within). Slugs are stable contracts — never change after launch without 301s.

| URL | Page | Origin in current single-page |
|---|---|---|
| `/` | Home | Hero + section summaries (`#quienes-somos`, hero, stats) |
| `/about` | About | `#quienes-somos` (extended), team rationale, history |
| `/research` | Research index | `#investigacion` |
| `/programs` | Programs (educational) | `#programas` |
| `/projects` | Projects index | `#proyectos` (overview) |
| `/projects/vigia` | VIGÍA project page | VIGÍA spotlight |
| `/projects/ai-safety-connect` | AI Safety Connect project page | AI Safety Connect spotlight |
| `/team` | Team & advisors | `#equipo` |
| `/activities` | Activities & track record | `#trayectoria` + `#actividades-en-curso` + `#galeria` |
| `/get-involved` | Get involved / collaborate | `#colabora` |
| `/contact` | Contact | `#contacto` |
| `/global-south-challenge` | Global South AIS Challenge landing | `global-south-ais-challenge.html` (existing) |

**Rationale (1 line per slug)**
- `/` — entry point; must surface mission, current activity, and 1 strong CTA.
- `/about` — institutional credibility lives here; what visitors check before partnering.
- `/research` — RAND-style index of papers and ongoing studies; signals scientific depth.
- `/programs` — educational offering (cursos, talleres) — primary funnel for community.
- `/projects` — flagship initiatives index; shows applied work and impact.
- `/projects/vigia` and `/projects/ai-safety-connect` — each flagship deserves a dedicated narrative; supports SEO and external linking.
- `/team` — humanises the org; required for grant applications and partnership vetting.
- `/activities` — chronicle of conferences, workshops, formación; demonstrates trajectory.
- `/get-involved` — funnel for partner orgs, donors, collaborators.
- `/contact` — minimal, single-purpose; avoids burying email behind a contact form initially.
- `/global-south-challenge` — flagship event; preserves existing SEO and external-link surface.

---

## 2. Page-by-page specification

Each page block: **Purpose · Primary audience · Internal sections · Primary CTA**.

### `/` — Home
- **Purpose**: Communicate mission and direct visitors to the most relevant deeper page in <10 seconds.
- **Primary audience**: First-time visitors (researchers, partner orgs, press, prospective collaborators).
- **Sections**:
  1. Hero — mission statement, single primary CTA, single secondary CTA.
  2. What we do — 4 pillars (Investigación, Educación, Gobernanza, Comunidad).
  3. Stats bar — 4 quantitative trust signals.
  4. Featured activity — current/next event card (data-driven from `/activities`).
  5. Flagship projects teaser — VIGÍA + AI Safety Connect cards linking to project pages.
  6. Partners strip — logos/wordmarks for credibility.
- **Primary CTA**: "Conoce nuestros programas" → `/programs`.
- **Secondary CTA**: "Colabora con nosotros" → `/get-involved`.

### `/about`
- **Purpose**: Establish organisational identity, mission, vision, and founding story.
- **Primary audience**: Funders, journalists, prospective hires, institutional partners.
- **Sections**:
  1. Mission & vision statement.
  2. Origin story (founded 2025, multidisciplinary).
  3. Pillars (deep dive — what each means in practice).
  4. Values / principles.
  5. Partners & affiliations.
- **CTA**: "Conoce al equipo" → `/team`.

### `/research`
- **Purpose**: Index all published and in-progress research with filterable metadata (topic, author, venue, year).
- **Primary audience**: Researchers, academics, policy analysts.
- **Sections**:
  1. Page intro — research focus areas.
  2. Research items grid (cards: title, abstract, authors, venue, links to PDF/podcast).
  3. Ongoing research (in-progress projects, e.g. evaluaciones de seguridad).
  4. Research areas / taxonomy (governance, alignment, evaluations, regional studies).
  5. Call for collaboration sidebar.
- **CTA**: "Propón una colaboración" → `/get-involved#research`.

### `/programs`
- **Purpose**: Surface all educational offerings and prove pedagogical track record.
- **Primary audience**: Students, professionals seeking training, institutions seeking custom courses.
- **Sections**:
  1. Programs intro — philosophy and approach.
  2. Open courses (Fundamentos, Gobernanza, Técnico).
  3. Institutional programs (Centro Geo, UADY case studies).
  4. Facilitators with photos/short bios.
  5. Certificates gallery — social proof.
- **CTA**: "Inscríbete o solicita un curso" → `/contact?subject=program`.

### `/projects`
- **Purpose**: Index of flagship projects with one-card-per-project navigation to detailed pages.
- **Primary audience**: Partners, funders, developers/researchers looking for live work.
- **Sections**:
  1. Page intro — what we mean by "projects" vs. research.
  2. Project cards grid (VIGÍA, AI Safety Connect, future).
  3. How we choose projects (criteria block).
  4. Want to propose a project? (CTA block).
- **CTA**: "Ver todos los proyectos" expands → individual project pages.

### `/projects/vigia`
- **Purpose**: Full narrative for the VIGÍA platform.
- **Primary audience**: Policy researchers, governance audiences, funders.
- **Sections**:
  1. Project overview — what VIGÍA is, problem it solves.
  2. Recognition (Special Recognition · AI Safety Collab 2025).
  3. Methodology / approach.
  4. Team (5 collaborators with roles).
  5. External resources (link to vigia-observatorio.github.io).
- **CTA**: "Visita la plataforma VIGÍA" → external link.

### `/projects/ai-safety-connect`
- **Purpose**: Full narrative for the AI Safety Connect platform and paper.
- **Primary audience**: Academic researchers, AI safety practitioners.
- **Sections**:
  1. Project overview & objective.
  2. Methodology — taxonomy, semantic search, pipelines.
  3. Paper / publication block.
  4. International team.
  5. Acknowledgements.
- **CTA**: "Lee el paper" → paper page or PDF.

### `/team`
- **Purpose**: Introduce the people behind the org with roles and links.
- **Primary audience**: Anyone vetting credibility — partners, press, funders.
- **Sections**:
  1. Team intro (multidisciplinary statement).
  2. Core team grid (photo, name, role, LinkedIn).
  3. Advisors block.
  4. Join the team CTA (if hiring) or "Colabora" otherwise.
- **CTA**: "Únete o colabora" → `/get-involved`.

### `/activities`
- **Purpose**: Track record and current activity — what we've done and what's happening now.
- **Primary audience**: Returning visitors, community members, prospective partners checking momentum.
- **Sections**:
  1. Actividades en curso (current events, e.g., Global South AIS Challenge teaser, mesas de trabajo).
  2. Trayectoria — formación avanzada (ML4Good, etc.).
  3. Conferencias y talleres (EAGxCDMX, Your AI Agent Is Not You, etc.).
  4. Programas de investigación externos (SPAR, etc.).
  5. Galería (carousel from current site).
- **CTA**: "Suscríbete a actualizaciones" or "Asiste al próximo evento" → contextual.

### `/get-involved`
- **Purpose**: Convert interest into action — partnerships, collaborations, course requests.
- **Primary audience**: Organisations and individuals with a specific ask.
- **Sections**:
  1. Intro — who we collaborate with.
  2. Investigación conjunta card.
  3. Programas educativos para instituciones card.
  4. Eventos y advisory card.
  5. Direct contact block (email + meeting link if available).
- **CTA**: "Escríbenos a contact@aismx.org" (mailto) — single dominant CTA.

### `/contact`
- **Purpose**: Lowest-friction path to email contact.
- **Primary audience**: Anyone with a direct question.
- **Sections**:
  1. Contact intro (1 short paragraph).
  2. Email + LinkedIn + Instagram block.
  3. Office hours / response time expectation.
  4. Optional: location/region context (México · LATAM).
- **CTA**: "Envíanos un correo" → `mailto:contact@aismx.org`.

### `/global-south-challenge`
- **Purpose**: Standalone event landing page for the Global South AIS Challenge.
- **Primary audience**: Hackathon participants, regional partners, sponsors.
- **Sections**: Preserve current `global-south-ais-challenge.html` structure (hero, agenda, registration, sponsors, FAQ).
- **CTA**: "Regístrate" → external registration form.

---

## 3. Primary navigation (top header)

**Decision: 6 items max in desktop top nav.** RAND keeps top nav under 7; Coefficient Giving uses 5. More than 6 reduces scannability and forces visual compression.

**Order (left → right) and rationale:**
1. **About** — institutional credibility first; what most first-time visitors check.
2. **Research** — academic identity; key differentiator.
3. **Programs** — primary funnel for community / students.
4. **Projects** — flagship work; partners and funders look here.
5. **Activities** — momentum signal; returning visitors care most.
6. **Get involved** — visually distinct as a button (CTA-style).

**Items NOT in top nav (intentional)**:
- **Team** — accessed via `/about` link or footer; saves a slot for higher-intent destinations.
- **Contact** — lives in footer + as fallback inside `/get-involved`; reduces top-nav clutter.
- **Global South Challenge** — surfaced via "Activities" and home featured-activity card; event pages live one click in to keep nav stable across event cycles.

**Logo**: top-left, links to `/`. Always visible.

**Language toggle (future)**: top-right, separate from nav. Out of scope for v1 — content stays Spanish-first; English only on flagship project pages where it already exists.

**Mobile (≤768px)**: hamburger menu collapses all 6 items into a slide-down panel. Logo stays visible. Get-involved CTA renders as a full-width primary button at the bottom of the panel for tap-target clarity. Tapping a link closes the panel and scrolls to the destination. Sub-pages (e.g. `/projects/vigia`) are not surfaced in the top nav — accessed via the `/projects` index.

**Sticky behaviour**: header sticks on scroll with subtle shadow after 80px. Hide on scroll-down, reveal on scroll-up (RAND pattern) to maximise reading area on long pages.

---

## 4. Secondary navigation (footer)

Footer is a 3-column grid (collapses to stacked on mobile) plus a brand row.

**Column 1 — Explora**
- Inicio (`/`)
- Sobre nosotros (`/about`)
- Equipo (`/team`)
- Actividades (`/activities`)

**Column 2 — Trabajo**
- Investigación (`/research`)
- Programas (`/programs`)
- Proyectos (`/projects`)
- Global South Challenge (`/global-south-challenge`)

**Column 3 — Conecta**
- Colabora (`/get-involved`)
- Contacto (`/contact`)
- LinkedIn (external)
- Instagram (external)

**Brand row (full-width, above columns)**: logo + org name + tagline + social icons.
**Legal row (full-width, below columns)**: copyright, year, optional privacy/terms placeholder.

**Rationale for grouping**: column labels mirror visitor intent (browse / learn / act). Avoids alphabetical or strictly-by-section ordering, which RAND uses but which obscures purpose for a smaller org.

---

## 5. Breadcrumbs

**Show breadcrumbs on all pages EXCEPT `/`.** Home does not need orientation; every other page benefits from it.

**Format**: `Inicio › <Section> › <Page>` — separator `›` (single Unicode char), Inicio always linked, current page in non-link bold text.

**Examples**
- `/about` → `Inicio › Sobre nosotros`
- `/projects/vigia` → `Inicio › Proyectos › VIGÍA`
- `/research` → `Inicio › Investigación`

**Placement**: directly below header, above page hero, with bottom margin to separate from H1. Breadcrumbs use a smaller font size (14px) and muted colour to avoid competing with the page title.

**SEO**: emit `BreadcrumbList` JSON-LD on every page except `/`.

**Mobile**: breadcrumbs collapse to "‹ Sección padre" (back-link style) when path depth ≥ 2 and viewport <500px, to save vertical space.

---

## 6. Page templates

Four reusable Astro layout templates. Each page maps to exactly one template.

### `HomePage`
**Used by**: `/`
**Components**:
- `SiteHeader` (sticky)
- `HeroFull` (full-width hero with image, title, subtitle, dual CTA)
- `PillarsGrid` (4-card pillar block)
- `StatsBar` (4-stat horizontal strip)
- `FeaturedActivityCard` (1 dynamic event card)
- `FlagshipProjectsTeaser` (2-card project preview)
- `PartnersStrip` (logo row)
- `SiteFooter`

**No breadcrumbs. No page H1 below hero (hero contains H1).**

### `ContentPage`
**Used by**: `/about`, `/contact`, `/get-involved`
**Components**:
- `SiteHeader`
- `Breadcrumbs`
- `PageHero` (compact hero: eyebrow, H1, lede paragraph — no image, no CTA buttons)
- `ContentSections[]` (variable; usually 2–5 narrative blocks composed of `Prose`, `CardGrid`, `Callout`)
- `CtaBlock` (single primary CTA at bottom)
- `SiteFooter`

**Pattern**: text-heavy, narrative-led. No filtering, no item indexing.

### `ProjectPage`
**Used by**: `/projects/vigia`, `/projects/ai-safety-connect`, future project pages
**Components**:
- `SiteHeader`
- `Breadcrumbs`
- `ProjectHero` (project name, badge for recognition, 1-line summary, hero image/poster)
- `ProjectMetaBar` (status, recognition, focus area, team size — chip-style)
- `ContentSections[]` (Overview · Methodology · Team · Resources)
- `RelatedProjects` (2-card link to other projects)
- `CtaBlock`
- `SiteFooter`

**Pattern**: structured project narrative with consistent metadata block at top for scannability. Modeled on RAND research-project pages.

### `IndexPage`
**Used by**: `/research`, `/programs`, `/projects`, `/team`, `/activities`
**Components**:
- `SiteHeader`
- `Breadcrumbs`
- `PageHero` (compact)
- `FilterBar` (optional — for `/research` and `/activities` where item count justifies it; omit for `/team` and `/programs` v1)
- `ItemGrid` (card grid; card variant determined by index type: `ResearchCard`, `ProgramCard`, `ProjectCard`, `TeamCard`, `ActivityCard`)
- `SecondaryGrid` (optional second tier — e.g. advisors on `/team`, gallery on `/activities`)
- `CtaBlock`
- `SiteFooter`

**Pattern**: uniform card grid for browsable collections. Card variants share a common shell (border, padding, hover state) but differ in metadata fields shown.

### Template-to-page matrix

| Page | Template |
|---|---|
| `/` | HomePage |
| `/about` | ContentPage |
| `/research` | IndexPage |
| `/programs` | IndexPage |
| `/projects` | IndexPage |
| `/projects/vigia` | ProjectPage |
| `/projects/ai-safety-connect` | ProjectPage |
| `/team` | IndexPage |
| `/activities` | IndexPage |
| `/get-involved` | ContentPage |
| `/contact` | ContentPage |
| `/global-south-challenge` | (custom — preserve existing layout; not part of template system v1) |

---

## 7. Cross-cutting decisions (concise)

- **Language**: Spanish-first across all pages. English content only inside research/project pages where the original artefact is English (paper, abstract).
- **URL casing**: lowercase, hyphen-separated. No trailing slashes (Astro default).
- **404 page**: branded, with quick-links to `/`, `/research`, `/programs`, `/contact`.
- **OpenGraph**: every page emits OG title, description, image (org logo as fallback). Project pages override with project poster.
- **JSON-LD**: `Organization` on `/`, `BreadcrumbList` on every non-home page, `Article` on research items.
- **Accessibility baseline**: skip-to-content link, focus-visible rings, semantic landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`), alt text on every image.

---

## 8. Out of scope (v1)

- Multi-language switcher (ES/EN UI toggle).
- CMS / authoring UI — content lives in Markdown/MDX files committed to the repo.
- Search.
- Newsletter signup form (email-link CTA only for v1).
- User accounts, comments, donation processing.

---

*End of ARCHITECTURE.md — phase 2 implementation may request clarifications on any section above.*
