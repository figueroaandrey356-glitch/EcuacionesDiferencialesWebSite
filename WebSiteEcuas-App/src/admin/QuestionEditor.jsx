import MathText from '../components/MathText';
import { addButton, cardClass, dangerIconButton, iconButton, inputClass, labelClass } from './ui';

// Muestra cómo quedará el texto solo cuando tiene fórmulas; el texto simple se ve igual que en el campo
function MathPreview({ text }) {
  if (!text.includes('$')) return null;

  return (
    <p className="mt-2 whitespace-pre-line rounded-lg bg-slate-50 px-3 py-2 font-mono text-sm leading-relaxed text-ink ring-1 ring-slate-200/70">
      <MathText text={text} />
    </p>
  );
}

function RemovableField({ id, label, onRemove, children }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className={labelClass}>
          {label}
        </label>
        <button
          type="button"
          onClick={onRemove}
          className="mb-1.5 text-xs font-semibold text-slate-400 transition hover:text-red-600"
        >
          Quitar
        </button>
      </div>
      {children}
    </div>
  );
}

// Los campos opcionales valen null hasta que se agregan con su botón
export default function QuestionEditor({ question, number, isFirst, isLast, onChange, onMove, onRemove }) {
  const fieldId = name => `problema-${question.id}-${name}`;

  const updateStep = (index, value) => {
    onChange({ steps: question.steps.map((step, i) => (i === index ? value : step)) });
  };

  const moveStep = (index, offset) => {
    const steps = [...question.steps];
    [steps[index], steps[index + offset]] = [steps[index + offset], steps[index]];
    onChange({ steps });
  };

  const removeStep = index => {
    onChange({ steps: question.steps.filter((_, i) => i !== index) });
  };

  return (
    <article className={cardClass}>
      <header className="mb-5 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink font-display text-sm font-semibold text-white">
          {number}
        </span>
        <h3 className="font-display text-xl font-semibold text-ink">Problema {number}</h3>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            disabled={isFirst}
            onClick={() => onMove(-1)}
            aria-label={`Subir problema ${number}`}
            className={iconButton}
          >
            ↑
          </button>
          <button
            type="button"
            disabled={isLast}
            onClick={() => onMove(1)}
            aria-label={`Bajar problema ${number}`}
            className={iconButton}
          >
            ↓
          </button>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Eliminar problema ${number}`}
            className={dangerIconButton}
          >
            ✕
          </button>
        </div>
      </header>

      <div className="space-y-5">
        {question.topic !== null && (
          <RemovableField
            id={fieldId('titulo')}
            label="Título del enunciado"
            onRemove={() => onChange({ topic: null })}
          >
            <input
              id={fieldId('titulo')}
              type="text"
              value={question.topic}
              onChange={event => onChange({ topic: event.target.value })}
              placeholder="Ej.: Variables separables"
              className={inputClass}
            />
          </RemovableField>
        )}

        {question.statement !== null && (
          <RemovableField
            id={fieldId('enunciado')}
            label="Enunciado"
            onRemove={() => onChange({ statement: null })}
          >
            <textarea
              id={fieldId('enunciado')}
              rows={4}
              value={question.statement}
              onChange={event => onChange({ statement: event.target.value })}
              placeholder={'Pega aquí el enunciado. Ej.: Resuelva la ecuación $\\frac{dy}{dx} = 2x$'}
              className={`${inputClass} font-mono`}
            />
            <MathPreview text={question.statement} />
          </RemovableField>
        )}

        {question.steps.length > 0 && (
          <div>
            <p className={labelClass}>Solución paso a paso</p>
            <ol className="space-y-3">
              {question.steps.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="mt-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {index + 1}
                  </span>

                  <div className="min-w-0 grow">
                    <textarea
                      rows={2}
                      value={step}
                      onChange={event => updateStep(index, event.target.value)}
                      aria-label={`Paso ${index + 1} del problema ${number}`}
                      placeholder={`Paso ${index + 1}`}
                      className={`${inputClass} font-mono`}
                    />
                    <MathPreview text={step} />
                  </div>

                  <div className="flex shrink-0 flex-col sm:flex-row">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveStep(index, -1)}
                      aria-label={`Subir paso ${index + 1}`}
                      className={iconButton}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      disabled={index === question.steps.length - 1}
                      onClick={() => moveStep(index, 1)}
                      aria-label={`Bajar paso ${index + 1}`}
                      className={iconButton}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      aria-label={`Eliminar paso ${index + 1}`}
                      className={dangerIconButton}
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {question.fullSolution !== null && (
          <RemovableField
            id={fieldId('solucion')}
            label="Solución completa"
            onRemove={() => onChange({ fullSolution: null })}
          >
            <textarea
              id={fieldId('solucion')}
              rows={5}
              value={question.fullSolution}
              onChange={event => onChange({ fullSolution: event.target.value })}
              placeholder="Resumen de toda la solución, para quien quiera verla de una vez"
              className={`${inputClass} font-mono`}
            />
            <MathPreview text={question.fullSolution} />
          </RemovableField>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-200 pt-5">
        {question.topic === null && (
          <button type="button" onClick={() => onChange({ topic: '' })} className={addButton}>
            + Agregar título del enunciado
          </button>
        )}
        {question.statement === null && (
          <button type="button" onClick={() => onChange({ statement: '' })} className={addButton}>
            + Agregar enunciado
          </button>
        )}
        <button
          type="button"
          onClick={() => onChange({ steps: [...question.steps, ''] })}
          className={addButton}
        >
          + Agregar paso a solución
        </button>
        {question.fullSolution === null && (
          <button type="button" onClick={() => onChange({ fullSolution: '' })} className={addButton}>
            + Agregar solución completa
          </button>
        )}
      </div>
    </article>
  );
}
