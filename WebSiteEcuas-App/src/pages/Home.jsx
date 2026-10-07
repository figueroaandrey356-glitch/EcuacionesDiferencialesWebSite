import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MathText from '../components/MathText';

const features = [
  {
    title: 'Exámenes anteriores',
    text: 'Parciales ordinarios, extraordinarios y de reposición, organizados por año y semestre.',
  },
  {
    title: 'Solución paso a paso',
    text: 'Revela un paso a la vez y comprueba tu avance antes de ver el siguiente.',
  },
  {
    // TODO(copy): título genérico. Propuesta: 'Intenta primero'
    title: 'A tu ritmo',
    text: 'Intenta cada problema primero y consulta solo lo que necesites para destrabarte.',
  },
];

// TODO(contenido): problema de relleno. Reemplazar por uno tomado de un examen real del curso.
const previewStatement = '$\\dfrac{dy}{dx} + 2y = 0, \\quad y(0) = 3$';

const previewSteps = [
  'Separamos variables: $\\frac{dy}{y} = -2\\,dx$',
  'Integramos: $\\ln|y| = -2x + C_1$',
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="grow">
        {/* Hero: título a la izquierda, problema de ejemplo anclado abajo a la derecha */}
        <section className="border-b border-sand-200">
          <div className="mx-auto grid max-w-page gap-x-12 gap-y-14 px-gutter pb-section pt-section-sm lg:grid-cols-12 lg:pt-section">
            <div className="lg:col-span-8">
              <h1 className="font-display text-display font-semibold text-ink">
                Ecuaciones diferenciales,{' '}
                <em className="font-normal text-accent">paso a paso</em>.
              </h1>

              {/* TODO(copy): texto genérico. Propuesta: "Exámenes parciales de Ecuaciones Diferenciales del TEC,
                  resueltos paso a paso. Intenta cada problema y revela solo el paso que te falta." */}
              <p className="mt-8 max-w-prose text-lead text-sand-600">
                Practica con exámenes de semestres anteriores y revela la
                solución gradualmente, a tu ritmo.
              </p>

              <Link
                to="/exams"
                className="mt-10 inline-flex items-center gap-2 rounded-control bg-accent px-6 py-3 font-semibold text-white transition-colors duration-150 hover:bg-accent-dark"
              >
                {/* TODO(copy): botón genérico. Propuesta: "Ver exámenes" */}
                Comenzar a practicar
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            {/* Vista previa decorativa de un problema */}
            <div
              className="rounded-panel border border-sand-300 bg-surface p-6 lg:col-span-4 lg:self-end"
              aria-hidden="true"
            >
              <p className="font-mono text-label font-medium uppercase text-sand-500">
                Problema de ejemplo
              </p>
              <p className="mt-4 text-body text-ink">
                <MathText text={previewStatement} />
              </p>

              <ol className="mt-6 space-y-3 border-t border-sand-200 pt-5">
                {previewSteps.map((step, index) => (
                  <li key={index} className="flex gap-3 text-small text-sand-700">
                    <span className="font-mono text-sand-500">{index + 1}</span>
                    <span>
                      <MathText text={step} />
                    </span>
                  </li>
                ))}
                <li className="flex gap-3 text-small text-sand-500">
                  <span className="font-mono">3</span>
                  <span>Paso oculto</span>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* Cómo funciona: título en una columna angosta, lista numerada en la ancha */}
        <section className="mx-auto grid max-w-page gap-x-12 gap-y-8 px-gutter py-section lg:grid-cols-12 lg:py-section-lg">
          <h2 className="font-display text-title font-semibold text-ink lg:col-span-4">
            Cómo funciona
          </h2>

          <ol className="border-t border-ink lg:col-span-8">
            {features.map((feature, index) => (
              <li
                key={feature.title}
                className="grid gap-x-8 gap-y-2 border-b border-sand-200 py-8 sm:grid-cols-[3rem_1fr]"
              >
                <span className="pt-1.5 font-mono text-small text-sand-500">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-display text-heading font-semibold text-ink">
                    {feature.title}
                  </h3>
                  <p className="mt-2 max-w-prose text-sand-600">{feature.text}</p>
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
