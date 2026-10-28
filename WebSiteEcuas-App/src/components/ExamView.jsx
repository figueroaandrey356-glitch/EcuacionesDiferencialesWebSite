import { lazy, Suspense, useState } from 'react';
import { examLabel, hasVariant } from '../data/examOptions';
import { getPdfDownloadUrl, getPdfFileName, getPdfUrl } from '../data/examsApi';
import { loadPdfViewer } from './loadPdfViewer';
import PdfPlaceholder from './PdfPlaceholder';

const PdfViewer = lazy(loadPdfViewer);

const versions = [
  { id: false, label: 'Sin solución' },
  { id: true, label: 'Con solución' },
];

function LockIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5" fill="currentColor">
      <path d="M8 1a3.5 3.5 0 0 0-3.5 3.5V7H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-.5V4.5A3.5 3.5 0 0 0 8 1Zm2 6H6V4.5a2 2 0 1 1 4 0V7Z" />
    </svg>
  );
}

// Lo que ve el estudiante de un examen. También lo usa la vista previa del administrador.
// pdfUrl y solutionPdfUrl permiten a la vista previa mostrar PDF que aún no se han subido; en ese
// caso se descargan desde la misma URL local.
export default function ExamView({ exam, pdfUrl, solutionPdfUrl }) {
  const [showSolution, setShowSolution] = useState(false);

  const statementUrl = pdfUrl ?? getPdfUrl(exam.pdfPath);
  const solutionUrl = solutionPdfUrl ?? getPdfUrl(exam.solutionPdfPath);
  // Un examen puede tener solo una de las dos versiones: se muestra la elegida si existe, si no la otra
  const available = { false: Boolean(statementUrl), true: Boolean(solutionUrl) };
  const solution = available[showSolution] ? showSolution : available.true && !available.false;

  const viewUrl = solution ? solutionUrl : statementUrl;
  const downloadUrl = (solution ? solutionPdfUrl : pdfUrl) ?? getPdfDownloadUrl(exam, { solution });
  const semesterLabel = `Semestre ${exam.semester}`;
  const title = examLabel(exam);

  return (
    <>
      {/* Título, meta y acciones del examen */}
      <div className="mb-section-sm flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
        <div>
          <p className="font-sans tabular-nums text-label font-medium uppercase text-neutral-500">
            {[exam.year, semesterLabel, hasVariant(exam.name) && exam.variant].filter(Boolean).join(' · ')}
          </p>
          <h1 className="mt-3 font-display text-title font-semibold text-ink">
            {exam.name}
          </h1>
        </div>

        {viewUrl && (
          <div className="flex flex-wrap gap-2 print:hidden">
            <a
              href={viewUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-control border border-neutral-300 px-4 py-2.5 text-small font-semibold text-neutral-600 transition-colors duration-150 hover:border-neutral-400 hover:bg-neutral-100 hover:text-ink"
            >
              Abrir en otra pestaña<span aria-hidden="true"> ↗</span>
            </a>
            <a
              href={downloadUrl}
              download={getPdfFileName(exam, { solution })}
              className="rounded-control bg-ink px-4 py-2.5 text-small font-semibold text-white transition-colors duration-150 hover:bg-neutral-700"
            >
              <span aria-hidden="true">↓ </span>Descargar PDF
            </a>
          </div>
        )}
      </div>

      {/* Versión del PDF: siempre están los dos botones; la que no se subió aparece con candado */}
      <div className="mb-6 flex flex-wrap items-center gap-3 print:hidden">
        <span className="font-sans text-label font-medium uppercase text-neutral-500">Versión</span>
        <div className="inline-flex gap-1 rounded-control bg-neutral-100 p-1">
          {versions.map(version =>
            available[version.id] ? (
              <button
                key={version.label}
                type="button"
                onClick={() => setShowSolution(version.id)}
                aria-pressed={solution === version.id}
                className={`rounded-control px-4 py-2 text-small font-semibold transition-colors duration-150 ${
                  solution === version.id ? 'bg-accent text-white' : 'text-neutral-500 hover:text-ink'
                }`}
              >
                {version.label}
              </button>
            ) : (
              <button
                key={version.label}
                type="button"
                disabled
                title="Esta versión no está disponible para este examen"
                className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-control px-4 py-2 text-small font-semibold text-neutral-400"
              >
                <LockIcon />
                {version.label}
                <span className="sr-only"> (no disponible)</span>
              </button>
            )
          )}
        </div>
      </div>

      {viewUrl ? (
        <div className="-mx-gutter bg-surface px-3 py-6 sm:mx-0 sm:rounded-panel sm:p-8">
          <Suspense fallback={<PdfPlaceholder />}>
            {/* key: al cambiar de PDF el visor empieza de cero (páginas, alto reservado) */}
            <PdfViewer key={viewUrl} url={viewUrl} title={title} />
          </Suspense>
        </div>
      ) : (
        <p className="max-w-prose border-y border-neutral-300 py-12 text-neutral-600">
          El PDF de este examen aún no está disponible.
        </p>
      )}
    </>
  );
}
