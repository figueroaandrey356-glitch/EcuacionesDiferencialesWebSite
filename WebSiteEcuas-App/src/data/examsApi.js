import { supabase } from '../lib/supabase';
import { EXAM_NAMES, VARIANTS } from './examOptions';

const PDF_BUCKET = 'exam-pdfs';

// Código de Postgres cuando el id de la URL no es un uuid válido
const INVALID_UUID = '22P02';
// Código de Postgres cuando ya existe un examen con las mismas asignaciones
export const DUPLICATE_KEY = '23505';

const fromRow = row => ({
  id: row.id,
  year: row.year,
  semester: row.semester,
  name: row.name,
  variant: row.variant,
  status: row.status,
  pdfPath: row.pdf_path,
  solutionPdfPath: row.solution_pdf_path,
});

const toRow = exam => ({
  year: exam.year,
  semester: exam.semester,
  name: exam.name,
  variant: exam.variant,
  status: exam.status,
  pdf_path: exam.pdfPath,
  solution_pdf_path: exam.solutionPdfPath,
});

const byExamOrder = (a, b) =>
  EXAM_NAMES.indexOf(a.name) - EXAM_NAMES.indexOf(b.name) ||
  VARIANTS.indexOf(a.variant) - VARIANTS.indexOf(b.variant);

export async function fetchPublishedExams(year, semester) {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('exams')
    .select('*')
    .eq('status', 'published')
    .eq('year', year)
    .eq('semester', semester)
    // Un examen sin PDF no tiene nada que mostrar en el banco
    .not('pdf_path', 'is', null);
  if (error) throw error;

  return data.map(fromRow).sort(byExamOrder);
}

// Devuelve null si el examen no existe (o es un borrador y no hay sesión de admin)
export async function fetchExam(id) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('exams')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    if (error.code === INVALID_UUID) return null;
    throw error;
  }

  return data ? fromRow(data) : null;
}

export function getPdfUrl(pdfPath) {
  if (!supabase || !pdfPath) return null;
  return supabase.storage.from(PDF_BUCKET).getPublicUrl(pdfPath).data.publicUrl;
}

// Nombre con el que se guarda el PDF al descargarlo, p. ej. ED-2025-II-Primer-Parcial-Ordinario.pdf
// o ED-2025-II-Primer-Parcial-Ordinario-Solucion.pdf para la versión con solución
export function getPdfFileName(exam, { solution = false } = {}) {
  const slug = ['ED', exam.year, exam.semester, exam.name, exam.variant, solution && 'Solucion']
    .filter(Boolean)
    .join(' ')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9]+/g, '-');
  return `${slug}.pdf`;
}

// El atributo download no funciona con archivos de otro dominio; Supabase fuerza la descarga
// con el parámetro ?download y le pone el nombre indicado
export function getPdfDownloadUrl(exam, { solution = false } = {}) {
  const pdfPath = solution ? exam.solutionPdfPath : exam.pdfPath;
  if (!supabase || !pdfPath) return null;
  return supabase.storage
    .from(PDF_BUCKET)
    .getPublicUrl(pdfPath, { download: getPdfFileName(exam, { solution }) }).data.publicUrl;
}

// --- Administración (requieren sesión de admin) ---

export async function fetchAllExams() {
  const { data, error } = await supabase
    .from('exams')
    .select('*')
    .order('year', { ascending: false })
    .order('semester')
    .order('updated_at', { ascending: false });
  if (error) throw error;

  return data.map(fromRow);
}

// Otro examen con el mismo año, semestre, nombre y tipo (solo puede haber uno por combinación)
export async function findDuplicateExam(exam) {
  let query = supabase
    .from('exams')
    .select('*')
    .eq('year', exam.year)
    .eq('semester', exam.semester)
    .eq('name', exam.name)
    .eq('variant', exam.variant);
  if (exam.id) query = query.neq('id', exam.id);

  const { data, error } = await query.limit(1).maybeSingle();
  if (error) throw error;

  return data ? fromRow(data) : null;
}

export async function checkIsAdmin(userId) {
  const { data, error } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;

  return Boolean(data);
}

async function removePdf(pdfPath) {
  // Si falla solo queda un archivo huérfano; no vale la pena interrumpir el guardado
  await supabase.storage.from(PDF_BUCKET).remove([pdfPath]);
}

// Los dos PDF de un examen: el enunciado (obligatorio para publicar) y la solución (opcional)
export const PDF_FIELDS = ['pdfPath', 'solutionPdfPath'];

async function uploadPdf(file) {
  const pdfPath = `${crypto.randomUUID()}.pdf`;
  const { error } = await supabase.storage
    .from(PDF_BUCKET)
    .upload(pdfPath, file, { contentType: 'application/pdf' });
  if (error) throw error;
  return pdfPath;
}

// files: PDF nuevos por campo, p. ej. { solutionPdfPath: File }
// previousPaths: los PDF que tenía el examen antes de editarlo, para borrar los que se reemplazaron o quitaron
export async function saveExam(exam, { files = {}, previousPaths = {} } = {}) {
  const paths = Object.fromEntries(PDF_FIELDS.map(field => [field, exam[field]]));
  const uploaded = [];

  try {
    for (const field of PDF_FIELDS) {
      if (!files[field]) continue;
      paths[field] = await uploadPdf(files[field]);
      uploaded.push(paths[field]);
    }

    const row = toRow({ ...exam, ...paths });
    const query = exam.id
      ? supabase.from('exams').update(row).eq('id', exam.id)
      : supabase.from('exams').insert(row);
    const { data, error } = await query.select().single();
    if (error) throw error;

    for (const field of PDF_FIELDS) {
      const previous = previousPaths[field];
      if (previous && previous !== paths[field]) await removePdf(previous);
    }

    return fromRow(data);
  } catch (error) {
    // Lo que se alcanzó a subir no quedó asociado a ningún examen
    await Promise.all(uploaded.map(removePdf));
    throw error;
  }
}

export async function setExamStatus(id, status) {
  const { error } = await supabase.from('exams').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function deleteExam(exam) {
  const { error } = await supabase.from('exams').delete().eq('id', exam.id);
  if (error) throw error;

  await Promise.all(PDF_FIELDS.filter(field => exam[field]).map(field => removePdf(exam[field])));
}
