import { YEARS } from '../data/examOptions';

export default function YearSelector({ selectedYear, onSelectYear }) {
  const years = YEARS;

  return (
    <div>
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-sand-500">
        Año
      </h2>

      <div className="inline-flex flex-wrap gap-1 rounded-control bg-sand-100 p-1">
        {years.map(year => (
          <button
            key={year}
            onClick={() => onSelectYear(year)}
            aria-pressed={selectedYear === year}
            className={`rounded-control px-4 py-2 text-sm font-semibold transition ${
              selectedYear === year
                ? 'bg-ink text-paper'
                : 'text-sand-500 hover:text-ink'
            }`}
          >
            {year}
          </button>
        ))}
      </div>
    </div>
  );
}
