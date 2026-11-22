// AI Safety Mexico — Sprints and hackathons run with Apart Research.
//
// Single source for /sprints, /en/sprints and the "next event" spotlights on
// the home and /activities pages. Each sprint's state comes from its dates
// (see `sprintStatus`), so the pages switch from "registration open" to
// "in progress" to "under review" on their own. The site is static: the
// deploy workflow rebuilds it every day so the switch lands on time.
//
// To add a sprint: append an entry with its full Apart slug, a new
// `utmSource` and its dates. Once Apart
// publishes the projects (about 1–2 weeks after the sprint ends), add the
// ones submitted by teams in Mexico to `projects`; the sprint then shows
// them instead of the "under review" note. Leave `projects` undefined until
// then: an empty array means "published, none from Mexico".

import type { Locale } from './i18n';

type Localized = Record<Locale, string>;

export type SprintStatus = 'upcoming' | 'live' | 'review' | 'results';

export type SprintProject = {
  title: string;
  team: string;
  city: string;
  authors?: string[];
  /** Project page on apartresearch.com, once Apart makes it public. */
  url?: string;
  /** The submitted report (PDF). */
  pdf?: string;
};

export type ApartSprint = {
  id: string;
  name: string;
  kind: Localized;
  /** First and last day, YYYY-MM-DD. Submissions close at the end of `end`, AoE. */
  start: string;
  end: string;
  format: Localized;
  summary: Localized;
  /** One-line hook shown on the featured card of an open sprint. */
  tagline?: Localized;
  prizes?: Localized;
  /**
   * Square poster for the featured card, under public/. `video` is the
   * animated version (a muted MP4 loop, far lighter than a GIF); `src` is its
   * first frame, shown while it loads and to people who prefer reduced motion.
   */
  poster?: { src: string; video?: string; alt: Localized };
  /** What AI Safety Mexico did in this sprint (local site, hubs…). */
  role: Localized;
  /** Full slug of the sprint on apartresearch.com/sprints/. */
  slug: string;
  /** AISMx's own `utm_source` for this sprint; each event gets a new one. */
  utmSource?: string;
  apartUrl: string;
  /** `apartUrl` with the sprint's `utm_source`, so Apart counts our sign-ups. */
  signupUrl: string;
  /**
   * AISMx's own sign-up form per language (a Typeform URL). Its last screen
   * sends people on to `signupUrl`. Languages without one go straight to Apart.
   */
  form?: Partial<Localized>;
  /** Page on this site with more about the sprint, if any. */
  recap?: { href: string; label: Localized };
  projects?: SprintProject[];
};

const APART = 'https://apartresearch.com';

type SprintEntry = Omit<ApartSprint, 'apartUrl' | 'signupUrl'>;

