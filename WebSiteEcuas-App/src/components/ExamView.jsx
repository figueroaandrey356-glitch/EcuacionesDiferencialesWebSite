import QuestionCard from './QuestionCard';
import ExamIndex from './ExamIndex';
import { getPdfUrl } from '../data/examsApi';

// Lo que ve el estudiante de un examen. También lo usa la vista previa del administrador.
// pdfUrl permite a la vista previa mostrar un PDF que aún no se ha subido.
export default function ExamView({ exam, pdfUrl = getPdfUrl(exam.pdfPath) }) {
  const hasQuestions = exam.questions.length > 0;
  const semesterLabel = exam.semester === 'Verano' ? 'Verano' : `Semestre ${exam.semester}`;

  return (
    <>
      {/* Título y meta del examen */}
      <div className="mb-section-sm flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
        <div>
          <p className="font-mono text-label font-medium uppercase text-sand-500">
            {[exam.year, semesterLabel, exam.variant].filter(Boolean).join(' · ')}
          </p>
          <h1 className="mt-3 font-display text-title font-semibold text-ink">
            {exam.name}
          </h1>
        </div>

        <div className="print:hidden">
          {pdfUrl ? (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              download
              className="inline-block rounded-control bg-ink px-4 py-2.5 text-small font-semibold text-white transition hover:bg-sand-700"
            >
              <span aria-hidden="true">↓ </span>Descargar enunciado (PDF)
            </a>
          ) : (
            <button
              disabled
              title="El enunciado en PDF de este examen aún no está disponible"
              className="cursor-not-allowed rounded-control border border-dashed border-sand-300 px-4 py-2.5 text-small font-semibold text-sand-400"
            >
              Descargar enunciado · pronto
            </button>
          )}
        </div>
      </div>

      {hasQuestions ? (
        /* Índice angosto a la izquierda, problemas a la derecha */
        <div className="grid items-start gap-x-14 gap-y-10 lg:grid-cols-[13rem_minmax(0,1fr)]">
          <ExamIndex questions={exam.questions} />

          <div className="min-w-0">
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
        <p className="max-w-prose border-y border-sand-300 py-12 text-sand-600">
          {pdfUrl
            ? 'Este examen está disponible solo para descargar. La solución paso a paso aún no se ha cargado.'
            : 'Este examen aún no tiene contenido.'}
        </p>
      )}
    </>
  );
}
