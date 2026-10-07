import QuestionCard from './QuestionCard';
import ExamIndex from './ExamIndex';
import { getPdfUrl } from '../data/examsApi';

// Lo que ve el estudiante de un examen. También lo usa la vista previa del administrador.
// pdfUrl permite a la vista previa mostrar un PDF que aún no se ha subido.
export default function ExamView({ exam, pdfUrl = getPdfUrl(exam.pdfPath) }) {
  const hasQuestions = exam.questions.length > 0;

  return (
    <>
      {/* Título y meta del examen */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 text-caption font-semibold">
          <span className="rounded-pill bg-sand-200/70 px-2.5 py-1 text-sand-600">
            {exam.year}
          </span>
          <span className="rounded-pill bg-sand-200/70 px-2.5 py-1 text-sand-600">
            {exam.semester === 'Verano' ? 'Verano' : `Semestre ${exam.semester}`}
          </span>
          {exam.variant && (
            <span className="rounded-pill bg-accent/10 px-2.5 py-1 text-accent">
              {exam.variant}
            </span>
          )}
        </div>

        <h1 className="mt-4 font-display text-title font-semibold text-ink">
          {exam.name}
        </h1>

        <div className="mt-6 flex flex-wrap gap-2 print:hidden">
          {pdfUrl ? (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              download
              className="rounded-control bg-ink px-4 py-2 text-small font-semibold text-white transition hover:bg-accent-dark"
            >
              ↓ Descargar enunciado (PDF)
            </a>
          ) : (
            <button
              disabled
              title="El enunciado en PDF de este examen aún no está disponible"
              className="cursor-not-allowed rounded-control border border-dashed border-sand-300 px-4 py-2 text-small font-semibold text-sand-400"
            >
              Descargar enunciado · pronto
            </button>
          )}
        </div>
      </div>

      {hasQuestions ? (
        /* Índice a la izquierda, preguntas a la derecha */
        <div className="grid items-start gap-8 lg:grid-cols-[260px_1fr]">
          <ExamIndex questions={exam.questions} />

          <div className="min-w-0 space-y-6">
            {exam.questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                questionNumber={index + 1}
                question={question}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="rounded-panel border border-dashed border-sand-300 px-6 py-12 text-center text-sand-500">
          {pdfUrl
            ? 'Este examen está disponible solo para descargar. La solución paso a paso aún no se ha cargado.'
            : 'Este examen aún no tiene contenido.'}
        </p>
      )}
    </>
  );
}
