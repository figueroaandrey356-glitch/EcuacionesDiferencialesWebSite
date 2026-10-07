import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ExamView from '../components/ExamView';
import { fetchExam } from '../data/examsApi';

export default function ExamPractice() {
  const { examId } = useParams();
  // examId identifica a qué examen pertenece el resultado, para no mostrar uno viejo al navegar
  const [result, setResult] = useState({ examId: null, exam: null, failed: false });

  useEffect(() => {
    let cancelled = false;

    fetchExam(examId)
      .then(exam => {
        if (!cancelled) setResult({ examId, exam, failed: false });
      })
      .catch(() => {
        if (!cancelled) setResult({ examId, exam: null, failed: true });
      });

    return () => {
      cancelled = true;
    };
  }, [examId]);

  const loading = result.examId !== examId;
  const { exam, failed } = result;

  if (loading || !exam) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex grow items-center justify-center px-gutter py-section">
          {loading ? (
            <p className="text-neutral-500">Cargando examen…</p>
          ) : (
            <div className="text-center">
              <p aria-hidden="true" className="font-display text-display italic text-neutral-300">∅</p>
              <h1 className="mt-4 font-display text-heading font-semibold text-ink">
                {failed ? 'No se pudo cargar el examen' : 'Examen no encontrado'}
              </h1>
              <p className="mt-2 text-neutral-600">
                {failed
                  ? 'Revisa tu conexión e inténtalo de nuevo.'
                  : 'Lo sentimos, no pudimos encontrar ese examen.'}
              </p>
              <Link
                to="/exams"
                className="mt-8 inline-block rounded-control bg-ink px-6 py-3 font-semibold text-white transition-colors duration-150 hover:bg-accent-dark"
              >
                <span aria-hidden="true">← </span>Volver a exámenes
              </Link>
            </div>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="grow">
        <div className="mx-auto max-w-page px-gutter pb-section pt-section-sm">
          <ExamView exam={exam} />

          <div className="flex border-t border-neutral-300 pt-6 print:hidden">
            <Link
              to="/exams"
              className="font-semibold text-neutral-600 underline-offset-4 transition-colors duration-150 hover:text-ink hover:underline"
            >
              <span aria-hidden="true">← </span>Volver a exámenes
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
