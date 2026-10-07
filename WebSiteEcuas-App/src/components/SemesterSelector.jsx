import { SEMESTERS } from '../data/examOptions';

export default function SemesterSelector({ selectedSemester, onSelectSemester }) {
  const semesters = SEMESTERS;

  return (
    <div>
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
        Semestre
      </h2>

      <div className="inline-flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">
        {semesters.map(sem => (
          <button
            key={sem.id}
            onClick={() => onSelectSemester(sem.id)}
            aria-pressed={selectedSemester === sem.id}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              selectedSemester === sem.id
                ? 'bg-white text-ink shadow-sm'
                : 'text-slate-500 hover:text-ink'
            }`}
          >
            {sem.label}
          </button>
        ))}
      </div>
    </div>
  );
}
