import { useEffect, useState } from 'react';

// Debe coincidir con el id que QuestionCard le pone a cada problema
const questionAnchor = (questionNumber) => `problema-${questionNumber}`;

export default function ExamIndex({ questions }) {
  const [activeNumber, setActiveNumber] = useState(1);

  // Resalta en el índice el problema que está en pantalla
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.find(entry => entry.isIntersecting);
        if (visible) {
          setActiveNumber(Number(visible.target.dataset.questionNumber));
        }
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    questions.forEach((_, index) => {
      const element = document.getElementById(questionAnchor(index + 1));
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [questions]);

  const handleGoTo = (questionNumber) => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document
      .getElementById(questionAnchor(questionNumber))
      ?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <nav
      aria-label="Índice del examen"
      className="print:hidden lg:sticky lg:top-24"
    >
      <h2 className="mb-3 font-mono text-label font-medium uppercase text-neutral-500">
        Índice del examen
      </h2>

      <ol className="border-l border-neutral-300">
        {questions.map((question, index) => {
          const questionNumber = index + 1;
          const isActive = activeNumber === questionNumber;

          return (
            <li key={question.id}>
              <button
                onClick={() => handleGoTo(questionNumber)}
                aria-current={isActive ? 'true' : undefined}
                className={`-ml-px flex w-full items-baseline gap-3 border-l-2 py-2 pl-4 pr-2 text-left transition-colors duration-150 ${
                  isActive ? 'border-crimson' : 'border-transparent hover:border-neutral-400'
                }`}
              >
                <span
                  className={`font-mono text-caption ${isActive ? 'text-crimson' : 'text-neutral-500'}`}
                >
                  {String(questionNumber).padStart(2, '0')}
                </span>
                <span className="leading-tight">
                  <span className="block text-small font-semibold text-ink">
                    Pregunta {questionNumber}
                  </span>
                  {question.topic && (
                    <span className="block text-caption text-neutral-500">
                      {question.topic}
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