const entries: SprintEntry[] = [
  {
    id: 'agent-attribution',
    name: 'Agent Attribution Hackathon',
    kind: { es: 'Hackatón', en: 'Hackathon' },
    start: '2026-12-11',
    end: '2026-12-13',
    format: { es: 'En línea', en: 'Online' },
    summary: {
      es: 'Tres días para construir clasificadores que identifiquen quién está detrás de la actividad de un agente de IA, simular agentes diseñados para evadirlos o buscar agentes fuera de control. No necesitas experiencia previa.',
      en: "Three days to build classifiers that tell who is behind an AI agent's activity, simulate agents designed to evade them, or search for rogue agents in the wild. No prior experience needed.",
    },
    tagline: {
      es: '¿Agente fuera de control u operador humano? Un fin de semana para distinguirlos.',
      en: 'Rogue agent or human operator? One weekend to tell them apart.',
    },
    prizes: { es: 'US$8,000 en efectivo', en: '$8,000 in cash prizes' },
    poster: {
      src: '/images/sprints/agent-attribution.webp',
      video: '/images/sprints/agent-attribution.mp4',
      alt: {
        es: 'Póster del Agent Attribution Hackathon: el observatorio de Chichén Itzá en semitono, con los logos de AI Safety México y Apart Research.',
        en: 'Agent Attribution Hackathon poster: the Chichén Itzá observatory in halftone, with the AI Safety México and Apart Research logos.',
      },
    },
    role: {
      es: 'Participamos desde México con el AISMx Hackathon Node en el Discord de Apart.',
      en: "We take part from Mexico with the AISMx Hackathon Node on Apart's Discord.",
    },
    slug: 'agent-attribution-2026',
    utmSource: 'aismx412',
    form: {
      es: 'https://form.typeform.com/to/RPJN2huV',
      en: 'https://form.typeform.com/to/RPJN2huV',
    },
  },
  {
    id: 'ai-x-epistemics',
    name: 'AI x Epistemics Research Sprint',
    kind: { es: 'Sprint de investigación', en: 'Research sprint' },
    start: '2026-11-13',
    end: '2026-11-15',
    format: { es: 'En línea y en Mérida', en: 'Online and in Mérida' },
    summary: {
      es: 'Un sprint sobre cómo la IA cambia la forma en que decidimos qué creer: pruebas, señales de verificación y herramientas para razonar mejor.',
      en: 'A sprint on how AI changes the way we decide what to believe: evaluations, verification signals and tools for better reasoning.',
    },
    role: {
      es: 'Fuimos sede presencial en Mérida.',
      en: 'We hosted the in-person site in Mérida.',
    },
    slug: 'ai-x-epistemics-research-sprint-2026-11-13-to-2026-11-15',
    utmSource: 'vmkyvz60',
    projects: [
      { title: 'Would UPY students use a morning meeting point?', team: 'Gabriel', city: 'Mérida' },
      { title: 'Vognis. An approach to combat creative erosion.', team: 'AI Safety UPY', city: 'Mérida' },
      { title: 'Self-Other Asymmetry in LLM Epistemic Auditing', team: 'RAAG', city: 'Mérida' },
      {
        title: 'Which Door You Walk Through: An Audit of Whether Consumer Chatbots Warn About Risks Users Did Not Ask About',
        team: 'UPY - Which Door',
        city: 'Mérida',
      },
      { title: 'Does Asking for More Confidence Raise the Hit Rate?', team: 'Barras de Error', city: 'Mérida' },
      {
        title: 'An International Evidence Reference Layer for AI Agents: A Pilot on FDA Food Recall Records',
        team: 'VarMX',
        city: 'Mérida',
      },
    ],
  },
  {
    id: 'global-south',
    name: 'Global South AI Safety Hackathon',
    kind: { es: 'Hackatón', en: 'Hackathon' },
    start: '2026-06-19',
    end: '2026-06-21',
    format: { es: 'En línea y en Mérida y Guadalajara', en: 'Online and in Mérida and Guadalajara' },
    summary: {
      es: 'Seguridad de la IA desde el Sur Global: evaluaciones en español y lenguas locales, gobernanza y riesgos para la región.',
      en: 'AI safety from the Global South: evaluations in Spanish and local languages, governance and risks for the region.',
    },
    role: {
      es: 'Organizamos las sedes de Mérida y Guadalajara.',
      en: 'We ran the Mérida and Guadalajara hubs.',
    },
    slug: 'global-south-ais-hackathon-2026-06-19-to-2026-06-21',
    recap: {
      href: '/global-south-challenge',
      label: { es: 'Página del hackatón', en: 'Hackathon page' },
    },
    projects: [
      {
        title: 'Protección de la soberanía: un marco empírico de vulnerabilidad y un escudo regulatorio para la IA en una potencia media',
        team: 'TAISO',
        city: 'Mérida',
        authors: ['Max Pinelo', 'Pilar Moncada'],
        url: `${APART}/sprints/projects/proteccin-de-la-soberana-un-marco-emprico-de-vulnerabilidad-y-un-escudo-regulatorio-para-la-ia-en-una-potencia-media-mpmm`,
        pdf: 'https://pys8vc40ox3z7qxp.public.blob.vercel-storage.com/files/5233ce4ad8f40e1d-2697a70e-3540-4302-96ce-0f81635fe341-paper_short.pdf',
      },
      {
        title: 'Performative Subversion: A False Sense of Safety despite a Control Protocol',
        team: 'lobos',
        city: 'Mérida',
        authors: ['Max Pinelo', 'Angel Tenorio'],
        url: `${APART}/sprints/projects/performative-subversion-a-false-sense-of-safety-despite-a-control-protocol-m2s1`,
        pdf: 'https://pys8vc40ox3z7qxp.public.blob.vercel-storage.com/files/9189b11a1797fb07-4fbe45fd-b4dd-44f6-b749-c912d9201d46-performative_subversion_linuxarena.pdf',
      },
      {
        title: 'Agentic Surveillance Mx',
        team: 'AI Safety UPY',
        city: 'Mérida',
        authors: ['Karime Pacheco', 'Santiago Gamboa', 'María José León', 'Jorge Castillo'],
        url: `${APART}/sprints/projects/agentic-surveillance-mx-zarr`,
        pdf: 'https://pys8vc40ox3z7qxp.public.blob.vercel-storage.com/files/475275d8684eb1c7-8a0d9a65-5424-4fc5-85b7-e0764a113d86-agentic-surveillance-mx.pdf',
      },
      {
        title: 'Slang Bypass: Benchmarking Alignment Failures in Mexican Regional Spanish',
        team: 'Balam',
        city: 'Mérida',
        authors: ['Suny'],
        url: `${APART}/sprints/projects/slang-bypass-benchmarking-alignment-failures-in-mexican-regional-spanish-4m8z`,
        pdf: 'https://pys8vc40ox3z7qxp.public.blob.vercel-storage.com/files/b8cea3339d5d3192-_Safety_Hackathon_2026_Team_Balam_Regional_Mexican_Slang_Jailbreak_Benchmark.pdf',
      },
      {
        title: 'TUP Detection: Hybrid Prompt-Injection Guard for AI Generative Security Monitoring',
        team: 'TUP Labs',
        city: 'Mérida',
        authors: ['Jorge Enrique Vargas Pech', 'Jose Luis Rejón Quintal', 'William Emmanuel Fernández Castillo', 'Saúl Ruiz Peña'],
        url: `${APART}/sprints/projects/tup-detection-hybrid-promptinjection-guard-for-ai-generative-security-monitoring-r4w6`,
        pdf: 'https://pys8vc40ox3z7qxp.public.blob.vercel-storage.com/files/848583c60178a525-1968bca3-fc0d-4478-b521-0f8890ce96fe-TUP_Detection_Manuscript.pdf',
      },
      {
        title: 'DialectSafe: Bridging the ASR Gap',
        team: 'ZINT',
        city: 'Mérida',
        authors: ['David Romero', 'Euruviel Marquez', 'Leonardo Torres', 'Roberto Balmes'],
        url: `${APART}/sprints/projects/dialectsafe-bridging-the-asr-gap-2uny`,
        pdf: 'https://pys8vc40ox3z7qxp.public.blob.vercel-storage.com/files/56ec02d488f35144-4adf7702-f6e4-4667-aff0-e5e084a2add8-DialectSafe_Equipo_ZINT_2.pdf',
      },
      {
        title: 'RAGE',
        team: 'RAGE Team',
        city: 'Mérida',
        authors: ['Luis Escalante'],
        url: `${APART}/sprints/projects/rage-dz31`,
        pdf: 'https://pys8vc40ox3z7qxp.public.blob.vercel-storage.com/files/db94dd0c2027037b-f1d9d82f-dd1c-4598-be62-cb05dedf7074-GlobalSouth-RAGE-Submission-2.pdf',
      },
      {
        title: 'HAZE: Adversarial Multi-Agent Scrutiny for Vulnerability Detection',
        team: 'Archlinux',
        city: 'Mérida',
        authors: ['Alex Daniel Novelo Fuentes'],
        url: `${APART}/sprints/projects/haze-adversarial-multiagent-scrutiny-for-vulnerability-detection-l278`,
        pdf: 'https://pys8vc40ox3z7qxp.public.blob.vercel-storage.com/files/11e580cbbbb7dfa9-b9f12d5b-1323-4356-99b4-9e9ef70200ee-HAZE_Apart-hackaton_Report.pdf',
      },
      {
        title: 'The State Is Not Enough',
        team: 'Krishna Team',
        city: 'Yucatán',
        authors: ['Krishna Sandoval Cambranis'],
        url: `${APART}/sprints/projects/the-state-is-not-enough-26ax`,
        pdf: 'https://pys8vc40ox3z7qxp.public.blob.vercel-storage.com/files/d67adfa8b3c64bd3-930dcc94-58ab-4ab2-beec-83896e1deacf-The_State_Is_Not_Enough.pdf',
      },
      {
        title: 'YucaSafeBench',
        team: 'YucaSafeBench',
        city: 'Mérida',
        authors: ['Joseph Jesus Aguilar Rodriguez', 'Angel Abraham Lugo Saenz'],
        url: `${APART}/sprints/projects/yucasafebench-wpiv`,
        pdf: 'https://pys8vc40ox3z7qxp.public.blob.vercel-storage.com/files/1e00b77f1844743c-ddd7473b-0fc1-4d37-8191-fe12a5b9e9bd-YucaSafeBench_LatAm_AI_Safety_Report.pdf',
      },
      {
        title: 'Evaluating LLM Safety Across Intra-Language Variations: A Study of Regional Spanish Slang',
        team: 'Inteligencia Artesanal',
        city: 'Guadalajara',
        authors: ['Fernando Gonzalez Ruiz', 'Alvaro Nuñez Perez', 'Itzel Aurora Hernandez Fernández', 'Ángel Alejandro Reynoso Delgado'],
        url: `${APART}/sprints/projects/evaluating-llm-safety-across-intralanguage-variations-a-study-of-regional-spanish-slang-yk12`,
        pdf: 'https://pys8vc40ox3z7qxp.public.blob.vercel-storage.com/files/38b4e6bc47b89b86-M-Safety-Across-Intra-Language-Variations_-A-Study-of-Regional-Spanish-Slang.pdf',
      },
      {
        title: 'Three Detectors, Three Failure Profiles: Detector-Specific Demographic Bias in Public Deepfake Detection and Its Implications for Content Moderation in Latin America',
        team: 'OlimpIA',
        city: 'Guadalajara',
        authors: ['Jose Ernesto Ramirez Garcia', 'Angel Pineda Aguirre', 'Daniel Alberto Curiel Vargas'],
        url: `${APART}/sprints/projects/three-detectors-three-failure-profiles-detectorspecific-demographic-bias-in-public-deepfake-detection-and-its-implications-for-content-moderation-in-latin-america-vmnh`,
        pdf: 'https://pys8vc40ox3z7qxp.public.blob.vercel-storage.com/files/bf93a6a1f807f45f-2e1b2a5a-ea93-4748-9b05-ae7dd89deb93-Paper-Three-Detectors.pdf',
      },
      {
        title: 'The AI Deployment Audit Playbook: An Operational, Lifecycle-Oriented Framework for the Global South',
        team: 'CutDEVS',
        city: 'Guadalajara',
        authors: ['Itan Gabriel Ramirez Miramontes', 'Cesar Geovany Cardenas'],
        url: `${APART}/sprints/projects/the-ai-deployment-audit-playbook-an-operational-lifecycleoriented-framework-for-the-global-south-i0iw`,
        pdf: 'https://pys8vc40ox3z7qxp.public.blob.vercel-storage.com/files/18b78a740e7de7bf-7201f30b-b84b-4f58-b5c2-71ff65eec8d5-AI-Deployment-Audit-Playbook-4.pdf',
      },
      {
        title: 'Filtrum-Safety: LLM-Agnostic RAG for Reducing Legal Hallucinations in Civil-Law Contexts',
        team: 'Null-Byte',
        city: 'Guadalajara',
        authors: ['Uriel Ismael Guadalupe Ramirez Andrade', 'Diego David Peña Martínez', 'Tadeo Cadena Alfaro'],
        url: `${APART}/sprints/projects/filtrumsafety-llmagnostic-rag-for-reducing-legal-hallucinations-in-civillaw-contexts-l8d6`,
        pdf: 'https://pys8vc40ox3z7qxp.public.blob.vercel-storage.com/files/1945eb4eaf30a5c7-d89e003c-37f5-4da6-8da2-73d0838ae79a-Filtrum-Safety_paper_EN.pdf',
      },
      {
        title: 'Metodología',
        team: 'Alpo',
        city: 'Guadalajara',
        authors: ['Rocio Nefertari Garcia Luevano', 'Luis Angel Soto Contreras', 'Lorena Jacqueline Garcia Luevano', 'Alexis Lopez Fregoso', 'Ezbai Ahananel Guzman Rojas'],
        url: `${APART}/sprints/projects/metodologa-37n9`,
        pdf: 'https://pys8vc40ox3z7qxp.public.blob.vercel-storage.com/files/4f69a5030a5bb2da-tuaciones-de-riesgo-para-ni-as--ni-os-y-adolescentes-en-chats-de-videojuegos.pdf',
      },
      {
        title: 'Cultural Knowledge Gaps in LLMs: Geographic Hallucination Bias Across Latin American Countries',
        team: 'Fairness LATAM',
        city: 'México',
        authors: ['Karla Angelica Doctor Mauricio'],
        url: `${APART}/sprints/projects/cultural-knowledge-gaps-in-llms-geographic-hallucination-bias-across-latin-american-countries-5px9`,
        pdf: 'https://pys8vc40ox3z7qxp.public.blob.vercel-storage.com/files/27383239e5adaedc-dc246b1c-1e9a-4130-acb5-7c81bc244dc2-Apart_Fainress_LATAM.pdf',
      },
    ],
  },
];

