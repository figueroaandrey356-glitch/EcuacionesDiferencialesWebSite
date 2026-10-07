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
    document
      .getElementById(questionAnchor(questionNumber))
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      aria-label="Índice del examen"
      className="rounded-panel border border-sand-200 bg-surface p-4 print:hidden lg:sticky lg:top-24"
    >
      <h2 className="mb-3 px-2 text-xs font-semibold uppercase tracking-widest text-sand-500">
        Índice del examen
      </h2>

      <ol className="space-y-1">
        {questions.map((question, index) => {
          const questionNumber = index + 1;
          const isActive = activeNumber === questionNumber;

          return (
            <li key={question.id}>
              <button
                onClick={() => handleGoTo(questionNumber)}
                aria-current={isActive ? 'true' : undefined}
                className={`flex w-full items-start gap-3 rounded-control px-2 py-2 text-left transition ${
                  isActive ? 'bg-accent/10' : 'hover:bg-sand-100'
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-pill text-xs font-bold ${
                    isActive ? 'bg-accent text-white' : 'bg-sand-100 text-sand-500'
                  }`}
                >
                  {questionNumber}
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-semibold text-ink">
                    Pregunta {questionNumber}
                  </span>
                  {question.topic && (
                    <span className="block text-xs text-sand-500">
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
