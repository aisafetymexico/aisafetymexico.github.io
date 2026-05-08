# Pendientes que requieren intervención humana

> Generado por **final-fixer** (Task #25) · Fecha: 2026-05-07
>
> Este documento recoge los items de los QA y de la revisión editorial
> (`docs/EDITORIAL-NOTES.md`) que **no se aplicaron automáticamente** porque
> requieren validación humana, decisión editorial o material que no está en
> el repositorio. Ninguno de estos items bloquea el build (`npm run build`
> termina verde con los fixes ya aplicados), pero todos influyen en la
> calidad de la primera impresión y en métricas técnicas reales (LCP, CLS,
> SEO score).

---

## 1 · Recomprimir / regenerar binarios pesados (CRITICAL para LCP móvil)

`final-fixer` no recomprime binarios sin validación humana porque la pérdida
de calidad puede hacer que el equipo rechace la nueva versión. Listado por
peso, ordenado por impacto:

| Archivo | Tamaño actual | Objetivo | Uso | Prioridad |
|---|---|---|---|---|
| `public/images/carousel/Screenshot 2026-03-05 at 1.34.26 p.m..png` | **6.8 MB** | ≤ 300 KB JPEG/WebP | `/activities` carousel | **alta** |
| `public/images/carousel/Screenshot 2026-03-05 at 12.16.56 p.m..png` | **3.2 MB** | ≤ 300 KB JPEG/WebP | `/activities` carousel | **alta** |
| `public/images/observatorio.png` | **2.6 MB** | ≤ 250 KB AVIF/WebP | Hero de Home + cover de VIGÍA | **crítica** (LCP) |
| `public/images/aisafetymx_logo.webp` | **2.1 MB** | ≤ 50 KB WebP/PNG | Header + Footer (todas las páginas) | **crítica** |
| `public/images/carousel/Dexter.png` | 1.3 MB | ≤ 200 KB | carousel | media |
| `public/images/carousel/IMG_7302 Copy.JPG` | 1.2 MB | ≤ 200 KB | carousel | media |
| `public/images/carousel/carousel-image-7.jpeg` | 1.2 MB | ≤ 200 KB | carousel | media |

### Acción sugerida

1. Re-exportar cada imagen a la resolución máxima realmente usada en pantalla
   (consulta el inspector de `astro preview` para el ancho efectivo).
2. Para `observatorio.png` y el logo: convertir a AVIF y/o WebP con calidad
   ~80 — esos dos archivos viajan en cada página.
3. El logo de 2.1 MB en formato `.webp` es anómalo (un logo simple debería
   pesar ≤ 50 KB). Es muy probable que se haya guardado a 4096×4096 o con
   alpha innecesario.
4. Reemplazar los archivos en `/public/images/` con el mismo nombre — los
   componentes ya consumen las rutas correctas.

### Por qué no se hizo automáticamente

Los binarios viven en `/public/`, no en `/src/assets/`, por lo que
`astro:assets <Image />` no los reescribe. Mover ~30 imágenes a
`src/assets/`, importarlas con `import imgX from '...'` y refactorar los
componentes implicados es una migración de scope mediano que conviene hacer
con el equipo, no en este pase de fixes.

Si más adelante quieren la migración automática a `astro:assets`, los
candidatos en orden son:

- `Header.astro` y `Footer.astro` (logo) → `<Image src={...} />` con
  `widths={[40, 80, 140]}`.
- `Hero.astro` (cuando recibe `image.src` como string) → aceptar también
  `ImageMetadata` y delegar en `<Image />`.
- `ProjectCard.astro` y `ActivityCard.astro` → mismo patrón.

---

## 2 · Foto oficial de la advisor (HIGH editorial)

`docs/EDITORIAL-NOTES.md §#4` — la card de la **Dra. Silvia Fernández**
mostraba el logo institucional como foto, leyéndose visualmente como "no
tenemos asesoras". Como solución temporal, este pase reemplazó el grid de
`TeamCard` por un bloque de texto sobrio (nombre + rol + afiliación) en
`src/pages/team.astro`.

### Acción sugerida

- Pedir foto oficial a la Dra. Fernández (similar tratamiento al resto del
  core team: cuadrada, ≥ 600×600 px, sobre fondo neutro).
- Una vez disponible: revertir el cambio en `team.astro` y volver a usar
  `<TeamCard>` con `photo={...}` para presentar el bloque visualmente
  consistente con el equipo principal.

---

## 3 · Narrativa fundacional con nombres y fechas validadas

`docs/EDITORIAL-NOTES.md §#1` — el callout "Nota editorial. Esta narrativa
será afinada por el equipo editorial..." se eliminó de `/about`. La
narrativa que queda es genérica ("equipo fundador multidisciplinario",
"se constituyó formalmente en 2025"). Si el equipo desea presentarse con
gravitas ante interlocutores como Open Phil o FLI, conviene:

- Reemplazar el párrafo de origen con nombres específicos de las personas
  fundadoras y la fecha exacta de constitución.
- Validar que la lista de venues internacionales (EAGxCDMX, ML4Good, SPAR)
  refleja la asistencia real, no la ambición.

Archivo a editar: `src/pages/about.astro` — sección "Origen" (~líneas 195–220).

---

## 4 · Form de contacto sin backend (MED · QA-FUNCTIONAL §5)

El form en `/contact` y `/get-involved` usa `mailto:` — funciona pero genera
fricción para quienes leen correo en webmail o en sistemas sin cliente
configurado. La QA funcional recomendó migrar a un endpoint HTTPS
(Formspree, Netlify Forms, o un endpoint propio).

Decisión humana requerida: ¿se quiere depender de un servicio externo
(Formspree gratis cubre el caso) o desplegar un endpoint propio? Una vez
tomada la decisión, el cambio en `ContactForm.astro` es de < 30 LOC.

---

## 5 · Iconos pillar (MED · editorial)

`docs/EDITORIAL-NOTES.md` Notas secundarias — los íconos emoji 🔬 📚 🛠️ 👥
en Home/About leen como startup casual frente al posicionamiento académico
del resto del sitio. Reemplazo recomendado: ícono line/duotone consistente
(Phosphor, Lucide).

Esta migración es estética y requiere licenciar/incrustar los SVGs; no se
aplicó automáticamente. La estructura está lista en
`FeatureGrid.astro` / `PillarCard.astro` para recibir los íconos como
componentes en lugar de strings.

---

## 6 · Texto adicional bajo el StatBar (MED · editorial)

Editor sugiere añadir "Desde 2025" bajo `6+ / 30+ / 3 / 10+` en
`src/pages/index.astro` para enmarcar las cifras como "trayectoria temprana
medida" en vez de "organización pequeña". Cambio trivial pero requiere
confirmación del año de inicio (¿es 2025 o 2024?).

---

## 7 · Imagen del header de móvil (MED · QA-VISUAL §H1)

`observatorio.png` se renderiza como thumbnail decorativo a 375 px en `/`.
Una vez se recomprima (item #1), conviene también producir un crop
mobile-first (1×1 o 4×3) que se vea contundente, no decorativo, y servirlo
con `<picture>` o `Image widths={[375, 768, 1200]}`.

---

**Resumen para coordinación:** items 1, 2 y 3 son los que el editor
identificó como "credibility blockers"; items 4–7 son refinamiento. La
prioridad operativa es:

1. (Crítica · sin desarrollo) Recomprimir imágenes pesadas (#1).
2. (Crítica · sin desarrollo) Conseguir la foto de la Dra. Fernández (#2).
3. (Alta · editorial) Reescribir narrativa de origen con datos validados (#3).
