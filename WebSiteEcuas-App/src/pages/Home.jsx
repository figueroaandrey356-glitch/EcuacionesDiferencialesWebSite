import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const features = [
  {
    title: 'Exámenes anteriores',
    text: 'Parciales ordinarios, extraordinarios y de reposición desde 2023, organizados por año y semestre.',
  },
  {
    title: 'Léelo en el sitio',
    text: 'Cada examen se abre aquí mismo, en la computadora o en el celular, sin descargar nada.',
  },
  {
    title: 'Descárgalo en PDF',
    text: 'Guárdalo o imprímelo para resolverlo por tu cuenta.',
  },
];

// Fila de ejemplo para la tarjeta decorativa del hero
const previewExam = { period: '2025 · Semestre II', name: 'Primer Parcial', variant: 'Ordinario' };

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="grow">
        {/* Hero oscuro: título a la izquierda, problema de ejemplo anclado abajo a la derecha */}
        <section className="relative overflow-hidden bg-ink text-white">
          <div className="bg-grid absolute inset-0" aria-hidden="true" />
          <div
            className="absolute -top-40 left-1/3 h-130 w-205 -translate-x-1/2 rounded-pill bg-accent/50 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative mx-auto grid max-w-page gap-x-12 gap-y-14 px-gutter pb-section pt-section-sm lg:grid-cols-12 lg:pt-section">
            <div className="lg:col-span-8">
              <h1 className="font-display text-display font-semibold text-white">
                Exámenes de Ecuaciones Diferenciales,{' '}
                <em className="font-normal text-accent-soft">en un solo lugar</em>.
              </h1>

              <p className="mt-8 max-w-prose text-lead text-neutral-300">
                Los parciales de semestres anteriores del curso del TEC, para verlos en línea o
                descargarlos en PDF.
              </p>

              <Link
                to="/exams"
                className="mt-10 inline-flex items-center gap-2 rounded-control bg-crimson px-6 py-3 font-semibold text-white transition-colors duration-150 hover:bg-crimson-dark focus-visible:outline-white"
              >
                Ver exámenes
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            {/* Vista previa decorativa de un examen del banco */}
            <div
              className="rounded-panel bg-paper p-6 text-ink shadow-overlay lg:col-span-4 lg:self-end"
              aria-hidden="true"
            >
              <p className="font-mono text-label font-medium uppercase text-neutral-500">
                {previewExam.period}
              </p>
              <p className="mt-3 font-display text-heading font-semibold">{previewExam.name}</p>
              <p className="text-small text-neutral-600">{previewExam.variant}</p>

              {/* Hoja del examen esbozada con líneas */}
              <div className="mt-5 space-y-2 rounded-control bg-surface p-4">
                <div className="h-2 w-2/3 rounded-pill bg-neutral-300" />
                <div className="h-2 w-full rounded-pill bg-neutral-200" />
                <div className="h-2 w-5/6 rounded-pill bg-neutral-200" />
                <div className="h-2 w-1/2 rounded-pill bg-neutral-200" />
              </div>

              <div className="mt-5 flex gap-5 border-t border-neutral-200 pt-4 text-small font-semibold">
                <span className="text-accent">Ver examen →</span>
                <span className="text-neutral-600">Descargar ↓</span>
              </div>
            </div>
          </div>
        </section>

        {/* Cómo funciona: título en una columna angosta, lista numerada en la ancha */}
        <section className="mx-auto grid max-w-page gap-x-12 gap-y-8 px-gutter py-section lg:grid-cols-12 lg:py-section-lg">
          <h2 className="font-display text-title font-semibold text-ink lg:col-span-4">
            Cómo funciona
          </h2>

          <ol className="border-t-2 border-crimson lg:col-span-8">
            {features.map((feature, index) => (
              <li
                key={feature.title}
                className="grid gap-x-8 gap-y-2 border-b border-neutral-200 py-8 sm:grid-cols-[3rem_1fr]"
              >
                <span className="pt-1.5 font-mono text-small text-neutral-500">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-display text-heading font-semibold text-ink">
                    {feature.title}
                  </h3>
                  <p className="mt-2 max-w-prose text-neutral-600">{feature.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <Footer />
    </div>
  );
}
