#!/usr/bin/env node
/**
 * Genera src/data/certificates.json a partir de las imagenes en public/certs/.
 *
 * Para cada certificado:
 *  - Detecta por OCR (tesseract.js) la linea "Se otorga a: / Se otorga al paper:"
 *    y la linea "Por su valiosa participacion..." que la sigue.
 *  - Recorta (sharp) la franja entre ambas lineas -> ahi vive el/los nombre(s)
 *    en tipografia grande, que Tesseract no lee bien en el OCR de pagina completa.
 *  - Vuelve a correr OCR solo sobre ese recorte para extraer el/los nombre(s).
 *  - Extrae la fecha impresa (ej. "29 de mayo del 2026" o "19-21 de Junio del 2026")
 *    y, si existe, el titulo del "Paper:".
 *
 * Esto es un PRE-LLENADO automatico. Siempre revisa/corrige
 * src/data/certificates.csv a mano antes de publicar (nombres con acentos,
 * erratas de OCR, etc.) y vuelve a correr `npm run build:data` si haces
 * cambios en el CSV para que se reflejen en el JSON... en realidad el JSON
 * es la fuente que consume el sitio: si corriges algo, edita certificates.json
 * directamente (o borra un registro y vuelve a correr el script solo para esa
 * imagen) - certificates.csv es solo para que revises visualmente en Excel/Sheets.
 */
import { createWorker } from 'tesseract.js';
import sharp from 'sharp';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CERTS_DIR = path.join(ROOT, 'public', 'images', 'gsh', 'certificates');
const DATA_DIR = path.join(ROOT, 'src', 'data');
const PUBLIC_PREFIX = '/images/gsh/certificates';

// Correcciones manuales que el OCR no puede deducir por si solo (roles
// reales que no estan impresos en el certificado, o erratas de OCR).
// Se aplican DESPUES de la extraccion automatica, asi que sobreviven a
// futuras corridas de este script.
const NAME_OVERRIDES = {
  'cert-06': ['Fernando Castillo'],
};

const ROLE_OVERRIDES = {
  'cert-13': 'Organizador(a)', // Angel Tenorio
  'cert-14': 'Organizador(a)', // Max Pinelo
  'cert-25': 'Organizador(a)', // Janeth Valdivia
  'cert-26': 'Organizador(a)', // Isabel Camara Montalvo
  'cert-27': 'Organizador(a)', // Dexter Gomez
  'cert-28': 'Organizador(a)', // Marco Guzman

  'cert-02': 'Speaker y Juez', // Luis Cosio
  'cert-03': 'Speaker y Juez', // Nikita Lokhmachev
  'cert-04': 'Speaker y Juez', // Camilla Balbis
  'cert-05': 'Speaker y Juez', // Marcos Galvan Lopez
  'cert-06': 'Speaker y Juez', // Fernando Castillo

  'cert-18': 'Juez', // Jesus M. Siqueiros
  'cert-19': 'Juez', // Amanda Isbosseth Guzman
  'cert-20': 'Juez', // Marta Kosmyna
  'cert-21': 'Juez', // Osmani Redondo
  'cert-22': 'Juez', // Vincent Mai
  'cert-23': 'Juez', // Ivete Sanchez Bravo
  'cert-24': 'Juez', // Silvia Fernandez
};

const MONTHS = {
  enero: '01', febrero: '02', marzo: '03', abril: '04', mayo: '05', junio: '06',
  julio: '07', agosto: '08', septiembre: '09', setiembre: '09', octubre: '10',
  noviembre: '11', diciembre: '12',
};

function parseSpanishDate(raw) {
  if (!raw) return null;
  const m = raw
    .toLowerCase()
    .match(/(\d{1,2})(?:\s*[-–]\s*(\d{1,2}))?\s+de\s+([a-záéíóúñ]+)\s+del?\s+(\d{4})/i);
  if (!m) return null;
  const [, day1, day2, monthName, year] = m;
  const month = MONTHS[monthName] || null;
  const day = (day2 || day1).padStart(2, '0');
  const iso = month ? `${year}-${month}-${day}` : null;
  const displayMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  const display = day2
    ? `${day1}-${day2} de ${displayMonth} del ${year}`
    : `${day1} de ${displayMonth} del ${year}`;
  return { iso, display };
}

function roleLabel(roleLine) {
  if (!roleLine) return 'Participante';
  if (/speaker/i.test(roleLine)) return 'Speaker';
  if (/voluntari/i.test(roleLine)) return 'Voluntario(a)';
  if (/mentor/i.test(roleLine)) return 'Mentor(a)';
  return 'Participante';
}

async function extractLines(worker, file) {
  const { data } = await worker.recognize(file, {}, { blocks: true, text: true });
  const lines = [];
  for (const b of data.blocks || []) {
    for (const p of b.paragraphs || []) {
      for (const l of p.lines || []) {
        lines.push({ text: l.text.trim(), bbox: l.bbox });
      }
    }
  }
  return { lines, fullText: data.text };
}

