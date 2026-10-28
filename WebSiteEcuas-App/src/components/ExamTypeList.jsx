import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPublishedExams, getPdfDownloadUrl, getPdfFileName } from '../data/examsApi';

// Columnas compartidas por el encabezado y las filas (solo desde sm; en móvil la fila se apila)
const rowColumns = 'sm:grid sm:grid-cols-[2.5rem_minmax(0,1fr)_9rem_12rem] sm:items-baseline sm:gap-x-6';

export default function ExamTypeList({ year, semester, variant = 'Todos' }) {
  const period = `${year}_${semester}`;
  // period identifica a qué consulta pertenece el resultado, para no mostrar uno viejo al cambiar de filtro
  const [result, setResult] = useState({ period: null, exams: [], failed: false });

  useEffect(() => {
    let cancelled = false;

    fetchPublishedExams(year, semester)
      .then(exams => {
        if (!cancelled) setResult({ period, exams, failed: false });
      })
      .catch(() => {
        if (!cancelled) setResult({ period, exams: [], failed: true });
      });

    return () => {
      cancelled = true;
    };
  }, [year, semester, period]);

  const loading = result.period !== period;
  const exams = loading
    ? []
    : result.exams.filter(exam => variant === 'Todos' || exam.variant === variant);

  let emptyMessage = `Aún no hay exámenes de tipo ${variant} cargados para este periodo.`;
  if (loading) emptyMessage = 'Cargando exámenes…';
  else if (result.failed) emptyMessage = 'No se pudieron cargar los exámenes. Revisa tu conexión e inténtalo de nuevo.';
  else if (variant === 'Todos') emptyMessage = 'Aún no hay exámenes cargados para este periodo.';

  return (
    <section className="mt-section-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 className="font-display text-heading font-semibold text-ink">
          {semester === 'Verano' ? 'Verano' : `Semestre ${semester}`} · {year}
        </h2>
        {!loading && !result.failed && (
          <p className="font-mono text-small text-neutral-500">
            {exams.length === 1 ? '1 examen' : `${exams.length} exámenes`}
          </p>
        )}
      </div>

      {exams.length === 0 ? (
        <p className="mt-6 border-y border-neutral-300 py-12 text-neutral-600">{emptyMessage}</p>
      ) : (
        <div className="mt-6 border-t border-ink">
          <div
            aria-hidden="true"
            className={`hidden border-b border-neutral-300 py-2.5 font-mono text-label font-medium uppercase text-neutral-500 ${rowColumns}`}
          >
            <span>N.º</span>
            <span>Examen</span>
            <span>Tipo</span>
            <span />
          </div>

          <ul>
            {exams.map((exam, index) => (
              <li
                key={exam.id}
                className={`border-b border-neutral-200 py-5 transition-colors duration-150 hover:bg-neutral-100 ${rowColumns}`}
              >
                <span className="hidden font-mono text-small text-neutral-500 sm:block">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <Link
                  to={`/exam/${exam.id}`}
                  className="block font-display text-subheading font-semibold text-ink underline-offset-4 hover:underline"
                >
                  {exam.name}
                </Link>
                <span className="block text-small text-neutral-600">{exam.variant}</span>
                <span className="mt-3 flex gap-5 text-small font-semibold sm:mt-0 sm:justify-end">
                  <Link to={`/exam/${exam.id}`} className="text-accent hover:underline">
                    Ver examen<span aria-hidden="true"> →</span>
                  </Link>
                  <a
                    href={getPdfDownloadUrl(exam)}
                    download={getPdfFileName(exam)}
                    aria-label={`Descargar ${exam.name} ${exam.variant} en PDF`}
                    className="text-neutral-600 hover:text-ink hover:underline"
                  >
                    Descargar<span aria-hidden="true"> ↓</span>
                  </a>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
