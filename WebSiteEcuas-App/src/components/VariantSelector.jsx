import { VARIANTS } from '../data/examOptions';

export default function VariantSelector({ selectedVariant, onSelectVariant }) {
  const variants = ['Todos', ...VARIANTS];

  return (
    <div>
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
        Tipo
      </h2>

      <div className="inline-flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">
        {variants.map(variant => (
          <button
            key={variant}
            onClick={() => onSelectVariant(variant)}
            aria-pressed={selectedVariant === variant}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              selectedVariant === variant
                ? 'bg-white text-ink shadow-sm'
                : 'text-slate-500 hover:text-ink'
            }`}
          >
            {variant}
          </button>
        ))}
      </div>
    </div>
  );
}