async function extractRecord(worker, file, id, image) {
  const { lines, fullText } = await extractLines(worker, file);

  const startIdx = lines.findIndex((l) => /se otorga/i.test(l.text));
  const endIdx = lines.findIndex(
    (l, i) => i > startIdx && /^por\s+su\s+valiosa/i.test(l.text)
  );

  let names = [];
  let needsReview = false;

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    const top = lines[startIdx].bbox.y1 + 4;
    const bottom = lines[endIdx].bbox.y0 - 4;
    const meta = await sharp(file).metadata();
    const height = Math.max(bottom - top, 10);
    const cropBuf = await sharp(file)
      .extract({ left: 0, top, width: meta.width, height })
      .toBuffer();
    const { data: cropData } = await worker.recognize(cropBuf);
    const rawName = cropData.text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    names = rawName
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  if (names.length === 0) {
    names = ['(nombre pendiente de revisar)'];
    needsReview = true;
  }

  const roleLine = endIdx !== -1 ? lines[endIdx].text : null;

  // "Paper: X" suele ser una linea propia cerca del final (distinta de
  // "Se otorga al paper:" que ya se usa como marcador de inicio de nombres).
  const paperLineIdx = lines.findIndex((l, i) => i > (endIdx ?? -1) && /^paper:/i.test(l.text));
  let paper = null;
  if (paperLineIdx !== -1) {
    let title = lines[paperLineIdx].text.replace(/^paper:\s*/i, '').trim();
    const next = lines[paperLineIdx + 1];
    if (next && !/^agradecemos/i.test(next.text) && !/^\d{1,2}\s*[-–]?\s*\d{0,2}\s*de\s/i.test(next.text)) {
      title = `${title} ${next.text}`.trim();
    }
    paper = title;
  }

  const dateMatch = fullText.match(
    /(\d{1,2}(?:\s*[-–]\s*\d{1,2})?\s+de\s+[a-záéíóúñA-ZÁÉÍÓÚÑ]+\s+del?\s+\d{4})/
  );
  const parsedDate = parseSpanishDate(dateMatch ? dateMatch[1] : null);
  if (!parsedDate) needsReview = true;

  if (NAME_OVERRIDES[id]) {
    names = NAME_OVERRIDES[id];
    needsReview = false;
  }

  const role = ROLE_OVERRIDES[id] || roleLabel(roleLine);

  return {
    id,
    image,
    names,
    name: names.join('; '),
    role,
    paper,
    issuedOnIso: parsedDate?.iso ?? null,
    issuedOnDisplay: parsedDate?.display ?? null,
    needsReview,
  };
}

async function main() {
  await mkdir(DATA_DIR, { recursive: true });
  const files = (await readdir(CERTS_DIR))
    .filter((f) => /\.png$/i.test(f))
    .sort();

  console.log(`Procesando ${files.length} certificados con OCR (tesseract.js)...`);
  const worker = await createWorker('spa');

  const records = [];
  let i = 0;
  for (const file of files) {
    i += 1;
    const id = path.basename(file, '.png');
    const fullPath = path.join(CERTS_DIR, file);
    process.stdout.write(`  [${i}/${files.length}] ${file}...`);
    try {
      const record = await extractRecord(worker, fullPath, id, `${PUBLIC_PREFIX}/${file}`);
      records.push(record);
      console.log(` ${record.needsReview ? 'REVISAR' : 'ok'} -> ${record.name}`);
    } catch (err) {
      console.log(' ERROR', err.message);
      records.push({
        id,
        image: `${PUBLIC_PREFIX}/${file}`,
        names: ['(nombre pendiente de revisar)'],
        name: '(nombre pendiente de revisar)',
        role: 'Participante',
        paper: null,
        issuedOnIso: null,
        issuedOnDisplay: null,
        needsReview: true,
      });
    }
  }

  await worker.terminate();

  await writeFile(
    path.join(DATA_DIR, 'certificates.json'),
    JSON.stringify(records, null, 2) + '\n'
  );

  const csvEscape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csvHeader = 'id,image,name,role,paper,issuedOnDisplay,needsReview';
  const csvRows = records.map((r) =>
    [r.id, r.image, r.name, r.role, r.paper, r.issuedOnDisplay, r.needsReview]
      .map(csvEscape)
      .join(',')
  );
  await writeFile(
    path.join(DATA_DIR, 'certificates.csv'),
    [csvHeader, ...csvRows].join('\n') + '\n'
  );

  const toReview = records.filter((r) => r.needsReview).length;
  console.log(`\nListo. ${records.length} certificados procesados, ${toReview} marcados para revision manual.`);
  console.log(`- src/data/certificates.json (fuente que usa el sitio)`);
  console.log(`- src/data/certificates.csv (para revisar/corregir a mano)`);
}

main();
