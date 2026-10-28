import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ExamView from '../components/ExamView';
import { loadPdfViewer } from '../components/loadPdfViewer';
import PdfPlaceholder from '../components/PdfPlaceholder';
import { fetchExam } from '../data/examsApi';

export default function ExamPage() {
  const { examId } = useParams();
  // examId identifica a qué examen pertenece el resultado, para no mostrar uno viejo al navegar
  const [result, setResult] = useState({ examId: null, exam: null, failed: false });

  useEffect(() => {
    loadPdfViewer();
  }, []);

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

  if (loading) {
    // Misma forma que el examen ya cargado, para que nada salte cuando llegan los datos
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="grow">
          <div key="esqueleto" aria-busy="true" className="mx-auto max-w-page px-gutter pb-section pt-section-sm">
            <div className="mb-section-sm">
              <div className="h-3 w-48 rounded-control bg-neutral-200" />
              <div className="mt-4 h-10 w-72 max-w-full rounded-control bg-neutral-200" />
            </div>
            <div className="-mx-gutter bg-surface px-3 py-6 sm:mx-0 sm:rounded-panel sm:p-8">
              <PdfPlaceholder />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex grow items-center justify-center px-gutter py-section">
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
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="grow">
        {/* key distinta a la del esqueleto: React no reutiliza sus nodos y nada se mueve al llegar los datos */}
        <div key={exam.id} className="mx-auto max-w-page px-gutter pb-section pt-section-sm">
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
