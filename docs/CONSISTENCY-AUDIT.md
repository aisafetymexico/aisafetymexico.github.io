# Consistency Audit — Leftover inconsistencies after content removals

**Scope:** `src/` (pages, components, content collections).
**Excluded:** `docs/` (process artefacts), `dist/`, `node_modules/`, legacy
`*.html` files at repo root.

**Context.** Recent removals on `main`:
1. Miguel Ángel Peñaloza (persona).
2. Proyecto "Evaluación de Seguridad en Modelos de IA" (línea de trabajo de
   Peñaloza, descontinuada).
3. Referencias a Latinoamérica / LATAM (alcance ahora estrictamente México;
   excepción legítima: Global South AIS Challenge, ML4Good cohort, EAGx).
4. Frase del hero "dialogamos con políticas públicas" → reformulada a
   "construimos las bases técnicas y de gobernanza necesarias para que México
   tome decisiones informadas sobre IA".

Esta auditoría enumera las menciones colaterales que quedaron y que ya no son
consistentes con esas remociones. **Sólo lectura: no se aplican fixes.**

---

## Resumen ejecutivo

| Categoría | Count |
|-----------|-------|
| A — "Evaluaciones de seguridad" como actividad propia de AISMX | 4 |
| B — Pilares / áreas de investigación que listan "evaluaciones" como eje propio | 3 (subset de A) |
| C — Stats descalibradas en home | 2 |
| D — Roles de team members con áreas removidas | 0 |
| E — Residuos LATAM / Latinoamérica fuera de contexto GSH | 0 |
| F — Frases que sobre-afirman política / diálogo institucional | 4 |
| G — Otros (defaults inconsistentes, residuos de copy) | 2 |

**Total:** 12 inconsistencias accionables (descontando solapamientos A∩B).

### Top-5 más críticas

1. **`src/pages/index.astro:35`** — Pilar Investigación menciona "evaluaciones
   de seguridad" como línea propia. *(El caso que motivó la auditoría.)*
2. **`src/pages/about.astro:50`** — Mismo pilar replicado en /about con la
   misma promesa de "evaluaciones de seguridad".
3. **`src/pages/research.astro:52`** — Área de investigación "AI Safety
   técnica" la encabeza con "Evaluaciones de seguridad" como primer ítem.
4. **`src/pages/about.astro:201-202`** — Narrativa de origen dice "diálogo con
   quienes diseñan políticas públicas", paráfrasis casi literal de la frase
   removida del hero.
5. **`src/pages/index.astro:61`** — Stat "3 Publicaciones" cuando la colección
   `src/content/publications/` solo contiene una entrada activa
   (`ai-safety-mexico-pilot-survey-yucatan.md`). Sobreafirma producción.

---

## A. Menciones de "evaluaciones de seguridad" como actividad propia de AISMX

### A.1 — `src/pages/index.astro:35`

**Texto actual.**
```
'Trabajo original y colaborativo en alineación, evaluaciones de seguridad
 y gobernanza técnica. Saber más →'
```

**Inconsistencia.** La card "Investigación" de la home presenta "evaluaciones
de seguridad" como uno de los tres pilares activos. Esa línea de trabajo era
de Peñaloza y ya no continúa.

**Recomendación.** Remover "evaluaciones de seguridad" y mantener dos pilares
auténticos. Sugerencia:
> 'Trabajo original y colaborativo en alineación, interpretabilidad y
> gobernanza técnica. Saber más →'

Opción más conservadora (sólo dos áreas):
> 'Trabajo original y colaborativo en alineación y gobernanza técnica de IA.
> Saber más →'

---

### A.2 — `src/pages/about.astro:50`

**Texto actual.**
```
'Producimos trabajo original y colaborativo en alineación, interpretabilidad
 mecánica, evaluaciones de seguridad y gobernanza técnica, en colaboración
 con instituciones nacionales e internacionales.'
```

**Inconsistencia.** Réplica expandida del pilar Investigación en /about. Misma
sobre-afirmación, mismo origen (Peñaloza).

**Recomendación.** Remover "evaluaciones de seguridad":
> 'Producimos trabajo original y colaborativo en alineación, interpretabilidad
> mecánica y gobernanza técnica, en colaboración con instituciones nacionales
> e internacionales.'

---

### A.3 — `src/pages/research.astro:50-53`

**Texto actual.**
```ts
{
  title: 'AI Safety técnica',
  description:
    'Evaluaciones de seguridad, alineación e interpretabilidad mecánica aplicadas a modelos desplegados.',
},
```

