import { YEARS } from '../data/examOptions';

export default function YearSelector({ selectedYear, onSelectYear }) {
  const years = YEARS;

  return (
    <div>
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
        Año
      </h2>

      <div className="inline-flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">
        {years.map(year => (
          <button
            key={year}
            onClick={() => onSelectYear(year)}
            aria-pressed={selectedYear === year}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              selectedYear === year
                ? 'bg-white text-ink shadow-sm'
                : 'text-slate-500 hover:text-ink'
            }`}
          >
            {year}
          </button>
        ))}
      </div>
    </div>
  );
}
