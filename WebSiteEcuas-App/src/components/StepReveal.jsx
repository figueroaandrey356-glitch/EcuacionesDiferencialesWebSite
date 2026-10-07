import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import MathText from './MathText';

export default function StepReveal({ steps, fullSolution }) {
  const [revealedSteps, setRevealedSteps] = useState(0);
  const [showFullSolution, setShowFullSolution] = useState(false);

  // Sin animación para quien pidió movimiento reducido en su sistema
  const duration = useReducedMotion() ? 0 : 0.18;

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
        <div className="h-1 grow overflow-hidden rounded-pill bg-neutral-200">
          <motion.div
            className="h-full rounded-pill bg-crimson"
            initial={false}
            animate={{ width: `${hasSteps ? (revealedSteps / steps.length) * 100 : 0}%` }}
            transition={{ duration }}
          />
        </div>
        <span className="shrink-0 font-mono text-caption tabular-nums text-neutral-500">
          {revealedSteps} de {steps.length} pasos
        </span>
      </div>

      {/* Pasos Revelados */}
      {!hasSteps ? null : revealedSteps === 0 ? (
        <p className="text-small text-neutral-600">
          Intenta resolverlo primero. Cuando quieras, revela la solución paso a paso.
        </p>
      ) : (
        <ol className="space-y-1">
          <AnimatePresence initial={false}>
            {steps.slice(0, revealedSteps).map((step, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration }}
                className="flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-pill border border-neutral-300 font-mono text-caption text-neutral-600">
                    {index + 1}
                  </span>
                  {index < revealedSteps - 1 && (
                    <span className="mt-1 w-px grow bg-neutral-200" />
                  )}
                </div>
                <p className="min-w-0 max-w-prose grow pb-4 pt-0.5 text-body text-neutral-700">
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
            className="rounded-control border border-neutral-300 px-4 py-2.5 text-small font-semibold text-neutral-600 transition-colors duration-150 hover:border-neutral-400 hover:bg-neutral-100 hover:text-ink"
          >
            <span aria-hidden="true">← </span>Paso anterior
          </button>
        )}

        {!hasSteps ? null : allRevealed ? (
          <button
            onClick={handleReset}
            className="rounded-control bg-neutral-100 px-4 py-2.5 text-small font-semibold text-ink transition-colors duration-150 hover:bg-neutral-200"
          >
            <span aria-hidden="true">↺ </span>Ocultar pasos
          </button>
        ) : (
          <button
            onClick={handleRevealNext}
            className="rounded-control bg-accent px-4 py-2.5 text-small font-semibold text-white transition-colors duration-150 hover:bg-accent-dark"
          >
            Revelar siguiente paso<span aria-hidden="true"> →</span>
          </button>
        )}

        {fullSolution && (
          <button
            onClick={toggleFullSolution}
            aria-expanded={showFullSolution}
            className="rounded-control px-4 py-2.5 text-small font-semibold text-ink underline underline-offset-4 transition-colors duration-150 hover:bg-neutral-100 sm:ml-auto"
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
            transition={{ duration }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-panel bg-neutral-100 p-5 sm:p-6">
              <h4 className="mb-3 font-mono text-label font-medium uppercase text-neutral-600">
                Solución completa
              </h4>
              <p className="max-w-prose whitespace-pre-line text-body text-neutral-700">
                <MathText text={fullSolution} />
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
