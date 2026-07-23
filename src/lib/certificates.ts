// Certificados verificables — The Global South AIS Hackathon.
//
// Fuente de datos: src/data/certificates.json, generado por
// scripts/build-data.mjs (OCR sobre las imagenes en
// public/images/gsh/certificates/) con correcciones manuales
// aplicadas ahi mismo (ver NAME_OVERRIDES / ROLE_OVERRIDES).
import raw from '../data/certificates.json';

export interface Certificate {
  id: string;
  image: string;
  names: string[];
  name: string;
  role: string;
  paper: string | null;
  issuedOnIso: string | null;
  issuedOnDisplay: string | null;
  needsReview: boolean;
}

export const certificates: Certificate[] = raw as Certificate[];

export function getCertificate(id: string): Certificate | undefined {
  return certificates.find((c) => c.id === id);
}
