import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPublishedExams } from '../data/examsApi';

const variantStyles = {
  Ordinario: 'bg-sand-200/70 text-sand-600',
  Extraordinario: 'bg-sand-200/70 text-sand-600',
  Reposición: 'bg-sand-200/70 text-sand-600',
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
    <section className="mt-10">
      <div className="mb-6">
        <h2 className="font-display text-heading font-semibold text-ink">
          {semester === 'Verano' ? 'Verano' : `Semestre ${semester}`} · {year}
        </h2>
        {!loading && !result.failed && (
          <p className="mt-1 text-small text-sand-500">
            {exams.length === 1
              ? '1 examen disponible'
              : `${exams.length} exámenes disponibles`}
          </p>
        )}
      </div>

      {exams.length === 0 ? (
        <p className="rounded-panel border border-dashed border-sand-300 px-6 py-12 text-center text-sand-500">
          {emptyMessage}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam, index) => {
            const questionCount = exam.questions.length;

            return (
              <Link
                key={exam.id}
                to={`/exam/${exam.id}`}
                className="group rounded-panel border border-sand-200 bg-surface p-6 transition hover:-translate-y-1 hover:border-accent/40"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-small text-sand-400">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`rounded-pill px-2.5 py-1 text-caption font-semibold ${variantStyles[exam.variant] ?? variantStyles.Reposición}`}
                  >
                    {exam.variant}
                  </span>
                </div>

                <h3 className="mt-6 font-display text-subheading font-semibold text-ink">
                  {exam.name}
                </h3>

                <p className="mt-6 flex items-center justify-between text-small">
                  <span className="text-sand-500">
                    {questionCount === 0 && 'Solo PDF'}
                    {questionCount === 1 && '1 problema'}
                    {questionCount > 1 && `${questionCount} problemas`}
                  </span>
                  <span className="font-semibold text-accent transition group-hover:translate-x-1">
                    {questionCount === 0 ? 'Descargar →' : 'Practicar →'}
                  </span>
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
