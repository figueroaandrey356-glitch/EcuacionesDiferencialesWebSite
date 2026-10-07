import { SEMESTERS } from '../data/examOptions';

export default function SemesterSelector({ selectedSemester, onSelectSemester }) {
  const semesters = SEMESTERS;

  return (
    <div>
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-sand-500">
        Semestre
      </h2>

      <div className="inline-flex flex-wrap gap-1 rounded-control bg-sand-100 p-1">
        {semesters.map(sem => (
          <button
            key={sem.id}
            onClick={() => onSelectSemester(sem.id)}
            aria-pressed={selectedSemester === sem.id}
            className={`rounded-control px-4 py-2 text-sm font-semibold transition ${
              selectedSemester === sem.id
                ? 'bg-ink text-paper'
                : 'text-sand-500 hover:text-ink'
            }`}
          >
            {sem.label}
          </button>
        ))}
      </div>
    </div>
  );
}
