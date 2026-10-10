// Directorio de recursos abiertos de seguridad en IA.
//
// Fuente de datos: src/data/recursos.json. Cada entrada fue verificada
// manualmente (petición HTTP + revisión de contenido) en la fecha que
// declara el campo `actualizado`. El catálogo original venía de un listado
// interno en el que 14 de 38 enlaces estaban rotos o apuntaban a
// organizaciones renombradas; esas correcciones ya están aplicadas.
//
// El JSON se sirve además como descarga pública en /recursos.json para que
// otras comunidades de la región puedan reutilizarlo.
import raw from '../data/recursos.json';

export type Idioma = 'es' | 'en';

export interface Recurso {
  titulo: string;
  tipo: string;
  area: string;
  formato: string;
  duracion: string;
  resumen: string;
  etiquetas: string[];
  enlace: string;
  idioma: Idioma;
  /** Relevancia específica para América Latina. Ausente equivale a false. */
  latam?: boolean;
}

export interface Catalogo {
  /** Fecha ISO de la última verificación de enlaces. */
  actualizado: string;
  recursos: Recurso[];
}

const catalogo = raw as Catalogo;

export const recursos: Recurso[] = catalogo.recursos;
export const actualizado: string = catalogo.actualizado;

/** Valores únicos de un campo, ordenados alfabéticamente en español. */
export function valoresUnicos(campo: 'tipo' | 'area' | 'formato'): string[] {
  return [...new Set(recursos.map((r) => r[campo]))].sort((a, b) =>
    a.localeCompare(b, 'es'),
  );
}

export const totales = {
  recursos: recursos.length,
  cursos: recursos.filter((r) => r.tipo === 'Curso').length,
  programas: recursos.filter(
    (r) => r.tipo === 'Programa de investigación' || r.tipo === 'Fellowship de política',
  ).length,
  latam: recursos.filter((r) => r.latam === true).length,
  espanol: recursos.filter((r) => r.idioma === 'es').length,
};
