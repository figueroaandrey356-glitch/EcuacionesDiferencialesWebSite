import StepReveal from './StepReveal';
import MathText from './MathText';

export default function QuestionCard({ questionNumber, question }) {
  return (
    <article
      id={`problema-${questionNumber}`}
      data-question-number={questionNumber}
      className="scroll-mt-24 break-inside-avoid rounded-panel border border-sand-200 bg-surface p-6 sm:p-8"
    >
      <header className="mb-5 flex flex-wrap items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-pill bg-ink font-display text-small font-semibold text-white">
          {questionNumber}
        </span>
        <h3 className="font-display text-subheading font-semibold text-ink">
          Problema {questionNumber}
        </h3>
        {question.topic && (
          <span className="rounded-pill bg-accent/10 px-2.5 py-1 text-caption font-semibold text-accent sm:ml-auto">
            {question.topic}
          </span>
        )}
      </header>

      <div className="rounded-control bg-sand-50 px-5 py-4 ring-1 ring-sand-200/70">
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