export const sprints: ApartSprint[] = entries.map((entry) => {
  const apartUrl = `${APART}/sprints/${entry.slug}`;
  const signupUrl = entry.utmSource ? `${apartUrl}?utm_source=${entry.utmSource}` : apartUrl;
  return { ...entry, apartUrl, signupUrl };
});

/**
 * "Now" for the build. `SPRINTS_NOW=2026-12-12 npm run build` previews the
 * pages as they will look on another day.
 */
export function buildDate(): Date {
  const override = process.env.SPRINTS_NOW;
  return override ? new Date(`${override}T12:00:00-06:00`) : new Date();
}

export function sprintStatus(sprint: ApartSprint, now: Date = buildDate()): SprintStatus {
  const opens = new Date(`${sprint.start}T00:00:00-12:00`);
  const closes = new Date(`${sprint.end}T23:59:59-12:00`);
  if (now < opens) return 'upcoming';
  if (now <= closes) return 'live';
  return sprint.projects ? 'results' : 'review';
}

/** Sprints still open to sign-ups (upcoming or in progress), soonest first. */
export function openSprints(now: Date = buildDate()): ApartSprint[] {
  return sprints
    .filter((s) => ['upcoming', 'live'].includes(sprintStatus(s, now)))
    .sort((a, b) => a.start.localeCompare(b.start));
}