**Inconsistencia.** La primera de las cuatro áreas de investigación encabeza
su descripción con "Evaluaciones de seguridad". El usuario que aterriza en
/research lee "evaluaciones" como el ítem #1 de la oferta técnica de AISMX.

**Recomendación.** Reordenar y remover la mención:
> 'Alineación, interpretabilidad mecánica y red-teaming aplicados al estudio
> de modelos desplegados.'

Alternativa si se quiere conservar "modelos desplegados":
> 'Investigación aplicada en alineación e interpretabilidad mecánica de
> modelos desplegados.'

---

### A.4 — `src/pages/programs.astro:173`

**Texto actual.**
```
description="Curso especializado para investigadoras e investigadores del
Centro de Investigación en Ciencias de Información Geoespacial, con énfasis
en evaluaciones de seguridad y gobernanza técnica."
```

**Inconsistencia.** Borderline. "Evaluaciones de seguridad" aparece como
*énfasis curricular del curso institucional con Centro GEO*. Pedagógicamente
puede ser legítimo (las evaluaciones son un tema enseñable), pero al venir
inmediatamente después de A.1–A.3, refuerza la lectura de que evaluaciones
son una línea AISMX.

**Recomendación.** Reformular para que el énfasis quede en la enseñanza, no
en la práctica propia. Sugerencia:
> '...con énfasis en marcos contemporáneos de alineación, riesgos sistémicos
> y gobernanza técnica.'

Si el curso efectivamente incluyó módulo de evaluaciones (verificar con
quien lo impartió, Angel Cervantes), reformular como:
> '...que aborda fundamentos de alineación, técnicas de evaluación de modelos
> y gobernanza técnica.'

(El verbo "aborda" es educativo; "con énfasis en evaluaciones" sonaba a
agenda institucional.)

---

### Casos NO accionables (educativos / eventos puntuales legítimos)

Estos quedan, no se tocan:

- `src/pages/programs.astro:148` — ARENA enseña "evaluaciones de modelos".
  Currículo externo (ARENA), no actividad AISMX.
- `src/pages/activities.astro:43` y `src/pages/global-south-challenge.astro:116`
  — GSH produce "evaluaciones y propuestas de gobernanza" como outputs del
  hackatón. Evento puntual, no agenda institucional.
- `src/pages/projects/ai-safety-connect.astro:223` — describe la experiencia
  histórica del equipo internacional SPAR ("experiencia en alineamiento,
  evaluaciones e infraestructura"). Es historial del equipo internacional,
  no compromiso a futuro de AISMX.

---

## B. Pilares / áreas que listan "evaluaciones" como eje propio

Subconjunto de A. Las inconsistencias B.1, B.2, B.3 coinciden con A.1, A.2,
A.3 respectivamente y se resuelven con esas mismas recomendaciones.

---

## C. Stats descalibradas (home)

### C.1 — `src/pages/index.astro:61`

**Texto actual.**
```ts
{ number: '3', label: 'Publicaciones' },
```

**Inconsistencia.** El StatBar promete "3 Publicaciones" pero la colección
`src/content/publications/` solo contiene **una** entrada visible:
`ai-safety-mexico-pilot-survey-yucatan.md` (status: published, no draft).

**Recomendación.** Bajar a "1" o reformular como "1+" / "Publicaciones
activas: 1". Si existen dos publicaciones más en pipeline que aún no se
migraron a la colección, documentarlas en `docs/HUMAN-INPUT-NEEDED.md` y
crear los `.md` correspondientes antes de exponer el número.

Sugerencia mínima invasiva:
```ts
{ number: '1', label: 'Publicación revisada por pares' },
```

(El AI Safety Connect *reporte final* es un working paper / output SPAR,
no un paper con revisión — se documenta en su propia subpágina, no como
"publicación" formal. La página /research también lo trata como
"investigación en curso", no como publicación.)

---

### C.2 — `src/pages/index.astro:62`

**Texto actual.**
```ts
{ number: '10+', label: 'Investigadores' },
```

**Inconsistencia.** /team lista 6 core + 1 advisor + 3 colaboradores MX +
5 colaboradores internacionales SPAR = 15 personas en total, pero llamar
"investigadores" a los 6 docentes / ingenieros / facilitadores del core
team es un estiramiento (varios son explícitamente AI Engineer, Data
Engineer, Software Engineer en sus roles). Y los 5 internacionales son
ex-equipo SPAR de un proyecto concluido, no investigadores activos AISMX.

**Recomendación.** Reformular el label para no sobre-afirmar. Opciones:
- `{ number: '15+', label: 'Colaboradores e investigadores' }` (refleja la
  red total, sin etiquetar a todos como investigadores).
- `{ number: '7', label: 'Personas en el equipo' }` (sólo core + advisor —
  consistente con /team).
- `{ number: '6', label: 'Equipo principal' }` (más restrictivo, también
  consistente).

Mi recomendación: la opción 2 ("7 Personas en el equipo"), que coincide con
lo que un visitante puede verificar en /team.

---

## D. Roles de team members con áreas removidas

**Resultado:** ninguna inconsistencia detectada. Roles vigentes:

- Janeth Valdivia — "Researcher in Technical AI Governance y facilitadora"
- Angel Tenorio — "Software Engineer y Researcher in Mech Interp y
  facilitador"
- Jason Pinelo — "AI Engineer y Docente en Universidad Politécnica de
  Yucatán"
- Isabel Cámara — "Data Engineer y facilitadora de AI Governance"
- Dexter Gómez — "AI Engineer y Docente en Universidad Politécnica de
  Yucatán"
- Karime Pacheco — "Directora de AIS UPY"
- Silvia Fernández — "Advisor · Investigadora · Centro Geo"

Ningún rol menciona "evaluaciones" ni a Peñaloza. ✅

---

## E. Residuos LATAM / Latinoamérica fuera de contexto GSH

**Resultado:** ninguna inconsistencia. Las únicas menciones a "América
Latina" en `src/` están en `src/pages/global-south-challenge.astro` (líneas
105, 210, 217), donde son legítimas por la naturaleza regional del
hackatón. ✅

