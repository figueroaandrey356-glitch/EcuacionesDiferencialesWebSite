import { supabase } from '../lib/supabase';
import { examQuestions } from './examQuestions';
import { EXAM_NAMES, VARIANTS } from './examOptions';

const PDF_BUCKET = 'exam-pdfs';

// Código de Postgres cuando el id de la URL no es un uuid válido
const INVALID_UUID = '22P02';

const fromRow = row => ({
  id: row.id,
  year: row.year,
  semester: row.semester,
  name: row.name,
  variant: row.variant,
  status: row.status,
  pdfPath: row.pdf_path,
  questions: row.questions ?? [],
});

const toRow = exam => ({
  year: exam.year,
  semester: exam.semester,
  name: exam.name,
  variant: exam.variant,
  status: exam.status,
  pdf_path: exam.pdfPath,
  questions: exam.questions,
});

// Exámenes de ejemplo: se usan solo mientras Supabase no esté configurado
const localExams = Object.entries(examQuestions).map(([key, exam]) => {
  const [name, variant] = exam.title.split(' - ');
  return {
    id: key,
    year: exam.year,
    semester: exam.semester,
    name,
    variant,
    status: 'published',
    pdfPath: null,
    questions: exam.questions,
  };
});

const byExamOrder = (a, b) =>
  EXAM_NAMES.indexOf(a.name) - EXAM_NAMES.indexOf(b.name) ||
  VARIANTS.indexOf(a.variant) - VARIANTS.indexOf(b.variant);

export async function fetchPublishedExams(year, semester) {
  if (!supabase) {
    return localExams
      .filter(exam => exam.year === year && exam.semester === semester)
      .sort(byExamOrder);
  }

  const { data, error } = await supabase
    .from('exams')
    .select('*')
    .eq('status', 'published')
    .eq('year', year)
    .eq('semester', semester);
  if (error) throw error;

  return data.map(fromRow).sort(byExamOrder);
}

// Devuelve null si el examen no existe (o es un borrador y no hay sesión de admin)
export async function fetchExam(id) {
  if (!supabase) {
    return localExams.find(exam => exam.id === id) ?? null;
  }

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

// previousPdfPath: el PDF que tenía el examen antes de editarlo, para borrarlo si se reemplazó o quitó
export async function saveExam(exam, { pdfFile = null, previousPdfPath = null } = {}) {
  let pdfPath = exam.pdfPath;

  if (pdfFile) {
    pdfPath = `${crypto.randomUUID()}.pdf`;
    const { error } = await supabase.storage
      .from(PDF_BUCKET)
      .upload(pdfPath, pdfFile, { contentType: 'application/pdf' });
    if (error) throw error;
  }

  const row = toRow({ ...exam, pdfPath });
  const query = exam.id
    ? supabase.from('exams').update(row).eq('id', exam.id)
    : supabase.from('exams').insert(row);
  const { data, error } = await query.select().single();
  if (error) {
    if (pdfFile) await removePdf(pdfPath);
    throw error;
  }

  if (previousPdfPath && previousPdfPath !== pdfPath) {
    await removePdf(previousPdfPath);
  }

  return fromRow(data);
}

export async function setExamStatus(id, status) {
  const { error } = await supabase.from('exams').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function deleteExam(exam) {
  const { error } = await supabase.from('exams').delete().eq('id', exam.id);
  if (error) throw error;

  if (exam.pdfPath) await removePdf(exam.pdfPath);
}
