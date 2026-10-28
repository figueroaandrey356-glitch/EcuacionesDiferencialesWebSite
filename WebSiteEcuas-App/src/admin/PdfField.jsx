import { useState } from 'react';
import { cardClass, secondaryButton } from './ui';

// Un PDF del examen: se puede elegir con el botón o arrastrar desde el explorador de archivos.
// url: el PDF actual (guardado o pendiente); pendingName: nombre del archivo que se subirá al guardar.
export default function PdfField({ title, description, url, pendingName, onFile, onRemove, onError }) {
  const [dragging, setDragging] = useState(false);

  const handleSelect = event => {
    const file = event.target.files[0];
    // Permite volver a elegir el mismo archivo después de quitarlo
    event.target.value = '';
    if (file) onFile(file);
  };

  const handleDragOver = event => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    setDragging(true);
  };

  const handleDragLeave = event => {
    // Pasar por encima de un elemento hijo también dispara dragleave
    if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false);
  };

  const handleDrop = event => {
    event.preventDefault();
    setDragging(false);
    const files = event.dataTransfer.files;
    if (files.length > 1) {
      onError('Suelta un solo PDF en cada zona.');
      return;
    }
    if (files.length === 1) onFile(files[0]);
  };

  return (
    <section
      className={`${cardClass} transition-colors duration-150 ${dragging ? 'border-accent bg-accent/5' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h2 className="font-display text-subheading font-semibold text-ink">{title}</h2>
      <p className="mt-1 text-small text-neutral-500">{description}</p>

      <div
        className={`mt-4 rounded-control border-2 border-dashed px-4 py-8 text-center text-small transition-colors duration-150 ${
          dragging ? 'border-accent text-accent' : 'border-neutral-300 text-neutral-500'
        }`}
      >
        {dragging
          ? 'Suelta el PDF aquí'
          : `Arrastra el PDF desde el explorador de archivos${url ? ' para reemplazarlo' : ''}, o usa el botón.`}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="max-w-full truncate rounded-control bg-neutral-100 px-3 py-2 text-small font-semibold text-ink hover:text-accent"
          >
            {pendingName ? `${pendingName} · se subirá al guardar` : 'Ver PDF actual ↗'}
          </a>
        )}

        <label className={`${secondaryButton} cursor-pointer`}>
          {url ? 'Reemplazar PDF' : 'Elegir PDF'}
          <input type="file" accept="application/pdf" onChange={handleSelect} className="sr-only" />
        </label>

        {url && (
          <button
            type="button"
            onClick={onRemove}
            className="text-small font-semibold text-neutral-500 transition-colors duration-150 hover:text-danger"
          >
            Quitar PDF
          </button>
        )}
      </div>
    </section>
  );
}