(El sweep cubrió `Latinoamerica|Latinoamérica|LATAM|América Latina|latin
american` en `.astro|.md|.ts`. No hay residuos.)

---

## F. Sobre-afirmaciones sobre política / diálogo institucional

Estas frases existían **antes** de la remoción del "dialogamos con políticas
públicas" en el hero y quedaron desincronizadas con el nuevo posicionamiento
(más cauto: "construimos las bases técnicas y de gobernanza necesarias para
que México tome decisiones informadas").

### F.1 — `src/pages/about.astro:201-202`

**Texto actual.**
```
Decidimos articularnos para acortar esa distancia desde un país concreto
—México— y desde una práctica concreta: investigación rigurosa, formación
abierta y diálogo con quienes diseñan políticas públicas.
```

**Inconsistencia.** "Diálogo con quienes diseñan políticas públicas" es
parafraseo casi literal de la frase del hero que el equipo decidió remover.
La narrativa de origen sigue prometiendo el mismo nivel de interlocución
directa.

**Recomendación.** Alinear con el nuevo lenguaje. Sugerencia:
> 'Decidimos articularnos para acortar esa distancia desde un país concreto
> —México— y desde una práctica concreta: investigación rigurosa, formación
> abierta y producción de insumos técnicos que apoyen la toma de decisiones
> informadas sobre IA.'

---

### F.2 — `src/pages/about.astro:62` (Pilar Gobernanza)

**Texto actual.**
```
'Acompañamos procesos de consulta y diseño de políticas públicas con
 análisis técnicos, participaciones en mesas de trabajo y producción de
 documentos especializados.'
```

**Inconsistencia.** "Acompañamos procesos de consulta y diseño de políticas
públicas" implica un nivel de involucramiento activo en el ciclo de policy
que va más allá del nuevo posicionamiento "construimos las bases técnicas".
Promete acompañamiento institucional sostenido.

**Recomendación.** Suavizar de "acompañar diseño" a "aportar insumos":
> 'Producimos análisis técnicos, participamos en mesas de trabajo y
> publicamos documentos especializados que aportan insumos a procesos de
> consulta y diseño de políticas públicas sobre IA en México.'

(Cambio de verbo: "acompañar" → "aportar insumos a". Es menos prescriptivo
y consistente con "bases técnicas".)

---

### F.3 — `src/pages/about.astro:113-118`

**Texto actual.**
```
Nuestra labor combina producción científica original, formación abierta y
diálogo institucional. Operamos con un equipo multidisciplinario y en
alianza con organizaciones nacionales e internacionales que comparten el
compromiso de hacer del sur global un actor con voz propia en la
conversación sobre seguridad de la IA.
```

**Inconsistencia.** "Diálogo institucional" repite el patrón removido. Y
"producción científica original" sobre-afirma cuando hay 1 publicación con
peer-review en la colección. *Sur global* sigue siendo legítimo (visión
articulada en la misma página, no LATAM).

**Recomendación.** Reformular "diálogo institucional" → "trabajo con
instituciones aliadas":
> 'Nuestra labor combina investigación abierta, formación situada y trabajo
> con instituciones aliadas. Operamos con un equipo multidisciplinario y en
> alianza con organizaciones nacionales e internacionales que comparten el
> compromiso de hacer del sur global un actor con voz propia en la
> conversación sobre seguridad de la IA.'

(Cambia "producción científica original" → "investigación abierta" para no
sobre-prometer; cambia "diálogo institucional" → "trabajo con instituciones
aliadas".)

---

### F.4 — `src/pages/get-involved.astro:65` (vía '03 Eventos y advisory')

**Texto actual.**
```
'Participamos como ponentes, panelistas y asesores en eventos, mesas de
 trabajo y procesos de consulta sobre políticas públicas y gobernanza de
 IA en México.'
```

**Inconsistencia.** "Procesos de consulta sobre políticas públicas" reitera
el patrón sobre-afirmativo. Si en práctica AISMX participa puntualmente en
mesas y eventos (verificable) pero no en consultas formales de policy
(NO verificable), conviene matizar.

**Recomendación.** Suavizar el alcance:
> 'Participamos como ponentes, panelistas y asesores en eventos, mesas de
> trabajo y conversaciones sobre gobernanza de IA en México.'

(Remueve "procesos de consulta sobre políticas públicas" — claim que
probablemente exceda el track record verificable.)

---

## G. Otros — defaults inconsistentes / residuos menores

### G.1 — `src/components/ContactForm.astro:37`

**Texto actual.**
```ts
endpoint = 'mailto:contacto@aisafetymexico.org',
```

**Inconsistencia.** El email canónico publicado en `/contact`,
`/get-involved` y los CTAs en `/projects` es `contact@aismx.org`. El default
del componente apunta a `contacto@aisafetymexico.org` — un dominio y local-part
distintos. Aunque hoy todos los call-sites pasan endpoint explícito, el
default queda como trampa: cualquier futura inclusión sin override mandaría
mails a una dirección distinta de la oficial.

**Recomendación.** Cambiar el default:
```ts
endpoint = 'mailto:contact@aismx.org',
```

---

### G.2 — `src/pages/about.astro:111`

**Texto actual.**
```
...para asegurar que los sistemas de IA se desarrollen y desplieguen de
forma segura, alineada con valores humanos y atenta a los contextos locales.
```

**Inconsistencia.** Menor — sólo flag editorial. "Atenta a los contextos
locales" (plural) podía leerse como "contextos latinoamericanos" antes de la
remoción LATAM. Ahora con scope estrictamente México, plural genérico está
OK pero podría enfatizarse "contexto mexicano" para alinear con el resto
de la copy del sitio (que dice "contexto mexicano" en programs.astro,
about.astro pilar Educación, etc.).

**Recomendación.** Cambio opcional, no crítico:
> '...para asegurar que los sistemas de IA se desarrollen y desplieguen de
> forma segura, alineada con valores humanos y sensible al contexto mexicano.'

(Si el fixer prefiere no tocar, dejar como está — es la única instancia
borderline.)

---

## Apéndice — Archivos auditados

- `src/pages/index.astro`
- `src/pages/about.astro`
- `src/pages/research.astro`
- `src/pages/programs.astro`
- `src/pages/team.astro`
- `src/pages/projects/index.astro`
- `src/pages/projects/vigia.astro`
- `src/pages/projects/ai-safety-connect.astro`
- `src/pages/activities.astro`
- `src/pages/global-south-challenge.astro`
- `src/pages/get-involved.astro`
- `src/pages/contact.astro`
- `src/components/Header.astro` · `Nav.astro` · `Footer.astro` ·
  `MobileMenu.astro` · `Hero.astro` · `ContactForm.astro`
- `src/layouts/BaseLayout.astro`
- `src/content/config.ts`
- `src/content/publications/ai-safety-mexico-pilot-survey-yucatan.md`
- `src/content/projects/vigia.md`
- `src/content/projects/ai-safety-connect.md`
- `src/lib/types.ts`

**Búsquedas grep ejecutadas:**
`evaluac`, `peñaloza|penaloza`, `Miguel`, `latinoamerica|latinoamérica|LATAM|América Latina|latin american`,
`política pública|politicas publica`, `diálogo|dialogo`, `sur global`,
`interpretab|alineac|red.team|safety atlas|encuesta|survey`,
`10\+|6\+|30\+|3 publicaciones|cursos impartidos|participantes formados`.
