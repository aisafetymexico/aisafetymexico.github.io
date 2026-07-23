import type { Certificate } from './certificates';

export const ORG_NAME = 'AI Safety Mexico';
export const EVENT_NAME = 'The Global South AIS Hackathon';

const KNOWN_ROLES = [
  'Speaker',
  'Voluntario(a)',
  'Mentor(a)',
  'Organizador(a)',
  'Juez',
  'Speaker y Juez',
];

/**
 * Construye la URL de LinkedIn "Add to profile" para una credencial verificada.
 * Doc: https://www.linkedin.com/help/linkedin/answer/a566065
 *
 * `verifyUrl` debe ser la URL absoluta y canonica de la pagina de
 * verificacion (misma que codifica el QR), para que la credencial sea
 * comprobable por terceros.
 */
export function buildLinkedInAddUrl(cert: Certificate, verifyUrl: string): string {
  const certName = KNOWN_ROLES.includes(cert.role)
    ? `${cert.role} - ${EVENT_NAME}`
    : `Reconocimiento - ${EVENT_NAME}`;

  const [year, month] = (cert.issuedOnIso || '2026-06-21').split('-');

  const params = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: certName,
    organizationName: ORG_NAME,
    issueYear: year,
    issueMonth: String(Number(month)),
    certUrl: verifyUrl,
    certId: cert.id,
  });

  return `https://www.linkedin.com/profile/add?${params.toString()}`;
}
