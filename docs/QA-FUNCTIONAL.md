# QA Funcional — AI Safety Mexico (Astro rebuild)

**Tarea:** #21 · P5 Playwright functional QA
**Fecha:** 2026-05-07
**Owner:** functional-qa
**Build:** verde (`npm run build` → 11 páginas, 1.32s)
**Servidor:** `npm run preview` en `http://127.0.0.1:4322` (puerto distinto a visual-qa para evitar colisión)
**Spec:** [`playwright/functional-qa.spec.mjs`](../playwright/functional-qa.spec.mjs)
**Resultado JSON:** [`playwright/functional-results/results.json`](../playwright/functional-results/results.json)

## Resumen

| Métrica | Valor |
| --- | --- |
| **Total checks** | **27** |
| **PASS** | **27** ✓ |
| **FAIL** | **0** |
| **Tiempo total** | 8.7 s |
| **Bloqueantes** | ninguno |

> Todas las interacciones críticas funcionan correctamente. La rebuild Astro
> está lista funcionalmente para entrar a la pasada de editor-in-chief (#24).

## Cobertura por interacción

### 1. Navegación primaria (desktop @ 1440px) — 6/6 PASS

| Link | Destino | Resultado |
| --- | --- | --- |
| Sobre nosotros | `/about` | ✓ PASS — 200 |
| Investigación | `/research` | ✓ PASS — 200 |
| Programas | `/programs` | ✓ PASS — 200 |
| Proyectos | `/projects` | ✓ PASS — 200 |
| Actividades | `/activities` | ✓ PASS — 200 |
| Colabora (CTA) | `/get-involved` | ✓ PASS — 200 |

Todos los links del nav cargan con respuesta `OK` y URL final coincidente.

### 2. Menú móvil hamburger (viewport 375×812) — 4/4 PASS

| Acción | Resultado |
| --- | --- |
| Abrir drawer (click `[data-mobile-toggle]`) | ✓ PASS — `aria-expanded=true`, drawer visible |
| Navegar a `/about` desde drawer | ✓ PASS — URL = `/about` |
| Re-abrir drawer en `/about` y navegar a `/research` | ✓ PASS — URL = `/research` |
| Cerrar con tecla `Escape` | ✓ PASS — `aria-expanded=false` |

El hamburger respeta accesibilidad: `aria-expanded`, `aria-modal`, focus trap,
ESC cierra y restaura focus al toggle.

### 3. Carrusel en `/activities` — 4/4 PASS

| Acción | Resultado |
| --- | --- |
| Montaje del carrusel | ✓ PASS — **12 slides**, 12 indicadores |
| Click "siguiente" (`[data-carousel-next]`) | ✓ PASS — slide activo `0 → 1` |
| Click "anterior" (`[data-carousel-prev]`) | ✓ PASS — slide activo `1 → 0` |
| Click indicador `[data-index="3"]` | ✓ PASS — slide activo `= 3` |

Autoplay se detiene correctamente al hacer click en `playpause`. Los
indicadores reflejan la slide activa con la clase `is-active`.

### 4. Lightbox de certificados en `/programs` — 5/5 PASS

| Acción | Resultado |
| --- | --- |
| Triggers presentes (`button[data-lightbox]`) | ✓ PASS — **6 certificados** detectados |
| Click certificado → abre lightbox | ✓ PASS — `[data-lightbox-overlay]` visible, `[data-lightbox-image]` con `src` poblado |
| Click "siguiente" (`[data-lightbox-next]`) | ✓ PASS — `src` cambia a la siguiente imagen del grupo |
| Cerrar con tecla `Escape` | ✓ PASS — overlay oculto |
| Cerrar con `[data-lightbox-close]` | ✓ PASS — overlay oculto |

El lightbox agrupa correctamente las 6 imágenes via
`data-lightbox-group="certificates"` y permite navegación interna.

### 5. Formulario de contacto en `/get-involved` — 4/4 PASS

| Acción | Resultado |
| --- | --- |
| Montaje y campos requeridos | ✓ PASS — 4 campos `required` (name, email, type, message) |
| HTML5 validation bloquea submit vacío | ✓ PASS — `form.checkValidity() === false` |
| Email inválido (`"not-an-email"`) rechazado | ✓ PASS — `checkValidity()` sigue `false` con email malformado |
| Form válido dispara acción `mailto:` | ✓ PASS — `data-endpoint="mailto:contact@aismx.org"`, submit handler arma `mailto:` con asunto y body codificados |

Confirmado: el script inline en `/get-involved` lee `data-endpoint`, detecta
`mailto:`, hace `preventDefault()` y construye el `mailto:` con `subject` y
`body` (URL-encoded). Honeypot `website` correctamente marcado `tabindex="-1"`.

> **Nota:** el formulario actualmente abre el cliente de correo por
> `mailto:`. Si el equipo desea un endpoint HTTPS (Formspree, Netlify Forms,
> backend propio), basta con cambiar `data-endpoint` al URL — el script ya
> hace `fetch POST` JSON automáticamente para `https://...`.

### 6. Breadcrumbs — 4/4 PASS

| Acción | Resultado |
| --- | --- |
| `/projects/vigia` → click "Inicio" | ✓ PASS — navega a `/` |
| `/projects/vigia` → click "Proyectos" | ✓ PASS — navega a `/projects` |
| `/projects/vigia` → ítem actual no es link | ✓ PASS — `<span aria-current="page">VIGÍA</span>` |
| `/about` (mobile 375) → back-link `‹ Inicio` | ✓ PASS — navega a `/` |

> El back-link `.breadcrumb__back` está intencionalmente oculto en desktop
> (`display: none`) y sólo visible en viewports `< 768px` (mobile-first
> pattern). El test cubre ambas variantes.

## Hallazgos secundarios (no son fallas)

1. **Carrusel auto-advance:** activo por defecto (`data-autoadvance="true"`).
   El spec lo pausa antes de tests deterministas para evitar carreras. En
   producción esto es OK; podría considerarse pausarlo cuando el usuario
   interactúa por primera vez (mejora UX, no es bloqueante).

2. **Form mailto:** funciona pero abre cliente de correo del SO; en mobile
   esto puede ser fricción. Considerar Formspree o endpoint HTTPS para v1.1
   (no bloqueante para el lanzamiento).

3. **Breadcrumb back-link:** oculto en desktop por diseño. Si el equipo
   quiere mostrarlo siempre, levantar la regla `display: none` del default
   en `Breadcrumb.astro`.

## Cómo reproducir

```bash
# Desde el worktree
npm run build              # build verde requerido
npm run preview -- --port 4322 --host 127.0.0.1 &
BASE_URL=http://127.0.0.1:4322 node playwright/functional-qa.spec.mjs
```

Salida JSON estructurada en
`playwright/functional-results/results.json` con `pass`, `fail`, `results[]`
(name, status, detail) por cada interacción.

## Veredicto

✅ **Todas las interacciones funcionan.** No hay bloqueantes para #24
(editor-in-chief) en lo que respecta a comportamiento funcional. Cualquier
cambio futuro en nav, carrusel, lightbox, form o breadcrumbs debería
re-correr este spec antes de mergear.
