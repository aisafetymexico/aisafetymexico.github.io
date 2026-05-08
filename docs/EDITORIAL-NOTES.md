# Editorial Notes — Critical external pass

**Auditor:** `editor-in-chief` (Task #24)
**Date:** 2026-05-07
**Build:** `npm run build` verde · `astro preview` en `http://127.0.0.1:4444`
**Lente:** director(a) de programas en una organización internacional (Anthropic, FLI, Open Phil, GovAI) con 5 minutos para decidir si AI Safety Mexico es un aliado serio en LATAM.
**Inputs:** lectura de `docs/QA-VISUAL.md`, `docs/QA-FUNCTIONAL.md`, `docs/QA-A11Y.md`, `docs/QA-PERF-SEO.md` + recorrido manual del sitio en orden de descubrimiento (`/` → `/about` → `/projects` → `/projects/vigia` → `/projects/ai-safety-connect` → `/research` → `/programs` → `/team` → `/activities` → `/get-involved` → `/contact`).

> **No se implementó ningún fix.** Esta nota identifica únicamente. La aplica `final-fixer` (Task #25).

---

## Sentiment global

**Veredicto:** *promising-but-rough*. La arquitectura editorial (gateway curado en Home, narrativa "investigación · educación · gobernanza", taxonomía de proyectos, breadcrumbs, cards a profundizar) está sólida y proyecta seriedad académica. Funcionalmente todo opera (27/27 PASS en functional QA, sin críticos en a11y). Pero **tres defectos de credibilidad** —un placeholder "Nota editorial" visible, un CTA destacado que devuelve 404, y la tarjeta VIGÍA mostrando la imagen de otro proyecto— bastarían para cerrar la pestaña antes de los 5 minutos. Una vez corregidos esos tres más cuatro problemas de pulido (advisor con logo placeholder, bandas de imagen vacías, pesos de imagen, contraste AA), el sitio queda en condiciones de presentarse como carta de presentación a Open Phil/FLI/GovAI.

**Página más fuerte:** `/projects/ai-safety-connect` — narrativa clara, paper descargable, equipo internacional visible.
**Página más débil:** `/team` — el bloque "Advisors" con un único card mostrando el logo de la organización en lugar de la advisor real es el mayor golpe a gravitas.

---

## TOP-7 fixes finales priorizados

### #1 · CRITICAL · `/about` — sección "Origen / Cómo nació AI Safety Mexico"
**Problema:** un Callout con la frase **"Nota editorial. Esta narrativa será afinada por el equipo editorial con nombres específicos de personas fundadoras y fechas exactas una vez validados."** queda visible al lector externo en la página "Quiénes somos".
**Fix recomendado:** eliminar por completo el `<Callout tone="info">` o reemplazar el bloque con la narrativa de fundación validada (nombres + fecha exacta). Un placeholder de proceso interno no debe llegar al visitante.
**Ref:** `src/pages/about.astro:219-225`.

---

### #2 · CRITICAL · Home / Footer / `/activities` — destacado "Global South AIS Challenge"
**Problema:** el destino `/global-south-challenge` devuelve **404** y está enlazado desde tres puntos prominentes (highlight de Home, footer, sección destacada de `/activities`) — un visitante que clickea el evento "activo" más visible del sitio aterriza en página rota.
**Fix recomendado:** crear `src/pages/global-south-challenge.astro` portando el contenido del legacy `global-south-hackathon.html` (existente fuera del build), o repointar los tres `href` a la URL externa de Apart Research/Luma del evento. Bloqueante de lanzamiento.
**Ref:** `src/components/Footer.astro:58`, `src/pages/index.astro:115`, `src/pages/activities.astro:44`.

---

### #3 · CRITICAL · `/projects` — card "VIGÍA"
**Problema:** la card del proyecto insignia VIGÍA muestra como cover **la misma imagen** que AI Safety Connect (`/images/Certificados/AI Safety Connect.png`); el grid de portafolio se ve duplicado y se pierde la lectura "dos proyectos distintos".
**Fix recomendado:** sustituir `cover.src` por una captura real de la plataforma VIGÍA (p. ej. `/images/observatorio.png` o un screenshot dedicado), o eliminar el cover y dejar que el `ProjectCard` use su tratamiento sin imagen.
**Ref:** `src/content/projects/vigia.md:7-9` (y `cover` línea ~7).

---

### #4 · HIGH · `/team` — sección "Advisors"
**Problema:** la única card de advisors (Dra. Silvia Fernández) usa **el logo institucional** como foto, con `alt="AI Safety Mexico (foto pendiente)"`; visualmente comunica "no tenemos asesoras", lo opuesto a la intención.
**Fix recomendado:** conseguir la foto real antes del lanzamiento; alternativamente ocultar el bloque "Advisors" hasta tener material listo, o renderizar una variante text-only de `TeamCard` (sin imagen, con borde lateral) para esta entrada.
**Ref:** `src/pages/team.astro:84-95`.

---

### #5 · HIGH · `/activities`, `/programs`, `/research` — bandas de imagen vacías en cards
**Problema:** los `ActivityCard` de "Conferencias, talleres y formación" + "Mesas de trabajo recurrentes", los slots de "Galería de certificados" en `/programs` y los `ProjectCard` de "Investigación en desarrollo" muestran rectángulos crema/durazno vacíos donde debería ir imagen — leen como assets rotos.
**Fix recomendado:** condicionar el render del slot de imagen a la presencia de `image` (drop del `__media-placeholder` cuando el dato falta) en `ActivityCard.astro` y `ProjectCard.astro`, o suministrar imágenes reales para cada item.
**Ref:** `src/components/ActivityCard.astro:68,127`; `src/components/ProjectCard.astro:63,132`; pages `src/pages/activities.astro:70-91`, `src/pages/research.astro:78-95`.

---

### #6 · HIGH · Site-wide — pesos de imagen torpedean LCP en móvil 4G
**Problema:** se sirven sin optimizar `observatorio.png` (2.6 MB, hero de Home), dos screenshots del carousel de 6.8 MB y 3.2 MB, y `aisafetymx_logo.webp` 2.1 MB que carga en cada página; QA-PERF-SEO proyecta LCP móvil de 6–10 s. Un visitante internacional en 4G/avión cierra la pestaña antes del primer paint.
**Fix recomendado:** migrar todos los `<img src="/images/...">` críticos a `astro:assets <Image />` (genera AVIF/WebP + `srcset` + width/height — también resuelve el CLS de `/team` y `/get-involved`); re-exportar las dos screenshots a ≤300 KB y el logo a ≤50 KB.
**Ref:** `src/pages/index.astro:82` (hero), `src/pages/activities.astro:96-107` (carousel), `src/components/Header.astro` y `src/components/Footer.astro` (logo). Punch-list completa en `docs/QA-PERF-SEO.md` §4.

---

### #7 · HIGH · Site-wide — WCAG AA contrast failures en tokens de marca
**Problema:** los CTAs blancos sobre naranja (`#fff` / `#c4854a` = 3.08 : 1) y el eyebrow dorado sobre slate (`#d4a853` / `#545a70` = 3.09 : 1) fallan WCAG 2.1 AA en **316 nodos × 11 rutas**; son los dos elementos visibles en cada página, lo que hace al sitio **conditional fail** AA y compromete la postura de "AI safety incluye accesibilidad".
**Fix recomendado:** ajustar `--color-accent` y `--color-cta-bg` (y su derivado `is-active`) en `src/styles/tokens.css` para alcanzar 4.5:1 (p. ej. eyebrow `#f0c878` o background slate `#3a3f52`; CTA background `#a35a1f` o texto `#1a1410`). Un solo cambio de tokens cascadea a todo el sitio.
**Ref:** `src/styles/tokens.css` (`--color-accent`, `--color-cta-bg`); detalle en `docs/QA-A11Y.md` §3.1.

---

## Notas editoriales secundarias (no entran al TOP-7 pero conviene tener en radar)

- **MED · Header @ 768 px:** el pill "Colabora" se solapa con el wordmark en tablet en cinco rutas. Subir el breakpoint que dispara el hamburger a ≤900 px (`src/components/Header.astro` / `Nav.astro`). *(Detalle: QA-VISUAL §H2.)*
- **MED · Hero móvil:** `observatorio.png` se renderiza como thumbnail decorativo a 375 px en `/`; debería span 100% del container o usar un crop mobile-first. *(QA-VISUAL §H1.)*
- **MED · Iconos pillar emoji:** `🔬📚🛠️👥` en Home y About leen como startup casual; para postura ante FLI/GovAI conviene íconos line/duotone consistentes (Phosphor, Lucide) en el design system.
- **MED · Stats bar `6+ / 30+ / 3 / 10+`:** son honestos pero modestos sin contexto; añadir "Desde 2025" bajo el bar evita que se lean como "organización pequeña" y los enmarca como "trayectoria temprana medida". *(`src/pages/index.astro:62-67`.)*
- **MED · Form `mailto:`:** funciona pero genera fricción para visitantes en webmail/SO sin cliente nativo; la propia funcional-QA recomienda Formspree o endpoint HTTPS. *(QA-FUNCTIONAL §5.)*
- **MED · `/get-involved` 2-col irregular y duplica info de `/contact`:** ver QA-VISUAL §GI1, §GI2 — recortar el bloque "Contacto directo" o linkearlo a `/contact`.
- **MED · `/projects/ai-safety-connect`:** banda crema vacía ~280 px entre "Reporte final" y "Co-investigadores"; chip "5 co-investigadores" duplica info ya listada. *(QA-VISUAL §AS1, §AS2.)*
- **LOW · Separadores de `<title>`:** mezcla `·`, `—`, `|`. Estandarizar a ` · ` por marca. *(QA-PERF-SEO §3.2.)*
- **LOW · Active nav state:** `aria-current="page"` apenas distinguible en header oscuro; añadir underline u orange tint. *(QA-VISUAL §H5.)*

---

## Resumen para el team-lead

| # | Severidad | Página · Sección | Una línea |
|---|---|---|---|
| 1 | CRITICAL | `/about` · Origen | Eliminar el Callout "Nota editorial" visible al usuario |
| 2 | CRITICAL | Home / Footer / `/activities` | `/global-south-challenge` 404 desde 3 puntos prominentes |
| 3 | CRITICAL | `/projects` · VIGÍA card | Cover de VIGÍA está usando la imagen de AI Safety Connect |
| 4 | HIGH | `/team` · Advisors | Card de advisor usa logo institucional como placeholder |
| 5 | HIGH | `/activities` + `/programs` + `/research` | Bandas de imagen vacías leen como asset roto |
| 6 | HIGH | Site-wide | Imágenes pesadas (>30 MB) torpedean LCP móvil |
| 7 | HIGH | Site-wide | Tokens de eyebrow y CTA fallan WCAG AA contrast |

**Puntaje editorial global:** 6.5/10 hoy → 8.5/10 si se aplican #1–#3 (críticos) + #4–#5 (cosméticos altos). Los items #6–#7 elevan la solidez técnica para un ojo experto pero no bloquean el primer impacto.
