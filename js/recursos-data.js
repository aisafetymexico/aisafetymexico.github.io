/* ================================================================
   AI Safety Mexico — Base de datos abierta de recursos
   ----------------------------------------------------------------
   Todos los enlaces fueron verificados el 29 de septiembre de 2026.
   Campos: titulo, tipo, area, formato, duracion, resumen, etiquetas,
           enlace, idioma ('es' | 'en'), latam (boolean).
   Para proponer un recurso, abre un issue o pull request en GitHub.
   ================================================================ */

window.RECURSOS_AISMX = {
    actualizado: '2026-09-29',
    recursos: [

        /* ── Directorios y recursos meta ─────────────────────────── */
        {
            titulo: 'AISafety.com',
            tipo: 'Directorio',
            area: 'General',
            formato: 'En línea',
            duracion: 'Referencia permanente',
            resumen: 'Un solo punto de entrada al ecosistema: mapa del campo, cursos, eventos, convocatorias, comunidades, financiamiento, empleos, asesoría y medios.',
            etiquetas: ['hub', 'referencia', 'datos abiertos'],
            enlace: 'https://aisafety.com',
            idioma: 'en'
        },
        {
            titulo: 'AISafety.info',
            tipo: 'Directorio',
            area: 'General',
            formato: 'En línea',
            duracion: 'Autogestionado',
            resumen: 'Respuestas en lenguaje sencillo a cientos de preguntas frecuentes sobre riesgos de la IA. Buen punto de partida para divulgación.',
            etiquetas: ['preguntas frecuentes', 'divulgación', 'introducción'],
            enlace: 'https://aisafety.info',
            idioma: 'en'
        },
        {
            titulo: 'AI Alignment Forum',
            tipo: 'Comunidad',
            area: 'Técnica',
            formato: 'En línea',
            duracion: 'Permanente',
            resumen: 'Foro donde los investigadores discuten alineación, desde modelos técnicos de agencia hasta el panorama estratégico del campo.',
            etiquetas: ['foro', 'investigación', 'debate'],
            enlace: 'https://www.alignmentforum.org',
            idioma: 'en'
        },
        {
            titulo: 'LessWrong',
            tipo: 'Comunidad',
            area: 'General',
            formato: 'En línea',
            duracion: 'Permanente',
            resumen: 'Comunidad de escritura y discusión donde se publica buena parte del pensamiento sobre riesgos de la IA y racionalidad aplicada.',
            etiquetas: ['foro', 'blog', 'racionalidad'],
            enlace: 'https://www.lesswrong.com',
            idioma: 'en'
        },
        {
            titulo: 'EA Forum',
            tipo: 'Comunidad',
            area: 'General',
            formato: 'En línea',
            duracion: 'Permanente',
            resumen: 'Foro donde se anuncian convocatorias, se publican análisis de impacto y se debaten prioridades del campo de la seguridad en IA.',
            etiquetas: ['foro', 'convocatorias', 'análisis'],
            enlace: 'https://forum.effectivealtruism.org',
            idioma: 'en'
        },
        {
            titulo: 'Alignment Ecosystem Development',
            tipo: 'Comunidad',
            area: 'Construcción de campo',
            formato: 'Remoto',
            duracion: 'Continuo',
            resumen: 'Proyectos abiertos de infraestructura para el ecosistema de alineación, con espacio para personas voluntarias.',
            etiquetas: ['voluntariado', 'infraestructura', 'proyectos abiertos'],
            enlace: 'https://alignment.dev',
            idioma: 'en'
        },
        {
            titulo: 'AI Safety Support',
            tipo: 'Comunidad',
            area: 'Construcción de campo',
            formato: 'Remoto',
            duracion: 'Continuo',
            resumen: 'Apoyo a personas que quieren entrar al campo: sesiones de orientación, conexiones y recursos para quienes empiezan.',
            etiquetas: ['apoyo', 'ingreso al campo', 'mentoría'],
            enlace: 'https://www.aisafetysupport.org',
            idioma: 'en'
        },

        /* ── Recursos en español y de América Latina ─────────────── */
        {
            titulo: 'AI Safety México',
            tipo: 'Organización',
            area: 'Construcción de campo',
            formato: 'Híbrido (México)',
            duracion: 'Continuo',
            resumen: 'Investigación, educación y política sobre seguridad en IA en México. Cursos gratuitos, mesas de trabajo y proyectos como VIGÍA.',
            etiquetas: ['México', 'cursos', 'investigación'],
            enlace: 'https://aismx.org',
            idioma: 'es',
            latam: true
        },
        {
            titulo: 'Carreras con Impacto',
            tipo: 'Carrera y empleo',
            area: 'General',
            formato: 'En línea',
            duracion: 'Autogestionado',
            resumen: 'Guía de carrera en español para trabajar en problemas globales apremiantes, incluida la seguridad en inteligencia artificial.',
            etiquetas: ['carrera', 'español', 'orientación'],
            enlace: 'https://carrerasconimpacto.org',
            idioma: 'es',
            latam: true
        },
        {
            titulo: 'Observatorio de Riesgos Catastróficos Globales (ORCG)',
            tipo: 'Organización',
            area: 'Gobernanza',
            formato: 'Híbrido (Iberoamérica)',
            duracion: 'Continuo',
            resumen: 'Organización hispanohablante que investiga y asesora sobre riesgos catastróficos globales, incluidos los derivados de la IA avanzada.',
            etiquetas: ['español', 'política pública', 'riesgo global'],
            enlace: 'https://www.orcg.info',
            idioma: 'es',
            latam: true
        },
        {
            titulo: 'LANAIS (Latin American Network for AI Safety)',
            tipo: 'Comunidad',
            area: 'Construcción de campo',
            formato: 'Remoto (regional)',
            duracion: 'Continuo',
            resumen: 'Red que conecta a quienes trabajan en seguridad en IA en América Latina, con mapa regional, guías de carrera y eventos propios.',
            etiquetas: ['América Latina', 'red regional', 'orientación'],
            enlace: 'https://lanais.org',
            idioma: 'es',
            latam: true
        },
        {
            titulo: 'BAISH (Buenos Aires AI Safety Hub)',
            tipo: 'Comunidad',
            area: 'Técnica',
            formato: 'Presencial (Buenos Aires) e híbrido',
            duracion: 'Continuo',
            resumen: 'La comunidad técnica más consolidada de la región: cursos con BlueDot, talleres de reimplementación de papers y la beca AISAR.',
            etiquetas: ['Argentina', 'investigación', 'beca'],
            enlace: 'https://baish.com.ar/es',
            idioma: 'es',
            latam: true
        },
        {
            titulo: 'AI Safety Brazil',
            tipo: 'Organización',
            area: 'Construcción de campo',
            formato: 'Híbrido (Brasil)',
            duracion: 'Continuo',
            resumen: 'Organización sin fines de lucro que cubre desde sesgo e interpretabilidad hasta alineación y riesgo catastrófico en el contexto brasileño.',
            etiquetas: ['Brasil', 'comunidad', 'educación'],
            enlace: 'https://aisafetybrazil.org',
            idioma: 'en',
            latam: true
        },
        {
            titulo: 'FAIR IALAB (Universidad de Buenos Aires)',
            tipo: 'Organización',
            area: 'Interdisciplinaria',
            formato: 'Presencial (Buenos Aires)',
            duracion: 'Continuo',
            resumen: 'Grupo de investigación en una universidad pública latinoamericana que aborda la seguridad de IA de frontera como problema sociotécnico.',
            etiquetas: ['Argentina', 'universidad pública', 'investigación'],
            enlace: 'https://fair-uba.com',
            idioma: 'en',
            latam: true
        },
        {
            titulo: 'CEGIA',
            tipo: 'Organización',
            area: 'Gobernanza',
            formato: 'Híbrido (Brasil)',
            duracion: 'Continuo',
            resumen: 'Centro brasileño que ha llevado las discusiones de seguridad en IA a los debates de gobernanza y política pública de la región.',
            etiquetas: ['Brasil', 'política pública', 'gobernanza'],
            enlace: 'https://www.cegia.org',
            idioma: 'en',
            latam: true
        },
        {
            titulo: 'América Latina y su lugar en AI safety: un mapa',
            tipo: 'Agenda de investigación',
            area: 'Construcción de campo',
            formato: 'Lectura',
            duracion: 'Lectura de 15 minutos',
            resumen: 'Mapeo de quién hace qué en seguridad en IA en América Latina: talento, trabajo técnico, regulación, financiamiento y vacíos por llenar.',
            etiquetas: ['América Latina', 'panorama', 'estrategia'],
            enlace: 'https://forum.effectivealtruism.org/posts/3sL6iB6WzKHJciwta/latin-america-in-search-of-its-stake-in-ai-safety-a-map',
            idioma: 'en',
            latam: true
        },
        {
            titulo: 'LatamGPT (CENIA)',
            tipo: 'Organización',
            area: 'Interdisciplinaria',
            formato: 'Presencial (Chile) y abierto',
            duracion: 'Continuo',
            resumen: 'Modelo abierto entrenado con textos regionales en español, portugués y lenguas indígenas. Proyecto de soberanía con evaluación de seguridad pendiente.',
            etiquetas: ['Chile', 'soberanía', 'modelo abierto'],
            enlace: 'https://latamgpt.org',
            idioma: 'es',
            latam: true
        },
        {
            titulo: 'European Network for AI Safety (ENAIS)',
            tipo: 'Comunidad',
            area: 'Construcción de campo',
            formato: 'Híbrido',
            duracion: 'Continuo',
            resumen: 'Red que conecta investigadores y constructores de campo; colabora con AI Safety México en cursos de gobernanza y en VIGÍA.',
            etiquetas: ['red', 'gobernanza', 'colaboración'],
            enlace: 'https://www.enais.co',
            idioma: 'en'
        },
        {
            titulo: 'Apart Research',
            tipo: 'Programa de investigación',
            area: 'Técnica',
            formato: 'Remoto / híbrido',
            duracion: 'Varía por convocatoria',
            resumen: 'Hackathones de investigación y el programa Apart Lab, con presencia activa en el Sur Global. Coorganiza el Global South AIS Challenge.',
            etiquetas: ['hackathones', 'Sur Global', 'investigación'],
            enlace: 'https://apartresearch.com',
            idioma: 'en',
            latam: true
        },

        /* ── Cursos y currículos ─────────────────────────────────── */
        {
            titulo: 'BlueDot Impact',
            tipo: 'Curso',
            area: 'General',
            formato: 'En línea con cohortes',
            duracion: 'De 2 horas a 5 semanas',
            resumen: 'El curso introductorio estándar del campo, con rutas de seguridad técnica, gobernanza de IA de frontera y estrategia de AGI.',
            etiquetas: ['introducción', 'cohorte', 'gratuito'],
            enlace: 'https://bluedot.org/courses',
            idioma: 'en'
        },
        {
            titulo: 'AI Safety Atlas',
            tipo: 'Curso',
            area: 'General',
            formato: 'En línea',
            duracion: 'Autogestionado',
            resumen: 'Libro de texto del CeSIA que organiza el conocimiento de AI safety en una narrativa progresiva. Base de varios cursos de AI Safety México.',
            etiquetas: ['libro de texto', 'autoestudio', 'estructurado'],
            enlace: 'https://ai-safety-atlas.com',
            idioma: 'en'
        },
        {
            titulo: 'ARENA (Alignment Research Engineer Accelerator)',
            tipo: 'Curso',
            area: 'Técnica',
            formato: 'Presencial (Londres) y currículo abierto',
            duracion: '4-5 semanas',
            resumen: 'Bootcamp intensivo para pasar de programador competente a ingeniero de alineación. Su currículo está disponible de forma abierta.',
            etiquetas: ['bootcamp', 'transformers', 'currículo abierto'],
            enlace: 'https://www.arena.education',
            idioma: 'en'
        },
        {
            titulo: 'Introduction to ML Safety (CAIS)',
            tipo: 'Curso',
            area: 'Técnica',
            formato: 'En línea',
            duracion: '8 semanas',
            resumen: 'Curso de nivel posgrado del Center for AI Safety sobre robustez, monitoreo, control y seguridad sistémica en aprendizaje automático.',
            etiquetas: ['robustez', 'monitoreo', 'posgrado'],
            enlace: 'https://course.mlsafety.org',
            idioma: 'en'
        },
        {
            titulo: 'AI Safety, Ethics and Society (AISES)',
            tipo: 'Curso',
            area: 'General',
            formato: 'En línea',
            duracion: 'Autogestionado',
            resumen: 'Libro y curso del CAIS que cubre pérdida de control, desalineación y uso malicioso con marcos de otras disciplinas de riesgo.',
            etiquetas: ['ética', 'sociedad', 'libro'],
            enlace: 'https://www.aisafetybook.com',
            idioma: 'en'
        },
        {
            titulo: 'ML4Good',
            tipo: 'Curso',
            area: 'Técnica',
            formato: 'Presencial (varias sedes)',
            duracion: '10 días',
            resumen: 'Bootcamp intensivo con proyecto final y sesiones técnicas y de gobernanza. Integrantes de AI Safety México han sido participantes.',
            etiquetas: ['bootcamp', 'proyecto final', 'presencial'],
            enlace: 'https://ml4good.org',
            idioma: 'en'
        },
        {
            titulo: 'AI Risk Fundamentals (Lens Academy)',
            tipo: 'Curso',
            area: 'General',
            formato: 'En línea',
            duracion: 'Autogestionado',
            resumen: 'Curso basado en el libro "If Anyone Builds It, Everyone Dies" sobre por qué la superinteligencia podría ser catastrófica y qué hacer.',
            etiquetas: ['introducción', 'riesgo existencial', 'nuevo'],
            enlace: 'https://lensacademy.org/courses/ai-risk-fundamentals/curriculum',
            idioma: 'en'
        },
        {
            titulo: 'Introduction to AI Safety (Stanford CS120)',
            tipo: 'Curso',
            area: 'Técnica',
            formato: 'En línea (material abierto)',
            duracion: 'Un semestre',
            resumen: 'Curso universitario de Stanford sobre los retos técnicos de construir sistemas de IA confiables, éticos y alineados.',
            etiquetas: ['universitario', 'Stanford', 'material abierto'],
            enlace: 'https://web.stanford.edu/class/cs120',
            idioma: 'en'
        },
        {
            titulo: 'Language Models and Intelligent Agentic Systems',
            tipo: 'Curso',
            area: 'Técnica',
            formato: 'En línea',
            duracion: '16 clases',
            resumen: 'Serie de lecciones de Meridian sobre cómo se construyen los sistemas de modelos de lenguaje, para entender y anticipar su comportamiento.',
            etiquetas: ['LLM', 'agentes', 'clases grabadas'],
            enlace: 'https://www.meridiancambridge.org/language-models-course',
            idioma: 'en'
        },
        {
            titulo: 'UChicago XLab AI Security Guide',
            tipo: 'Curso',
            area: 'Técnica',
            formato: 'En línea',
            duracion: 'Autogestionado',
            resumen: 'Guía en cinco secciones sobre ejemplos adversarios, jailbreaking, manipulación de modelos, envenenamiento de datos y extracción de información.',
            etiquetas: ['seguridad', 'adversarial', 'jailbreaks'],
            enlace: 'https://xlabaisecurity.com',
            idioma: 'en'
        },
        {
            titulo: 'Introduction to Cooperative AI',
            tipo: 'Curso',
            area: 'Interdisciplinaria',
            formato: 'En línea',
            duracion: 'Autogestionado',
            resumen: 'Introducción al campo de la IA cooperativa, centrado en mejorar la inteligencia cooperativa de sistemas avanzados.',
            etiquetas: ['cooperación', 'teoría de juegos', 'multiagente'],
            enlace: 'https://www.cooperativeai.com/curriculum/1-what-is-cooperative-ai',
            idioma: 'en'
        },
        {
            titulo: 'Agent Foundations for Superintelligence-Robust Alignment',
            tipo: 'Curso',
            area: 'Técnica',
            formato: 'En línea',
            duracion: 'Autogestionado',
            resumen: 'Guía a la corriente que busca alineación con garantías teóricas capaces de escalar hasta la superinteligencia.',
            etiquetas: ['fundamentos de agencia', 'teoría', 'avanzado'],
            enlace: 'https://agentfoundations.study',
            idioma: 'en'
        },
        {
            titulo: 'Reading What We Can',
            tipo: 'Curso',
            area: 'General',
            formato: 'En línea',
            duracion: 'Reto de 20 días',
            resumen: 'Colección de libros y artículos organizados como reto de lectura: bases de AI safety, ingeniería de ML y ciencia ficción relevante.',
            etiquetas: ['lecturas', 'reto', 'autoestudio'],
            enlace: 'https://readingwhatwecan.com',
            idioma: 'en'
        },

        /* ── Programas de investigación técnica ──────────────────── */
        {
            titulo: 'MATS (ML Alignment & Theory Scholars)',
            tipo: 'Programa de investigación',
            area: 'Técnica',
            formato: 'Berkeley y remoto',
            duracion: '10 semanas',
            resumen: 'El programa de mentoría más grande del campo: investigación guiada en alineación e interpretabilidad, con beca económica.',
            etiquetas: ['mentoría', 'interpretabilidad', 'beca'],
            enlace: 'https://www.matsprogram.org',
            idioma: 'en'
        },
        {
            titulo: 'SPAR (Supervised Program for Alignment Research)',
            tipo: 'Programa de investigación',
            area: 'Mixta',
            formato: 'Remoto',
            duracion: '3 meses (medio tiempo)',
            resumen: 'Programa remoto de medio tiempo que empareja talento emergente con especialistas. Integrantes de AI Safety México han participado.',
            etiquetas: ['remoto', 'medio tiempo', 'mentoría'],
            enlace: 'https://sparai.org',
            idioma: 'en',
            latam: true
        },
        {
            titulo: 'LASR Labs',
            tipo: 'Programa de investigación',
            area: 'Técnica',
            formato: 'Presencial (Londres)',
            duracion: '13 semanas',
            resumen: 'Equipos de tres o cuatro personas trabajando a tiempo completo para publicar investigación en seguridad, con beca y apoyo integral.',
            etiquetas: ['publicación', 'equipo', 'Londres'],
            enlace: 'https://www.lasrlabs.org',
            idioma: 'en'
        },
        {
            titulo: 'Pivotal Research Fellowship',
            tipo: 'Programa de investigación',
            area: 'Mixta',
            formato: 'Presencial (Londres, sede LISA)',
            duracion: '9 semanas + extensiones',
            resumen: 'Investigación a tiempo completo en seguridad, gobernanza o bioseguridad con mentoría, beca, viaje y hospedaje cubiertos.',
            etiquetas: ['beca completa', 'bioseguridad', 'LISA'],
            enlace: 'https://www.pivotal-research.org/fellowship',
            idioma: 'en'
        },
        {
            titulo: 'MARS (Cambridge AI Safety Hub)',
            tipo: 'Programa de investigación',
            area: 'Técnica',
            formato: 'Remoto',
            duracion: '2-3 meses',
            resumen: 'Mentoría estructurada para estudiantes en proyectos de alineación. Antes en alignmentmentorship.com, ahora alojado en caish.org.',
            etiquetas: ['estudiantes', 'mentoría', 'remoto'],
            enlace: 'https://caish.org/mars',
            idioma: 'en'
        },
        {
            titulo: 'AI Safety Camp',
            tipo: 'Programa de investigación',
            area: 'Técnica',
            formato: 'Remoto y presencial',
            duracion: 'Por proyecto',
            resumen: 'Colabora con líderes de proyecto para producir investigación publicable en alineación. Formato accesible para primeras contribuciones.',
            etiquetas: ['proyectos', 'accesible', 'colaboración'],
            enlace: 'https://www.aisafety.camp',
            idioma: 'en'
        },
        {
            titulo: 'Algoverse AI Safety Fellowship',
            tipo: 'Programa de investigación',
            area: 'Técnica',
            formato: 'Remoto',
            duracion: '12 semanas',
            resumen: 'Equipos pequeños con mentores de Apollo, FAR AI y MATS, orientados a publicar en conferencias de aprendizaje automático.',
            etiquetas: ['publicación', 'equipo', 'remoto'],
            enlace: 'https://algoverseairesearch.org/ai-safety-fellowship',
            idioma: 'en'
        },
        {
            titulo: 'PrincInt Fellowship (antes PIBBSS)',
            tipo: 'Programa de investigación',
            area: 'Interdisciplinaria',
            formato: 'Presencial (Ciudad del Cabo)',
            duracion: '3 meses',
            resumen: 'Investigación que aplica neurociencia, biología evolutiva, sistemas dinámicos y filosofía a la seguridad en IA. PIBBSS ahora es Principles of Intelligence.',
            etiquetas: ['interdisciplinaria', 'doctorado', 'Sur Global'],
            enlace: 'https://princint.ai/programs/fellowship',
            idioma: 'en'
        },
        {
            titulo: 'Constellation',
            tipo: 'Programa de investigación',
            area: 'Técnica',
            formato: 'Presencial (Berkeley)',
            duracion: 'Varía por programa',
            resumen: 'Centro de investigación en Berkeley con programas de residencia e investigadores visitantes; opera el espacio de los Anthropic Fellows.',
            etiquetas: ['Berkeley', 'residencia', 'centro'],
            enlace: 'https://constellation.org',
            idioma: 'en'
        },
        {
            titulo: 'Anthropic Fellows Program',
            tipo: 'Programa de investigación',
            area: 'Técnica',
            formato: 'Remoto (EE. UU., Reino Unido, Canadá)',
            duracion: '4 meses',
            resumen: 'Financiamiento y mentoría de Anthropic para un proyecto empírico con resultado público. Convocatoria continua por cohortes.',
            etiquetas: ['Anthropic', 'empírico', 'cohortes'],
            enlace: 'https://www.anthropic.com/careers',
            idioma: 'en'
        },
        {
            titulo: 'SteadRise (antes Impact Academy)',
            tipo: 'Programa de investigación',
            area: 'Mixta',
            formato: 'Remoto / híbrido',
            duracion: '3-6 meses',
            resumen: 'Ruta directa al campo para profesionales con experiencia en investigación, ingeniería, política y advocacy. Impact Academy se renombró SteadRise.',
            etiquetas: ['profesionales', 'colocación', 'internacional'],
            enlace: 'https://impactacademy.org',
            idioma: 'en'
        },
        {
            titulo: 'ERA Fellowship (Cambridge)',
            tipo: 'Programa de investigación',
            area: 'Mixta',
            formato: 'Presencial (Cambridge)',
            duracion: '8-9 semanas',
            resumen: 'Investigación de verano sobre riesgos existenciales y gobernanza de IA, con mentoría y beca en la Universidad de Cambridge.',
            etiquetas: ['Cambridge', 'verano', 'riesgo existencial'],
            enlace: 'https://erafellowship.org',
            idioma: 'en'
        },

        /* ── Fellowships de política y gobernanza ────────────────── */
        {
            titulo: 'GovAI: oportunidades y fellowships',
            tipo: 'Fellowship de política',
            area: 'Gobernanza',
            formato: 'Presencial (Oxford) y remoto',
            duracion: '3 meses',
            resumen: 'Fellowships de verano e invierno del Centre for the Governance of AI, con mentoría doble y seminarios de investigación.',
            etiquetas: ['gobernanza', 'mentoría', 'Oxford'],
            enlace: 'https://www.governance.ai/opportunities',
            idioma: 'en'
        },
        {
            titulo: 'Horizon Fellowship',
            tipo: 'Fellowship de política',
            area: 'Gobernanza',
            formato: 'Presencial (Washington D. C.)',
            duracion: '6-24 meses',
            resumen: 'Colocaciones en oficinas de gobierno, comités del Congreso y centros de pensamiento de Estados Unidos sobre tecnologías emergentes.',
            etiquetas: ['gobierno', 'Estados Unidos', 'colocación'],
            enlace: 'https://horizonpublicservice.org',
            idioma: 'en'
        },
        {
            titulo: 'IAPS (Institute for AI Policy and Strategy)',
            tipo: 'Fellowship de política',
            area: 'Gobernanza',
            formato: 'Washington D. C. y remoto',
            duracion: '3 meses',
            resumen: 'Proyectos de investigación sobre gobernanza de modelos de frontera, con acompañamiento y acceso a la red de política de IA.',
            etiquetas: ['modelos de frontera', 'política', 'investigación'],
            enlace: 'https://www.iaps.ai',
            idioma: 'en'
        },
        {
            titulo: 'Talos Network',
            tipo: 'Fellowship de política',
            area: 'Gobernanza',
            formato: 'Bruselas y remoto',
            duracion: '7 meses',
            resumen: 'Curso de fundamentos, cumbre en Bruselas y colocación remunerada en organizaciones europeas de política de IA.',
            etiquetas: ['Unión Europea', 'colocación', 'beca'],
            enlace: 'https://www.talosnetwork.org',
            idioma: 'en'
        },
        {
            titulo: 'Tarbell Fellowship',
            tipo: 'Fellowship de política',
            area: 'Comunicación',
            formato: 'Presencial (redacciones)',
            duracion: '1 año',
            resumen: 'Periodismo especializado en IA con beca y colocación en una redacción. El programa ahora opera bajo el Tarbell Center.',
            etiquetas: ['periodismo', 'divulgación', 'beca'],
            enlace: 'https://www.tarbellcenter.org/fellowship',
            idioma: 'en'
        },
        {
            titulo: 'Institute for Law & AI',
            tipo: 'Fellowship de política',
            area: 'Gobernanza',
            formato: 'Remoto con semanas presenciales',
            duracion: '8-12 semanas',
            resumen: 'Programas de verano en derecho y política de IA, con vertientes estadounidense y europea y una semana intensiva presencial.',
            etiquetas: ['derecho', 'Europa', 'Estados Unidos'],
            enlace: 'https://law-ai.org',
            idioma: 'en'
        },
        {
            titulo: 'RAND: Global and Emerging Risks',
            tipo: 'Fellowship de política',
            area: 'Gobernanza',
            formato: 'Presencial y remoto',
            duracion: '1-3 años',
            resumen: 'Investigación sobre seguridad y tecnologías emergentes en RAND, incluido su centro de seguridad de la IA y programas de fellows.',
            etiquetas: ['seguridad nacional', 'centro de pensamiento', 'investigación'],
            enlace: 'https://www.rand.org/tasp.html',
            idioma: 'en'
        },

        /* ── Agendas de investigación ────────────────────────────── */
        {
            titulo: 'Open Problems in Technical AI Governance',
            tipo: 'Agenda de investigación',
            area: 'Gobernanza técnica',
            formato: 'Lectura (arXiv)',
            duracion: 'Problemas abiertos',
            resumen: 'Mapa de problemas abiertos donde herramientas técnicas pueden habilitar la gobernanza: evaluaciones, verificación y cómputo.',
            etiquetas: ['evaluaciones', 'gobernanza técnica', 'agenda'],
            enlace: 'https://arxiv.org/abs/2407.14981',
            idioma: 'en'
        },
        {
            titulo: 'Open Problems in Mechanistic Interpretability',
            tipo: 'Agenda de investigación',
            area: 'Técnica',
            formato: 'Lectura (arXiv)',
            duracion: 'Problemas abiertos',
            resumen: 'Revisión colectiva de los problemas abiertos que definen la agenda de interpretabilidad mecanicista y sus retos conceptuales.',
            etiquetas: ['interpretabilidad', 'agenda', 'revisión'],
            enlace: 'https://arxiv.org/abs/2501.16496',
            idioma: 'en'
        },
        {
            titulo: 'Foundational Challenges in Assuring Alignment and Safety of LLMs',
            tipo: 'Agenda de investigación',
            area: 'Técnica',
            formato: 'Lectura (arXiv)',
            duracion: 'Problemas abiertos',
            resumen: 'Doscientas preguntas de investigación sobre los retos fundamentales para asegurar la alineación y seguridad de modelos de lenguaje.',
            etiquetas: ['LLM', 'agenda', 'colaborativo'],
            enlace: 'https://arxiv.org/abs/2404.09932',
            idioma: 'en'
        },
        {
            titulo: 'GovAI: investigación',
            tipo: 'Agenda de investigación',
            area: 'Gobernanza',
            formato: 'Lectura',
            duracion: 'Referencia permanente',
            resumen: 'Publicaciones y líneas de investigación del Centre for the Governance of AI, útiles para identificar preguntas de política pendientes.',
            etiquetas: ['política', 'publicaciones', 'agenda'],
            enlace: 'https://www.governance.ai/research',
            idioma: 'en'
        },

        /* ── Organizaciones de investigación ─────────────────────── */
        {
            titulo: 'METR (Model Evaluation & Threat Research)',
            tipo: 'Organización',
            area: 'Gobernanza técnica',
            formato: 'Remoto / Berkeley',
            duracion: 'Continuo',
            resumen: 'Desarrolla y ejecuta evaluaciones de capacidades peligrosas, incluida la autonomía y la capacidad de hacer investigación en IA.',
            etiquetas: ['evaluaciones', 'capacidades', 'referencia'],
            enlace: 'https://metr.org',
            idioma: 'en'
        },
        {
            titulo: 'Redwood Research',
            tipo: 'Organización',
            area: 'Técnica',
            formato: 'Presencial (Berkeley)',
            duracion: 'Continuo',
            resumen: 'Investigación sobre control de IA y simulación de alineación; también asesora a gobiernos y empresas en prácticas de seguridad.',
            etiquetas: ['control de IA', 'investigación', 'asesoría'],
            enlace: 'https://www.redwoodresearch.org',
            idioma: 'en'
        },
        {
            titulo: 'Center for AI Safety (CAIS)',
            tipo: 'Organización',
            area: 'Técnica',
            formato: 'Presencial (San Francisco) y remoto',
            duracion: 'Continuo',
            resumen: 'Investigación técnica, construcción de campo y promoción de estándares de seguridad. Publica el boletín de referencia del sector.',
            etiquetas: ['investigación', 'estándares', 'campo'],
            enlace: 'https://safe.ai',
            idioma: 'en'
        },
        {
            titulo: 'UK AI Security Institute (AISI)',
            tipo: 'Organización',
            area: 'Gobernanza técnica',
            formato: 'Presencial (Reino Unido)',
            duracion: 'Continuo',
            resumen: 'Instituto gubernamental que evalúa modelos de frontera y publica metodologías de evaluación reutilizables por otros países.',
            etiquetas: ['gobierno', 'evaluaciones', 'modelo institucional'],
            enlace: 'https://www.aisi.gov.uk',
            idioma: 'en'
        },

        /* ── Carrera y empleo ────────────────────────────────────── */
        {
            titulo: '80,000 Hours: bolsa de trabajo',
            tipo: 'Carrera y empleo',
            area: 'General',
            formato: 'En línea',
            duracion: 'Continuo',
            resumen: 'Vacantes de alto impacto en investigación, política y operaciones, con filtros por causa, ubicación y nivel de experiencia.',
            etiquetas: ['empleos', 'vacantes', 'filtros'],
            enlace: 'https://jobs.80000hours.org',
            idioma: 'en'
        },
        {
            titulo: 'Successif',
            tipo: 'Carrera y empleo',
            area: 'General',
            formato: 'En línea',
            duracion: 'Acompañamiento',
            resumen: 'Mentoría de carrera para profesionales de media y alta trayectoria que quieren reorientarse hacia trabajo en seguridad en IA.',
            etiquetas: ['mentoría', 'transición', 'profesionales'],
            enlace: 'https://www.successif.org',
            idioma: 'en'
        },

        /* ── Financiamiento ──────────────────────────────────────── */
        {
            titulo: 'Long-Term Future Fund',
            tipo: 'Financiamiento',
            area: 'General',
            formato: 'En línea',
            duracion: 'Convocatoria abierta',
            resumen: 'Financia proyectos individuales y de grupos pequeños en seguridad en IA, incluidos periodos de estudio y de investigación independiente.',
            etiquetas: ['becas', 'individual', 'flexible'],
            enlace: 'https://funds.effectivealtruism.org',
            idioma: 'en'
        },
        {
            titulo: 'grantmaking.ai',
            tipo: 'Financiamiento',
            area: 'General',
            formato: 'En línea',
            duracion: 'Rondas periódicas',
            resumen: 'Base pública de proyectos de seguridad en IA que buscan financiamiento, con evaluaciones comunitarias para coordinar donantes.',
            etiquetas: ['transparencia', 'donantes', 'nuevo'],
            enlace: 'https://www.grantmaking.ai',
            idioma: 'en'
        },

        /* ── Boletines y medios ──────────────────────────────────── */
        {
            titulo: 'AI Safety Newsletter (CAIS)',
            tipo: 'Boletines y medios',
            area: 'General',
            formato: 'Correo electrónico',
            duracion: 'Semanal',
            resumen: 'Resumen semanal de los desarrollos más relevantes en seguridad en IA, escrito para audiencias técnicas y no técnicas.',
            etiquetas: ['boletín', 'semanal', 'panorama'],
            enlace: 'https://newsletter.safe.ai',
            idioma: 'en'
        },
        {
            titulo: 'Transformer',
            tipo: 'Boletines y medios',
            area: 'Comunicación',
            formato: 'Correo electrónico y web',
            duracion: 'Varias veces por semana',
            resumen: 'Periodismo independiente sobre la industria de la IA y sus implicaciones de política, con reportería original.',
            etiquetas: ['periodismo', 'política', 'industria'],
            enlace: 'https://www.transformernews.ai',
            idioma: 'en'
        },
        {
            titulo: "Don't Worry About the Vase",
            tipo: 'Boletines y medios',
            area: 'General',
            formato: 'Boletín',
            duracion: 'Semanal',
            resumen: 'Análisis exhaustivo de Zvi Mowshowitz sobre novedades en IA; el registro más completo semana a semana del campo.',
            etiquetas: ['análisis', 'profundidad', 'seguimiento'],
            enlace: 'https://thezvi.substack.com',
            idioma: 'en'
        },
        {
            titulo: 'Import AI',
            tipo: 'Boletines y medios',
            area: 'General',
            formato: 'Correo electrónico',
            duracion: 'Semanal',
            resumen: 'Boletín de Jack Clark que conecta avances técnicos de investigación con sus consecuencias de política y gobernanza.',
            etiquetas: ['boletín', 'investigación', 'política'],
            enlace: 'https://jack-clark.net',
            idioma: 'en'
        },
        {
            titulo: 'AI Lab Watch',
            tipo: 'Boletines y medios',
            area: 'Gobernanza',
            formato: 'En línea',
            duracion: 'Actualización continua',
            resumen: 'Seguimiento comparado de las prácticas y compromisos de seguridad de los laboratorios de IA de frontera.',
            etiquetas: ['rendición de cuentas', 'comparativo', 'laboratorios'],
            enlace: 'https://ailabwatch.org',
            idioma: 'en'
        },
        {
            titulo: 'ControlAI',
            tipo: 'Boletines y medios',
            area: 'Gobernanza',
            formato: 'En línea y correo electrónico',
            duracion: 'Continuo',
            resumen: 'Organización de advocacy con boletín y materiales divulgativos sobre riesgos de la IA avanzada dirigidos a tomadores de decisión.',
            etiquetas: ['advocacy', 'divulgación', 'boletín'],
            enlace: 'https://controlai.org',
            idioma: 'en'
        }
    ]
};
