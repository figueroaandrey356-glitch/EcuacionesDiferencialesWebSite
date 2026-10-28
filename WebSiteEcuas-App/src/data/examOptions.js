// Opciones compartidas por los filtros del sitio y el formulario de administración
export const YEARS = [2023, 2024, 2025, 2026];

export const SEMESTERS = [
  { id: 'I', label: 'Semestre I' },
  { id: 'II', label: 'Semestre II' },
];

export const EXAM_NAMES = [
  'Primer Parcial',
  'Segundo Parcial',
  'Tercer Parcial',
  'Examen de Reposición',
];

export const VARIANTS = ['Ordinario', 'Extraordinario'];

// El examen de reposición se hace una sola vez por semestre: no tiene tipo que elegir ni mostrar.
// Se guarda con este tipo fijo, así la regla de no repetir exámenes permite uno por semestre.
export const MAKEUP_EXAM = 'Examen de Reposición';
export const MAKEUP_VARIANT = 'Reposición';

export const hasVariant = name => name !== MAKEUP_EXAM;

// "Primer Parcial Ordinario", o solo "Examen de Reposición"
export const examLabel = exam => (hasVariant(exam.name) ? `${exam.name} ${exam.variant}` : exam.name);
