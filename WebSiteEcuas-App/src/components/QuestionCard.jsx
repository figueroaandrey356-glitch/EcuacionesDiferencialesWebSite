import StepReveal from './StepReveal';
import MathText from './MathText';

export default function QuestionCard({ questionNumber, question }) {
  return (
    <article
      id={`problema-${questionNumber}`}
      data-question-number={questionNumber}
      className="scroll-mt-24 break-inside-avoid rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <header className="mb-5 flex flex-wrap items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink font-display text-sm font-semibold text-white">
          {questionNumber}
        </span>
        <h3 className="font-display text-xl font-semibold text-ink">
          Problema {questionNumber}
        </h3>
        {question.topic && (
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary sm:ml-auto">
            {question.topic}
          </span>
        )}
      </header>

      <div className="rounded-xl bg-slate-50 px-5 py-4 ring-1 ring-slate-200/70">
        <p className="whitespace-pre-line font-mono text-[15px] leading-relaxed text-ink">
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
