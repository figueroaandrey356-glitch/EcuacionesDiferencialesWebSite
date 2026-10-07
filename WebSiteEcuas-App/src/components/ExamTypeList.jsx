import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPublishedExams } from '../data/examsApi';

// Columnas compartidas por el encabezado y las filas (solo desde sm; en móvil la fila se apila)
const rowColumns = 'sm:grid sm:grid-cols-[2.5rem_minmax(0,1fr)_9rem_8rem_7rem] sm:items-baseline sm:gap-x-6';

const describeContent = exam => {
  const count = exam.questions.length;
  if (count === 0) return 'Solo PDF';
  const problems = count === 1 ? '1 problema' : `${count} problemas`;
  return exam.pdfPath ? `${problems} + PDF` : problems;
};

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
          <p className="font-mono text-small text-sand-500">
            {exams.length === 1 ? '1 examen' : `${exams.length} exámenes`}
          </p>
        )}
      </div>

      {exams.length === 0 ? (
        <p className="mt-6 border-y border-sand-300 py-12 text-sand-600">{emptyMessage}</p>
      ) : (
        <div className="mt-6 border-t border-ink">
          <div
            aria-hidden="true"
            className={`hidden border-b border-sand-300 py-2.5 font-mono text-label font-medium uppercase text-sand-500 ${rowColumns}`}
          >
            <span>N.º</span>
            <span>Examen</span>
            <span>Tipo</span>
            <span>Contenido</span>
            <span />
          </div>

          <ul>
            {exams.map((exam, index) => {
              const hasQuestions = exam.questions.length > 0;

              return (
                <li key={exam.id} className="border-b border-sand-200">
                  <Link
                    to={`/exam/${exam.id}`}
                    className={`group block py-5 transition-colors duration-150 hover:bg-sand-100 ${rowColumns}`}
                  >
                    <span className="hidden font-mono text-small text-sand-500 sm:block">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="block font-display text-subheading font-semibold text-ink">
                      {exam.name}
                    </span>
                    {/* En móvil, tipo y contenido comparten una línea bajo el nombre */}
                    <span className="text-small text-sand-600 sm:block">
                      {exam.variant}
                      <span className="sm:hidden"> · </span>
                    </span>
                    <span className="text-small text-sand-600 sm:block">
                      {describeContent(exam)}
                    </span>
                    <span className="mt-3 block text-small font-semibold text-accent group-hover:underline sm:mt-0 sm:text-right">
                      {hasQuestions ? 'Practicar' : 'Descargar'}
                      <span aria-hidden="true"> →</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
