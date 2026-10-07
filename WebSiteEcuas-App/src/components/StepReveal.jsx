import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MathText from './MathText';

export default function StepReveal({ steps, fullSolution }) {
  const [revealedSteps, setRevealedSteps] = useState(0);
  const [showFullSolution, setShowFullSolution] = useState(false);

  const hasSteps = steps.length > 0;
  const allRevealed = revealedSteps >= steps.length;

  const handleRevealNext = () => {
    if (!allRevealed) {
      setRevealedSteps(revealedSteps + 1);
    }
  };

  const handleHideLast = () => {
    if (revealedSteps > 0) {
      setRevealedSteps(revealedSteps - 1);
    }
  };

  const handleReset = () => {
    setRevealedSteps(0);
  };

  const toggleFullSolution = () => {
    setShowFullSolution(!showFullSolution);
  };

  return (
    <div className="mt-6">
      {/* Progreso */}
      <div className={`mb-5 items-center gap-3 ${hasSteps ? 'flex' : 'hidden'}`}>
        <div className="h-1.5 grow overflow-hidden rounded-pill bg-sand-100">
          <motion.div
            className="h-full rounded-pill bg-accent"
            initial={false}
            animate={{ width: `${hasSteps ? (revealedSteps / steps.length) * 100 : 0}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="shrink-0 text-caption font-medium tabular-nums text-sand-500">
          {revealedSteps} de {steps.length} pasos
        </span>
      </div>

      {/* Pasos Revelados */}
      {!hasSteps ? null : revealedSteps === 0 ? (
        <p className="rounded-control border border-dashed border-sand-300 px-5 py-6 text-center text-small text-sand-500">
          Intenta resolverlo primero. Cuando quieras, revela la solución paso a paso.
        </p>
      ) : (
        <ol className="space-y-1">
          <AnimatePresence initial={false}>
            {steps.slice(0, revealedSteps).map((step, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-pill bg-accent/10 text-caption font-bold text-accent">
                    {index + 1}
                  </span>
                  {index < revealedSteps - 1 && (
                    <span className="mt-1 w-px grow bg-sand-200" />
                  )}
                </div>
                <p className="max-w-prose pb-4 pt-0.5 text-body text-sand-700">
                  <MathText text={step} />
                </p>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
      )}

      {/* Acciones */}
      <div className="mt-5 flex flex-wrap items-center gap-2 print:hidden">
        {revealedSteps > 0 && (
          <button
            onClick={handleHideLast}
            className="rounded-control border border-sand-300 px-4 py-2.5 text-small font-semibold text-sand-600 transition hover:border-sand-400 hover:bg-sand-100 hover:text-ink"
          >
            ← Paso anterior
          </button>
        )}

        {!hasSteps ? null : allRevealed ? (
          <button
            onClick={handleReset}
            className="rounded-control bg-sand-100 px-4 py-2.5 text-small font-semibold text-ink transition hover:bg-sand-200"
          >
            ↺ Ocultar pasos
          </button>
        ) : (
          <button
            onClick={handleRevealNext}
            className="rounded-control bg-accent px-4 py-2.5 text-small font-semibold text-white transition hover:bg-accent-dark"
          >
            Revelar siguiente paso →
          </button>
        )}

        {fullSolution && (
          <button
            onClick={toggleFullSolution}
            aria-expanded={showFullSolution}
            className="rounded-control px-4 py-2.5 text-small font-semibold text-success transition hover:bg-success-soft sm:ml-auto"
          >
            {showFullSolution ? 'Ocultar' : 'Ver'} solución completa
          </button>
        )}
      </div>

      {/* Solución Completa */}
      <AnimatePresence initial={false}>
        {showFullSolution && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-control bg-success-soft p-5 ring-1 ring-success/25">
              <h4 className="mb-2 font-mono text-label font-medium uppercase text-success">
                Solución completa
              </h4>
              <p className="max-w-prose whitespace-pre-line text-body text-sand-700">
                <MathText text={fullSolution} />
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
