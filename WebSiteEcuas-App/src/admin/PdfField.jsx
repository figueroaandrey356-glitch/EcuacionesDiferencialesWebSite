import { useState } from 'react';
import { cardClass, secondaryButton } from './ui';

const MAX_PDF_BYTES = 20 * 1024 * 1024;

// Devuelve el motivo por el que el archivo no se acepta, o null si es un PDF válido.
// Además del nombre se revisa el contenido: todo PDF empieza con "%PDF-", así un archivo
// renombrado a .pdf no pasa.
async function checkPdf(file) {
  if (!file.name.toLowerCase().endsWith('.pdf')) return 'Solo se pueden subir archivos PDF.';
  if (file.size > MAX_PDF_BYTES) return 'El PDF no puede pesar más de 20 MB.';
  const header = await file.slice(0, 5).text();
  if (header !== '%PDF-') return 'El archivo no es un PDF válido aunque termine en .pdf.';
  return null;
}

// Un PDF del examen: se puede elegir con el botón o arrastrar desde el explorador de archivos.
// url: el PDF actual (guardado o pendiente); pendingName: nombre del archivo que se subirá al guardar.
export default function PdfField({ title, description, url, pendingName, onFile, onRemove }) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState(null);

  const acceptFiles = async files => {
    if (files.length === 0) return;
    if (files.length > 1) {
      setError('Suelta un solo PDF en cada zona.');
      return;
    }

    const problem = await checkPdf(files[0]);
    setError(problem);
    if (!problem) onFile(files[0]);
  };

  const handleSelect = event => {
    const files = [...event.target.files];
    // Permite volver a elegir el mismo archivo después de quitarlo
    event.target.value = '';
    acceptFiles(files);
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
    acceptFiles([...event.dataTransfer.files]);
  };

  const handleRemove = () => {
    setError(null);
    onRemove();
  };

  let zoneStyle = 'border-neutral-300 text-neutral-500';
  if (dragging) zoneStyle = 'border-accent text-accent';
  else if (error) zoneStyle = 'border-danger text-danger';

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
        className={`mt-4 rounded-control border-2 border-dashed px-4 py-8 text-center text-small transition-colors duration-150 ${zoneStyle}`}
      >
        {dragging
          ? 'Suelta el PDF aquí'
          : `Arrastra el PDF desde el explorador de archivos${url ? ' para reemplazarlo' : ''}, o usa el botón. Solo archivos PDF.`}
      </div>

      {error && (
        <p role="alert" className="mt-3 rounded-control bg-danger-soft px-3 py-2 text-small text-danger">
          {error}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="max-w-full truncate rounded-control border border-success/30 bg-success-soft px-3 py-2 text-small font-semibold text-success transition-colors duration-150 hover:border-success"
          >
            <span aria-hidden="true">✓ </span>
            {pendingName ? `${pendingName} · se subirá al guardar` : 'Ver PDF actual ↗'}
          </a>
        )}

        <label className={`${secondaryButton} cursor-pointer`}>
          {url ? 'Reemplazar PDF' : 'Elegir PDF'}
          <input type="file" accept=".pdf,application/pdf" onChange={handleSelect} className="sr-only" />
        </label>

        {url && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-small font-semibold text-neutral-500 transition-colors duration-150 hover:text-danger"
          >
            Quitar PDF
          </button>
        )}
      </div>
    </section>
  );
}