/** Sprints that already ended, newest first. */
export function pastSprints(now: Date = buildDate()): ApartSprint[] {
  return sprints
    .filter((s) => ['review', 'results'].includes(sprintStatus(s, now)))
    .sort((a, b) => b.start.localeCompare(a.start));
}

const MONTHS: Record<Locale, string[]> = {
  es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

/**
 * «11–13 de diciembre de 2026» / «December 11–13, 2026». The en dash takes
 * a word joiner (U+2060) so the range never breaks as «11– / 13».
 */
export function sprintDates(sprint: ApartSprint, lang: Locale): string {
  const [y, m1, d1] = sprint.start.split('-').map(Number);
  const [, m2, d2] = sprint.end.split('-').map(Number);
  const months = MONTHS[lang];
  if (lang === 'es') {
    return m1 === m2
      ? `${d1}–\u2060${d2} de ${months[m2 - 1]} de ${y}`
      : `${d1} de ${months[m1 - 1]} al ${d2} de ${months[m2 - 1]} de ${y}`;
  }
  return m1 === m2
    ? `${months[m1 - 1]} ${d1}–\u2060${d2}, ${y}`
    : `${months[m1 - 1]} ${d1} – ${months[m2 - 1]} ${d2}, ${y}`;
}

/** YYYY-MM-DD of `now` on Mexico City's calendar. */
function mexicoDay(now: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Mexico_City' }).format(now);
}

/**
 * «Empieza en 19 días» while upcoming, «Termina el 13 de diciembre» while
 * live. Counted at build time, so it relies on the daily rebuild.
 */
export function sprintCountdown(sprint: ApartSprint, lang: Locale, now: Date = buildDate()): string {
  const status = sprintStatus(sprint, now);
  if (status === 'live') {
    const [, m, d] = sprint.end.split('-').map(Number);
    const month = MONTHS[lang][m - 1];
    return lang === 'es' ? `Termina el ${d} de ${month}` : `Ends ${month} ${d}`;
  }
  const days = Math.round(
    (Date.parse(sprint.start) - Date.parse(mexicoDay(now))) / 86_400_000,
  );
  if (days <= 0) return lang === 'es' ? 'Empieza hoy' : 'Starts today';
  if (days === 1) return lang === 'es' ? 'Empieza mañana' : 'Starts tomorrow';
  return lang === 'es' ? `Empieza en ${days} días` : `Starts in ${days} days`;
}

export const statusLabel: Record<SprintStatus, Localized> = {
  upcoming: { es: 'Registro abierto', en: 'Registration open' },
  live: { es: 'En curso', en: 'In progress' },
  review: { es: 'En evaluación', en: 'Under review' },
  results: { es: 'Resultados', en: 'Results' },
};
