import { lazy, Suspense } from 'react';
import { getPdfDownloadUrl, getPdfFileName, getPdfUrl } from '../data/examsApi';

// pdf.js pesa bastante: solo se descarga al abrir un examen
const PdfViewer = lazy(() => import('./PdfViewer'));

// Lo que ve el estudiante de un examen. También lo usa la vista previa del administrador.
// pdfUrl permite a la vista previa mostrar un PDF que aún no se ha subido; en ese caso
// se descarga desde la misma URL local.
export default function ExamView({ exam, pdfUrl }) {
  const viewUrl = pdfUrl ?? getPdfUrl(exam.pdfPath);
  const downloadUrl = pdfUrl ?? getPdfDownloadUrl(exam);
  const semesterLabel = exam.semester === 'Verano' ? 'Verano' : `Semestre ${exam.semester}`;
  const title = `${exam.name} · ${exam.variant}`;

  return (
    <>
      {/* Título, meta y acciones del examen */}
      <div className="mb-section-sm flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
        <div>
          <p className="font-mono text-label font-medium uppercase text-neutral-500">
            {[exam.year, semesterLabel, exam.variant].filter(Boolean).join(' · ')}
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
              download={getPdfFileName(exam)}
              className="rounded-control bg-ink px-4 py-2.5 text-small font-semibold text-white transition-colors duration-150 hover:bg-neutral-700"
            >
              <span aria-hidden="true">↓ </span>Descargar PDF
            </a>
          </div>
        )}
      </div>

      {viewUrl ? (
        <div className="-mx-gutter bg-surface px-3 py-6 sm:mx-0 sm:rounded-panel sm:p-8">
          <Suspense fallback={<p className="py-section-sm text-center text-neutral-500">Cargando examen…</p>}>
            <PdfViewer url={viewUrl} title={title} />
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
