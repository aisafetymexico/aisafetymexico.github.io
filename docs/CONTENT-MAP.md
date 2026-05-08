# CONTENT-MAP.md

Mapa de contenido: del **single-page synthesis** (`/restructure-homepage/index.html`) a la nueva arquitectura **multi-página Astro**.

**Fuente analizada:** `/Users/mpinelo/projects/aismx/aisafetymexico.github.io/.claude/worktrees/restructure-homepage/index.html` (574 líneas, 13 secciones numeradas + carousel + footer).

**Páginas destino** (según Tasks #12–#19):
- `/` — **Home** (gateway curado)
- `/about` — **About** (Quiénes somos)
- `/research` — **Research** (Publicaciones + investigación en curso)
- `/programs` — **Programs** (Cursos abiertos + institucionales)
- `/projects` — **Projects** (index + subpáginas VIGÍA y AI Safety Connect)
- `/team` — **Team** (Core + advisors + colaboradores)
- `/activities` — **Activities** (En curso + pasadas + galería)
- `/get-involved` — **Get Involved** (Colabora + Contacto)

Convenciones de transformación:
- **Preserve** = el bloque pasa tal cual (texto y assets sin cambio).
- **Split** = el bloque se divide en piezas que viven en páginas distintas.
- **Refactor** = el bloque se reestructura (cambia jerarquía, se enriquece, se sintetiza, se traduce a otro componente).
- **Promote** = un sub-bloque se convierte en página/sección propia con más contenido.
- **Demote** = un bloque se reduce a un teaser/preview con CTA hacia la página destino.

---

## 1. Tabla de mapeo: sección actual → página destino

### 1.1 Header (`<header class="site-header">`, líneas 16–39)

| Elemento actual | Destino | Transformación |
| --- | --- | --- |
| Logo + texto "AI SAFETY MX" | Componente global `Header` | **Preserve** — visible en todas las páginas. |
| Nav links: Inicio, Qué hacemos, Proyectos, Investigación, Trayectoria, Equipo, Colabora, Contacto, "Actividades en curso" (CTA) | Componente global `Header` | **Refactor** — los links pasan de anchors `#section` a rutas `/about`, `/projects`, `/research`, `/activities`, `/team`, `/get-involved`. El CTA "Actividades en curso" apunta a `/activities`. "Contacto" se fusiona dentro de "Get Involved". |
| Mobile toggle + nav | Componente global `Header` | **Preserve** — comportamiento idéntico. |

### 1.2 Hero "Observatorio" (líneas 42–57)

| Elemento actual | Destino | Transformación |
| --- | --- | --- |
| Hero con `images/observatorio.png`, overline "AI SAFETY MEXICO · MX-LATAM", título principal, subtítulo, dos CTAs | `/` Home (hero) | **Preserve** estructura. CTAs cambian a: "Nuestros programas" → `/programs`; "Contáctanos" → `/get-involved`. |
| — | `/about` | **Demote** — versión corta del hero (sin imagen "observatorio") con foco en propósito institucional. Ver §4 (sugerencias). |

### 1.3 Sección "Quiénes somos" (líneas 62–92)

| Elemento actual | Destino | Transformación |
| --- | --- | --- |
| Párrafo introductorio "AI Safety Mexico es una organización sin fines de lucro fundada en 2025…" | `/about` (sección "Misión / Quiénes somos") | **Preserve** — texto íntegro. |
| Key-facts chips: "Fundada en 2025", "Sin fines de lucro", "Equipo multidisciplinario" | `/about` y `/` (resumen) | **Preserve** — chips se mantienen idénticos. En Home se muestran como teaser; en About como bloque principal. |
| Pillars grid: Investigación, Educación, Gobernanza, Comunidad | `/about` (sección "Pilares") **+** `/` (gateway de pilares) | **Split + Promote** — En Home cada pilar enlaza a su página correspondiente: Investigación→`/research`, Educación→`/programs`, Gobernanza→pendiente (ver gap), Comunidad→`/get-involved` o `/activities`. En About se conserva como descripción de los cuatro ejes con párrafo expandido por pilar (ver gaps §2). |

### 1.4 Stats Bar (líneas 95–116)

| Elemento actual | Destino | Transformación |
| --- | --- | --- |
| Stats: 6+ Cursos, 30+ Participantes, 3 Publicaciones, 10+ Investigadores | `/` Home **+** `/about` | **Preserve** en ambas. En Home funciona como prueba social cerca del hero; en About como cierre de la presentación institucional. |

### 1.5 Actividades en curso (líneas 119–137)

| Elemento actual | Destino | Transformación |
| --- | --- | --- |
| Card con intro "Actualmente estamos trabajando en…" | `/activities` (sección "En curso") | **Preserve**. |
| Event-promo "Apart x AI Safety México · The Global South AIS Challenge" + CTA a `global-south-ais-challenge.html` | `/activities` (destacado) **+** `/` (banner/teaser) | **Split** — En Home aparece como banner destacado (variante hero secundaria) con CTA. En Activities como tarjeta principal con descripción extendida. La página `global-south-ais-challenge.html` se conserva (link externo dentro del repo, fuera del scope Astro inicial salvo migración futura). |
| Event-note "Mesas de trabajo · Primer viernes del mes" | `/activities` (sección "Recurrentes") **+** `/get-involved` (CTA secundario) | **Split** — En Activities con detalle de qué se discute; en Get Involved como punto de entrada para nuevos colaboradores. |

### 1.6 Proyectos insignia (líneas 140–192)

| Elemento actual | Destino | Transformación |
| --- | --- | --- |
| Section heading + descripción "Iniciativas propias y colaborativas…" | `/projects` (index) | **Preserve**. |
| Project spotlight **VIGÍA** (badge "Special Recognition · AI Safety Collab 2025", título, descripción, mini-stats, equipo, CTA externo a vigia-observatorio.github.io) | `/projects/vigia` (subpágina dedicada) **+** `/projects` (card de entrada) **+** `/` (preview) | **Promote + Demote** — VIGÍA gana subpágina propia con contexto extendido (problema, metodología, equipo, resultados, enlaces). En `/projects` aparece como card resumen. En Home como tarjeta destacada con CTA "Saber más". |
| Project spotlight **AI Safety Connect** (callout, fact-list con objetivo/metodología/equipo internacional, CTA a `ai-safety-connect.html`, imagen del póster) | `/projects/ai-safety-connect` (subpágina) **+** `/projects` (card) **+** `/research` (cross-link como publicación) | **Promote + Cross-reference** — Subpágina propia con paper embebido o linkado. En `/projects` como card. Cross-link en `/research` porque es output de SPAR. |

### 1.7 Investigación (líneas 195–236)

| Elemento actual | Destino | Transformación |
| --- | --- | --- |
| Section heading + descripción | `/research` | **Preserve**. |
| Card **"AI Safety in Mexico: A Pilot Survey in Yucatan"** (lugar, equipo, publicado en RCS·IPN, CTAs Paper + Podcast) | `/research` (sección "Publicaciones") | **Preserve** + **Refactor** ligero — se promueve a "publicación" con metadata estructurada (autores, venue, año, DOI si existe — gap). |
| Card **"Evaluación de Seguridad en Modelos de IA"** (Miguel Angel Peñaloza) | `/research` (sección "En curso") | **Preserve** + flag como **gap** — solo 1 párrafo; necesita expansión (objetivos, métricas, timeline). |

### 1.8 Programas educativos (líneas 239–277)

| Elemento actual | Destino | Transformación |
| --- | --- | --- |
| Section heading | `/programs` | **Preserve**. |
| **Curso de Fundamentos + Gobernanza** (material, facilitadores, certificados Atlas y ENAIS) | `/programs` (sección "Cursos abiertos") | **Preserve**. Los certificados se renderizan en componente `CertificateGallery`. |
| **Curso Técnico de Seguridad en IA** (ARENA, facilitadores Jason y Angel) | `/programs` (sección "Cursos abiertos") | **Preserve** + **gap** — falta cohorte/fechas/duración/criterios de selección. |
| **Seguridad en IA para Instituciones** (Centro Geo + UADY, certificados) | `/programs` (sección "Cursos institucionales") | **Preserve**. Certificados (Centro Geo, UADY) se mueven a `CertificateGallery`. |

### 1.9 Trayectoria internacional (líneas 280–339)

| Elemento actual | Destino | Transformación |
| --- | --- | --- |
| Section heading + descripción + TOC interno | `/activities` (sección "Trayectoria") **o** sección dentro de `/about` | **Refactor** — la TOC interna desaparece; cada sub-bloque se vuelve sección con anchor en `/activities`. *Decisión recomendada: vivir en `/activities` para no inflar `/about`.* |
| **Formación avanzada · ML4Good** (Angel, Max, Isabel, Janeth) | `/activities` (sub-sección "Formación avanzada") **+** `/team` (referencia en bio individual) | **Split**. |
| **Conferencias y talleres · EAGxCDMX** ("Not so speedy AI Safety", Silvia, Angel, Jason) | `/activities` (sub-sección "Conferencias y talleres") | **Preserve**. |
| **Workshop "Your AI Agent Is Not You"** (Greywall + Claude Code, link externo) | `/activities` (sub-sección "Conferencias y talleres") | **Preserve**. **Gap menor**: falta fecha y lugar exactos. |
| **SPAR – Supervised Program for Alignment Research** (equipo MX + internacional + agradecimientos) | `/activities` (sub-sección "Programas de investigación") **+** `/research` (cross-link, porque produjo AI Safety Connect) | **Cross-reference**. |

### 1.10 Equipo (líneas 342–425)

| Elemento actual | Destino | Transformación |
| --- | --- | --- |
| Section heading + descripción | `/team` | **Preserve**. |
| 6 team-cards: Janeth, Angel, Jason, Isabel, Dexter, Karime (foto, nombre, rol, LinkedIn) | `/team` (sección "Core team") **+** `/` (preview con 3–4 caras) | **Preserve** estructura. **Gap mayor**: falta bio extendida (1–2 párrafos) por cada miembro para enriquecer la página. |
| **Advisors** (Dra. Silvia Fernández, Centro Geo) | `/team` (sección "Advisors") | **Preserve** + **gap** — falta foto, LinkedIn/perfil académico, bio. |

### 1.11 Aliados y colaboradores (líneas 428–443)

| Elemento actual | Destino | Transformación |
| --- | --- | --- |
| Partners-row: AI Safety Collab, ENAIS, Centro Geo, UADY, SPAR Research, Apart Research | `/team` (sección "Aliados") **+** `/about` (banda inferior) **+** `/` (banda) | **Preserve + replicate**. **Gap mayor**: faltan logos oficiales de cada aliado y URLs. |

### 1.12 Galería / Carousel (líneas 446–493)

| Elemento actual | Destino | Transformación |
| --- | --- | --- |
| 12 imágenes (8 carousel-image-N + Dexter.png + IMG_7302 + 2 screenshots) | `/activities` (sección "Galería") **+** `/` (preview de 3 imágenes) | **Refactor** — se mueve toda la galería a `/activities`. En Home solo aparecen 3 imágenes destacadas con CTA "Ver galería". El componente carousel se reutiliza como `Carousel.astro` (Task #11). **Gap menor**: alt-text genérico ("Actividad N"); reemplazar con descripciones específicas. |

### 1.13 Colabora con nosotros (líneas 496–524)

| Elemento actual | Destino | Transformación |
| --- | --- | --- |
| Section heading + descripción | `/get-involved` | **Preserve**. |
| 3 collab-cards: Investigación conjunta · Programas para instituciones · Eventos y advisory | `/get-involved` (sección "Formas de colaborar") | **Preserve**. |
| CTA "Escríbenos a contact@aismx.org" | `/get-involved` (final de página) | **Preserve** + **Refactor** — se reemplaza/complementa con formulario de contacto (componente `ContactForm`, Task #11). |

### 1.14 Contacto (líneas 527–533)

| Elemento actual | Destino | Transformación |
| --- | --- | --- |
| Heading + email | `/get-involved` (sección final "Contacto") | **Refactor** — se fusiona con la sección Colabora; el email queda como canal alterno al formulario. |

### 1.15 Footer (líneas 538–564)

| Elemento actual | Destino | Transformación |
| --- | --- | --- |
| Logo + nombre + íconos LinkedIn / Instagram | Componente global `Footer` | **Preserve**. |
| Footer-links (Proyectos, Investigación, Programas, Equipo, Colabora, Contacto) | Componente global `Footer` | **Refactor** — anchors → rutas (`/projects`, `/research`, `/programs`, `/team`, `/get-involved`). |
| Copy "© 2025 AI Safety Mexico" | Componente global `Footer` | **Refactor** — actualizar año dinámicamente (`{new Date().getFullYear()}`) y revisar año vigente (la fecha actual es 2026). |

---

## 2. Lista de gaps de contenido

Marcador: **[GAP-N]** = bloque con contenido insuficiente para que la página destino sea robusta. **No inventar hechos**; estos gaps son señalamientos para que el equipo editorial los llene.

### Página `/` (Home)
- **[GAP-1]** Falta una "tagline" o frase ancla más memorable que refuerce el subtítulo del hero (el actual es descriptivo pero largo).
- **[GAP-2]** No hay sección de "últimas noticias / blog teaser" — recomendable para mantener la home dinámica si se planea publicar regularmente.
- **[GAP-3]** No hay testimonios o quotes de participantes / aliados.

### Página `/about`
- **[GAP-4]** Sección "Historia / Origen" inexistente. Solo existe el dato "fundada en 2025" — falta narrativa de cómo y por qué surgió la organización, quiénes la fundaron originalmente, qué problema observaron.
- **[GAP-5]** Misión y visión no están escritas como tal (declaraciones formales). El párrafo introductorio funciona como descripción pero no como statement.
- **[GAP-6]** Cada uno de los 4 pilares (Investigación, Educación, Gobernanza, Comunidad) solo tiene título e ícono — falta 1 párrafo por pilar describiendo qué hacen concretamente en él.
- **[GAP-7]** No hay sección de "valores" o "principios" que guían el trabajo (transparencia, rigor científico, etc.).

### Página `/research`
- **[GAP-8]** "Evaluación de Seguridad en Modelos de IA" (Miguel Angel Peñaloza) tiene solo 1 párrafo. Faltan: objetivos específicos, metodología, métricas en desarrollo, timeline esperado, outputs previstos.
- **[GAP-9]** "AI Safety in Mexico: A Pilot Survey in Yucatan" — falta DOI, BibTeX/cita formal, abstract, número de respuestas/participantes, hallazgos clave.
- **[GAP-10]** No existe línea editorial / agenda de investigación (qué áreas priorizan: alignment, interpretability, governance, evaluations…).
- **[GAP-11]** Falta sección "Publicaciones futuras / preprints / working papers".

### Página `/programs`
- **[GAP-12]** Curso de Fundamentos: falta calendario, duración, formato (online/presencial/híbrido), idioma, requisitos, número de cohortes impartidas.
- **[GAP-13]** Curso Técnico (ARENA): falta cohorte, fechas, duración, criterios de selección, número de participantes a la fecha.
- **[GAP-14]** Cursos institucionales: faltan fechas concretas en Centro Geo y UADY, número de asistentes, programa/módulos.
- **[GAP-15]** No existe formulario / proceso de aplicación para futuras cohortes.
- **[GAP-16]** Falta sección "Testimonios de alumnos / egresados".

### Páginas `/projects`, `/projects/vigia`, `/projects/ai-safety-connect`
- **[GAP-17]** Página `/projects` (index) necesita un párrafo introductorio sobre qué tipo de proyectos hace AISMX y bajo qué criterios los selecciona.
- **[GAP-18]** Subpágina **VIGÍA**: falta detalle de qué hace la plataforma técnicamente (stack, datasets, screenshots de UI), estado actual (alpha/beta/prod), roadmap, cómo contribuir.
- **[GAP-19]** Subpágina **AI Safety Connect**: falta abstract del paper, screenshots de la plataforma, métricas de cobertura (cuántos autores / publicaciones mapeados), estado del deploy.
- **[GAP-20]** Faltan proyectos pasados / completados (si los hay) para dar profundidad histórica.

### Página `/team`
- **[GAP-21]** Falta bio extendida (1–2 párrafos) por cada miembro core: trayectoria, áreas de interés en AI Safety, publicaciones/proyectos asociados.
- **[GAP-22]** Advisor Dra. Silvia Fernández: falta foto, link a perfil académico (Google Scholar, ORCID), bio.
- **[GAP-23]** No existe sección "Colaboradores / Alumni" para reconocer a miembros que ya no están activos pero contribuyeron (p. ej. equipo VIGÍA: Pilar Carolina Moncada, Axel Pinelo). Hoy aparecen sólo en la prosa de proyectos.
- **[GAP-24]** No hay CTA "Únete al equipo" / proceso para nuevos miembros.

### Página `/activities`
- **[GAP-25]** Workshop "Your AI Agent Is Not You": falta fecha, lugar (¿venue?), número de asistentes.
- **[GAP-26]** EAGxCDMX: falta fecha del evento, link al programa oficial / video.
- **[GAP-27]** ML4Good: falta fecha y edición del campamento, lugar.
- **[GAP-28]** SPAR: falta cohorte/año, output específico (¿el paper de AI Safety Connect es el output?).
- **[GAP-29]** "Mesas de trabajo · Primer viernes del mes": falta agenda recurrente, formato, cómo registrarse.
- **[GAP-30]** Galería: alt-text genérico; cada imagen debería describir actividad/fecha/lugar.

### Página `/get-involved`
- **[GAP-31]** No existe formulario funcional — actualmente solo `mailto:`. Recomendado un form (Netlify/Formspree/serverless).
- **[GAP-32]** Faltan FAQs (¿qué nivel técnico se necesita? ¿hay roles para no-técnicos? ¿se aceptan aliados internacionales?).
- **[GAP-33]** Falta tabla / lista clara de "qué tipo de organización buscamos para cada modalidad de colaboración".
- **[GAP-34]** No hay opción de donaciones / sponsoring (relevante para una organización sin fines de lucro).

### Aliados / Partners
- **[GAP-35]** No hay logos oficiales de los 6 aliados — actualmente solo nombres en texto.
- **[GAP-36]** Falta URL/handle de cada aliado.
- **[GAP-37]** No hay descripción breve de la naturaleza de la colaboración con cada aliado.

### Global / SEO / metadata
- **[GAP-38]** Solo existe `<meta name="description">` en index. Faltan `og:image`, `og:title`, `twitter:card` y metadata por página.
- **[GAP-39]** No hay sitemap.xml ni robots.txt.
- **[GAP-40]** No hay versión en inglés (relevante porque varios papers / aliados son internacionales).

---

## 3. Lista de assets requeridos por página

Convención: ✅ disponible en `/restructure-homepage/images/`, ⚠️ existe pero requiere optimización/reemplazo, ❌ falta producir.

### Globales (todas las páginas)
- ✅ `images/aisafetymx_logo.webp` — logo header/footer.
- ✅ Íconos SVG inline LinkedIn / Instagram (en footer actual).
- ❌ Favicon multi-tamaño (16, 32, 180, 192, 512 px).
- ❌ Open Graph image (1200×630 px) genérica para social sharing.

### `/` Home
- ✅ `images/observatorio.png` — hero.
- ✅ Subset de carousel (3 imágenes destacadas) para preview de galería.
- ✅ `images/Equipo/*.jpeg|png` — preview de 3–4 miembros.
- ❌ Imágenes / logos para el banner "Global South AIS Challenge" (parcialmente disponibles en `images/gsh-*`).
- ✅ `images/gsh-event-card.png`, `images/gsh-header.png` — disponibles.

### `/about`
- ❌ Imagen institucional / foto de equipo conjunto (actualmente no existe).
- ✅ Reutilizar 4 íconos de pilares (emojis actualmente — recomendable migrar a SVG por consistencia).
- ❌ Diagrama / infografía de los 4 pilares y cómo se relacionan.

### `/research`
- ✅ `images/Certificados/AI Safety Connect.png` (póster/portada).
- ❌ Cover/thumbnail para "AI Safety in Mexico Pilot Survey" (puede ser screenshot de la primera página del PDF).
- ❌ Cover para proyecto "Evaluación de Seguridad en Modelos de IA".
- 📂 PDFs en `Papers/` (verificar disponibles para hosting local).

### `/programs`
- ✅ `images/Certificados/AI Safety Atlas Angel.jpeg`
- ✅ `images/Certificados/ENAIS Janeth.png`
- ✅ `images/Certificados/Centro Geo Angel.jpeg`
- ✅ `images/Certificados/UADY Angel.jpeg`
- ✅ `images/Certificados/SPAR Janeth.png` (no usado actualmente — incorporar).
- ❌ Logos oficiales de BlueDot Impact, ARENA, AI Safety Collab, AI Safety Atlas (referenciados como "Material").
- ❌ Fotos de cohortes / sesiones impartidas.

### `/projects` y subpáginas
- ✅ `images/Certificados/AI Safety Connect.png` — póster.
- ❌ Screenshot UI / logo del proyecto **VIGÍA** (la página externa existe en vigia-observatorio.github.io — tomar capturas).
- ❌ Screenshot UI de **AI Safety Connect** plataforma.
- ❌ Diagrama de arquitectura / flujo de datos para cada proyecto.
- ❌ Foto del equipo VIGÍA (5 personas).

### `/team`
- ✅ `images/Equipo/Janeth.jpeg`
- ✅ `images/Equipo/Angel.jpeg`
- ✅ `images/Equipo/Jason.jpeg`
- ✅ `images/Equipo/Isabel.jpeg`
- ✅ `images/Equipo/Dexter.png`
- ✅ `images/Equipo/Karime.jpeg`
- ❌ Foto de la advisor **Dra. Silvia Fernández**.
- ❌ Fotos de colaboradores externos referenciados (Pilar Carolina Moncada, Axel Pinelo, Janet Valdivia [si distinta de Janeth], Valeria Ramírez, Miguel Angel Peñaloza, equipo internacional SPAR).

### `/activities`
- ✅ Carousel completo (12 imágenes en `images/carousel/`).
- ✅ `images/gsh-*` — Global South AIS Challenge.
- ❌ Fotos de EAGxCDMX (taller "Not so speedy AI Safety").
- ❌ Fotos / screenshots del Workshop "Your AI Agent Is Not You" (puede incluir captura de Greywall + Claude Code).
- ❌ Fotos de ML4Good (campamento).
- ❌ Foto/captura del programa SPAR.

### `/get-involved`
- ❌ Imagen / ilustración de cabecera (actualmente sin hero específico).
- ❌ Íconos consistentes para las 3 modalidades de colaboración (hoy emojis).

### Aliados
- ❌ Logos oficiales (PNG/SVG transparentes) de: AI Safety Collab, ENAIS, Centro Geo, UADY, SPAR Research, Apart Research.

---

## 4. Sugerencias de contenido nuevo (placeholders editoriales)

Tono: editorial, formal-académico, primera persona plural, en español. Estos textos son **placeholders** para que el equipo edite y valide; **no inventan hechos verificables** (fechas, nombres, métricas) — usan lenguaje deliberadamente neutro donde haga falta dato duro.

### Para [GAP-4] — `/about` — Sección "Origen"

> AI Safety Mexico nace en 2025 como respuesta a una observación compartida por un grupo de investigadoras, ingenieros y profesionales en México: el debate sobre la seguridad de la inteligencia artificial avanza a una velocidad acelerada en el norte global, mientras que las preocupaciones, valores y contextos del sur global rara vez se incorporan en esa conversación. Decidimos articularnos para acortar esa distancia desde una región concreta —México y América Latina— y desde una práctica concreta: investigación rigurosa, formación abierta y diálogo con quienes diseñan políticas públicas.
> 
> *[Pendiente de validación editorial: añadir nombres de personas fundadoras y momento exacto de fundación si el equipo desea explicitarlos.]*

### Para [GAP-5] — `/about` — Misión y visión formales

> **Misión.** Promover la investigación, la educación y la gobernanza responsable de la inteligencia artificial en México y América Latina, asegurando que los sistemas de IA se desarrollen y desplieguen de forma segura, alineada con valores humanos y atenta a los contextos locales.
> 
> **Visión.** Una región en la que la voz del sur global tenga peso propio en la definición técnica y normativa de la seguridad de la IA, sostenida por una comunidad consolidada de investigadoras, educadoras y responsables políticos.

### Para [GAP-6] — `/about` — Descripción ampliada de los 4 pilares

> **Investigación.** Producimos trabajo original y colaborativo en alineación, interpretabilidad mecánica, evaluaciones de seguridad y gobernanza técnica, en colaboración con instituciones nacionales e internacionales.
> 
> **Educación.** Diseñamos e impartimos cursos abiertos y a la medida —para comunidades, universidades y centros de investigación— que adaptan los marcos contemporáneos de AI safety al contexto regional.
> 
> **Gobernanza.** Acompañamos procesos de consulta y diseño de políticas públicas con análisis técnicos, participaciones en mesas de trabajo y producción de documentos especializados.
> 
> **Comunidad.** Sostenemos espacios recurrentes de diálogo —mesas de trabajo, talleres, conferencias— que conectan a quienes investigan, desarrollan y regulan IA en la región.

### Para [GAP-7] — `/about` — Principios

> Trabajamos guiados por cuatro principios: **rigor científico** en cada publicación y proyecto; **apertura** del conocimiento que producimos —cursos, materiales y código abierto siempre que sea posible—; **independencia** respecto de intereses comerciales y políticos; y **arraigo regional**, entendiendo que la seguridad de la IA exige perspectivas situadas, no soluciones universales descontextualizadas.

### Para [GAP-10] — `/research` — Línea editorial

> Nuestra agenda de investigación se concentra en cuatro frentes: **(1) Evaluaciones de seguridad** en modelos de uso general; **(2) Interpretabilidad mecánica** aplicada a sistemas desplegados en español; **(3) Gobernanza técnica e instrumentos de política pública** orientados al contexto mexicano y latinoamericano; y **(4) Estudios cualitativos y cuantitativos** sobre percepciones, riesgos y prácticas locales. Priorizamos preguntas que rara vez se aborden desde el norte global y publicamos en venues abiertos siempre que la naturaleza del trabajo lo permita.

### Para [GAP-17] — `/projects` — Introducción

> Los proyectos de AI Safety Mexico nacen en la intersección de tres condiciones: una pregunta concreta sobre seguridad o gobernanza de IA, un equipo técnico capaz de abordarla con rigor, y un compromiso de hacer públicos los hallazgos. Algunos surgen como tesis de cohortes formativas; otros como colaboraciones con organizaciones aliadas. Todos son auditables, abiertos y orientados a producir conocimiento utilizable por quienes investigan, regulan o despliegan IA en la región.

### Para [GAP-24] — `/team` — CTA "Únete al equipo"

> ¿Te interesa trabajar con nosotros? AI Safety Mexico crece a partir de cohortes formativas, colaboraciones puntuales y residencias de investigación. Si tu trabajo se alinea con nuestra agenda, escríbenos a contact@aismx.org con una breve descripción de tu trayectoria y la línea de trabajo que te interesa explorar.

### Para [GAP-29] — `/activities` — Mesas de trabajo

> **Mesas de trabajo · Primer viernes del mes.** Sesiones recurrentes en las que el equipo y personas invitadas discutimos avances de proyectos, lecturas recientes y preguntas abiertas en seguridad de IA. La participación es por invitación; si te interesa sumarte, escríbenos describiendo tu interés.

### Para [GAP-32] — `/get-involved` — FAQs sugeridas

> **¿Necesito formación técnica para colaborar?** No necesariamente. Buscamos perfiles técnicos para investigación y desarrollo, y perfiles de ciencias sociales, políticas públicas, derecho y comunicación para gobernanza, educación y advocacy.
> 
> **¿Aceptan colaboraciones internacionales?** Sí. Trabajamos regularmente con investigadores y organizaciones fuera de México; nuestro foco regional no implica exclusión geográfica.
> 
> **¿Pueden impartir un curso para mi institución?** Sí. Diseñamos programas a la medida; el alcance, duración y costo dependen del proyecto. Escríbenos para explorar opciones.

### Para [GAP-37] — Aliados — Descripción de la colaboración (formato sugerido)

> *Plantilla — el equipo debe completar con datos verificables:*
> 
> **AI Safety Collab.** Programa global de proyectos de investigación en AI safety. Colaboramos a través de cohortes y reconocimientos a proyectos del equipo (p. ej. *Special Recognition* a VIGÍA en 2025).
> 
> **ENAIS.** Espacio nacional / red de AI safety en *[país a confirmar]*. Cocreamos el curso de AI Governance del que surgió VIGÍA.
> 
> **Centro Geo.** Centro de investigación geoestadística donde se han impartido cursos especializados de seguridad en IA.
> 
> **UADY · Facultad de Matemáticas.** Sede académica de cursos abiertos al público universitario.
> 
> **SPAR Research.** Programa que conecta talento emergente con especialistas en alineación; alojó la colaboración que produjo *AI Safety Connect*.
> 
> **Apart Research.** Aliado en organización de hackathones y eventos regionales (*Global South AIS Challenge*).

---

## 5. Notas para el siguiente paso (Astro-scaffolder, Task #5)

- La estructura de páginas (8 páginas top-level + 2 subpáginas en `/projects/`) coincide con lo descrito en el sitemap de Task #1 (Architect).
- El componente `Carousel` es candidato a *island* interactivo (Task #11).
- El componente `CertificateGallery` se infiere de los bloques `program-certificates` actuales (Task #10).
- Preservar los emojis de los pilares y collab-cards o migrarlos a SVG es una decisión que toca al **Design-system-spec** (Task #3).
- Los archivos `global-south-ais-challenge.html` y `ai-safety-connect.html` actuales del repo viven fuera del scope Astro inicial; pueden migrarse en una fase posterior o conservarse como `public/` estáticos.

---

**Total de gaps detectados: 40** (numerados [GAP-1] a [GAP-40]).
