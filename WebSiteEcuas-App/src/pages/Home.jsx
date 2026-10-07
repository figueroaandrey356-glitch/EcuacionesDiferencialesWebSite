import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const features = [
  {
    symbol: '∫',
    title: 'Exámenes anteriores',
    text: 'Parciales ordinarios, extraordinarios y de reposición, organizados por año y semestre.',
  },
  {
    symbol: '1→n',
    title: 'Solución paso a paso',
    text: 'Revela un paso a la vez y comprueba tu avance antes de ver el siguiente.',
  },
  {
    symbol: 'y′',
    title: 'A tu ritmo',
    text: 'Intenta cada problema primero y consulta solo lo que necesites para destrabarte.',
  },
];

const previewSteps = [
  'Separamos variables: dy/y = -2 dx',
  'Integramos: ln|y| = -2x + C₁',
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="grow">
        {/* Hero */}
        <section className="relative overflow-hidden bg-ink text-white">
          <div className="bg-grid absolute inset-0" aria-hidden="true" />
          <div
            className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-pill bg-accent/40 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-20 lg:grid-cols-[1.1fr_1fr] lg:py-28">
            <div>
              <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
                Ecuaciones diferenciales,{' '}
                <em className="text-accent-soft">paso a paso</em>.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-sand-300">
                Practica con exámenes de semestres anteriores y revela la
                solución gradualmente, a tu ritmo.
              </p>

              <Link
                to="/exams"
                className="mt-10 inline-flex items-center gap-2 rounded-control bg-surface px-7 py-3.5 font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-sand-100"
              >
                Comenzar a practicar
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            {/* Vista previa decorativa de un problema */}
            <div
              className="rounded-panel bg-surface p-6 text-ink ring-1 ring-white/20 lg:rotate-1"
              aria-hidden="true"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-sand-400">
                Problema de ejemplo
              </p>
              <p className="mt-3 rounded-control bg-sand-50 px-4 py-3 font-mono text-sm ring-1 ring-sand-200/70">
                dy/dx + 2y = 0, &nbsp; y(0) = 3
              </p>

              <ol className="mt-5 space-y-3">
                {previewSteps.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-pill bg-accent/10 text-xs font-bold text-accent">
                      {index + 1}
                    </span>
                    <span className="font-mono text-sm text-sand-700">{step}</span>
                  </li>
                ))}
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-pill bg-sand-100 text-xs font-bold text-sand-400">
                    3
                  </span>
                  <span className="h-5 grow rounded bg-sand-100" />
                </li>
              </ol>

              <div className="mt-5 rounded-control bg-accent px-4 py-2.5 text-center text-sm font-semibold text-white">
                Revelar siguiente paso →
              </div>
            </div>
          </div>
        </section>

        {/* Características */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-6 md:grid-cols-3">
            {features.map(feature => (
              <div
                key={feature.title}
                className="rounded-panel border border-sand-200 bg-surface p-7"
              >
                <span className="inline-flex h-11 min-w-11 items-center justify-center rounded-control bg-accent/10 px-3 font-display text-lg italic text-accent">
                  {feature.symbol}
                </span>
                <h2 className="mt-5 font-display text-xl font-semibold text-ink">
                  {feature.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-sand-600">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
