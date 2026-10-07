import { EXAM_NAMES, SEMESTERS, VARIANTS, YEARS } from '../data/examOptions';

export const createEmptyExam = () => ({
  id: null,
  year: YEARS.at(-1),
  semester: SEMESTERS[0].id,
  name: EXAM_NAMES[0],
  variant: VARIANTS[0],
  status: 'draft',
  pdfPath: null,
  questions: [],
});

export const createEmptyQuestion = () => ({
  id: crypto.randomUUID(),
  topic: null,
  statement: null,
  steps: [],
  fullSolution: null,
});

// En el formulario un campo sin agregar vale null; en la base de datos se guarda como texto vacío
export const toDraftQuestion = question => ({
  ...question,
  topic: question.topic || null,
  statement: question.statement || null,
  fullSolution: question.fullSolution || null,
});

// Limpia espacios y descarta pasos y problemas vacíos
export const toSavedQuestions = questions =>
  questions
    .map(question => ({
      id: question.id,
      topic: question.topic?.trim() ?? '',
      statement: question.statement?.trim() ?? '',
      steps: question.steps.map(step => step.trim()).filter(Boolean),
      fullSolution: question.fullSolution?.trim() ?? '',
    }))
    .filter(q => q.topic || q.statement || q.steps.length > 0 || q.fullSolution);
