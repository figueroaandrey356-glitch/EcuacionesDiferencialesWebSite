import { YEARS } from '../data/examOptions';

export default function YearSelector({ selectedYear, onSelectYear }) {
  const years = YEARS;

  return (
    <div>
      <h2 className="mb-2 font-sans tabular-nums text-label font-medium uppercase text-neutral-500">
        Año
      </h2>

      <div className="inline-flex flex-wrap gap-1 rounded-control bg-neutral-100 p-1">
        {years.map(year => (
          <button
            key={year}
            onClick={() => onSelectYear(year)}
            aria-pressed={selectedYear === year}
            className={`rounded-control px-4 py-2 text-small font-semibold transition-colors duration-150 ${
              selectedYear === year
                ? 'bg-accent text-white'
                : 'text-neutral-500 hover:text-ink'
            }`}
          >
            {year}
          </button>
        ))}
      </div>
    </div>
  );
}
