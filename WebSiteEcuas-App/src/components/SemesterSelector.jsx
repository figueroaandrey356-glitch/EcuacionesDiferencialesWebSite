import { SEMESTERS } from '../data/examOptions';

export default function SemesterSelector({ selectedSemester, onSelectSemester }) {
  const semesters = SEMESTERS;

  return (
    <div>
      <h2 className="mb-2 font-sans tabular-nums text-label font-medium uppercase text-neutral-500">
        Semestre
      </h2>

      <div className="inline-flex flex-wrap gap-1 rounded-control bg-neutral-100 p-1">
        {semesters.map(sem => (
          <button
            key={sem.id}
            onClick={() => onSelectSemester(sem.id)}
            aria-pressed={selectedSemester === sem.id}
            className={`rounded-control px-4 py-2 text-small font-semibold transition-colors duration-150 ${
              selectedSemester === sem.id
                ? 'bg-accent text-white'
                : 'text-neutral-500 hover:text-ink'
            }`}
          >
            {sem.label}
          </button>
        ))}
      </div>
    </div>
  );
}
