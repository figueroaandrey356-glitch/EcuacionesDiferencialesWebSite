import StepReveal from './StepReveal';
import MathText from './MathText';

export default function QuestionCard({ questionNumber, question }) {
  return (
    <article
      id={`problema-${questionNumber}`}
      data-question-number={questionNumber}
      className="scroll-mt-24 break-inside-avoid border-t border-ink pb-section-sm pt-6"
    >
      <header className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="font-display text-heading font-semibold text-ink">
          Problema {questionNumber}
        </h3>
        {question.topic && (
          <span className="font-mono text-label font-medium uppercase text-neutral-500">
            {question.topic}
          </span>
        )}
      </header>

      {/* El enunciado es el único bloque con fondo: es lo que se lee primero */}
      <div className="rounded-panel border border-neutral-200 bg-surface px-5 py-5 sm:px-6">
        <p className="max-w-prose whitespace-pre-line text-body text-ink">
          <MathText text={question.statement} />
        </p>
      </div>

      {(question.steps.length > 0 || question.fullSolution) && (
        <StepReveal
          steps={question.steps}
          fullSolution={question.fullSolution}
        />
      )}
    </article>
  );
}
