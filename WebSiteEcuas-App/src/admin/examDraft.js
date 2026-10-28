import { EXAM_NAMES, SEMESTERS, VARIANTS, YEARS } from '../data/examOptions';

export const createEmptyExam = () => ({
  id: null,
  year: YEARS.at(-1),
  semester: SEMESTERS[0].id,
  name: EXAM_NAMES[0],
  variant: VARIANTS[0],
  status: 'draft',
  pdfPath: null,
  solutionPdfPath: null,
});
