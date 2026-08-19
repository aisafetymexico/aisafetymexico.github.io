// Certificados verificables — cursos (namespace aparte de GSH /certificados).
//
// Fuente de datos: src/data/course-certificates.json, generado por
// scripts/build-course-certs.mjs a partir de emails/courses/participants.csv.
// Metadatos del curso: src/data/course-meta.json.
import raw from '../data/course-certificates.json';
import meta from '../data/course-meta.json';

export interface CourseCertificate {
  id: string;
  image: string;
  names: string[];
  name: string;
  course: string;
  issuedOnIso: string | null;
  issuedOnDisplay: string | null;
}

export const COURSE_NAME: string = meta.courseName;
export const COURSE_VERIFY_PATH: string = meta.verifyPath;

export const courseCertificates: CourseCertificate[] = raw as CourseCertificate[];

export function getCourseCertificate(id: string): CourseCertificate | undefined {
  return courseCertificates.find((c) => c.id === id);
}
