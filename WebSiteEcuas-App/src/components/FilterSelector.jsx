// Grupo de botones para filtrar la lista de exámenes; "Todos" quita el filtro
export default function FilterSelector({ title, options, selected, onSelect }) {
  const choices = ['Todos', ...options];

  return (
    <div>
      <h2 className="mb-2 font-sans tabular-nums text-label font-medium uppercase text-neutral-500">
        {title}
      </h2>

      <div className="inline-flex flex-wrap gap-1 rounded-control bg-neutral-100 p-1">
        {choices.map(choice => (
          <button
            key={choice}
            onClick={() => onSelect(choice)}
            aria-pressed={selected === choice}
            className={`rounded-control px-4 py-2 text-small font-semibold transition-colors duration-150 ${
              selected === choice
                ? 'bg-accent text-white'
                : 'text-neutral-500 hover:text-ink'
            }`}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}
