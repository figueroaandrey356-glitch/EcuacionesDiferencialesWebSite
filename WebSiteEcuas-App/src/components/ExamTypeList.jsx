import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPublishedExams } from '../data/examsApi';

const variantStyles = {
  Ordinario: 'bg-primary/10 text-primary',
  Extraordinario: 'bg-accent/15 text-amber-700',
  Reposición: 'bg-slate-200/70 text-slate-600',
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
        <h2 className="font-display text-2xl font-semibold text-ink">
          {semester === 'Verano' ? 'Verano' : `Semestre ${semester}`} · {year}
        </h2>
        {!loading && !result.failed && (
          <p className="mt-1 text-sm text-slate-500">
            {exams.length === 1
              ? '1 examen disponible'
              : `${exams.length} exámenes disponibles`}
          </p>
        )}
      </div>

      {exams.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center text-slate-500">
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
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-sm text-slate-400">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${variantStyles[exam.variant] ?? variantStyles.Reposición}`}
                  >
                    {exam.variant}
                  </span>
                </div>

                <h3 className="mt-6 font-display text-xl font-semibold text-ink">
                  {exam.name}
                </h3>

                <p className="mt-6 flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    {questionCount === 0 && 'Solo PDF'}
                    {questionCount === 1 && '1 problema'}
                    {questionCount > 1 && `${questionCount} problemas`}
                  </span>
                  <span className="font-semibold text-primary transition group-hover:translate-x-1">
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
