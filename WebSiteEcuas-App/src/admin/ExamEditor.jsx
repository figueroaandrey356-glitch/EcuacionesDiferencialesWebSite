import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ExamView from '../components/ExamView';
import { DUPLICATE_KEY, findDuplicateExam, getPdfUrl, saveExam } from '../data/examsApi';
import { EXAM_NAMES, SEMESTERS, VARIANTS, YEARS } from '../data/examOptions';
import { cardClass, inputClass, labelClass, primaryButton, secondaryButton } from './ui';

const MAX_PDF_BYTES = 20 * 1024 * 1024;

function SelectField({ id, label, value, onChange, options }) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <select id={id} value={value} onChange={event => onChange(event.target.value)} className={inputClass}>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function ExamEditor({ initialExam }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [exam, setExam] = useState(initialExam);
  // PDF elegido pero aún sin subir: { file, url } con una URL local para la vista previa
  const [pendingPdf, setPendingPdf] = useState(null);
  // PDF que el examen tiene guardado, para borrarlo si se reemplaza o se quita
  const [savedPdfPath, setSavedPdfPath] = useState(initialExam.pdfPath);
  const [view, setView] = useState('edit');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(location.state?.notice ?? null);
  // Examen que ya tiene el mismo año, semestre, nombre y tipo; null si la combinación está libre
  const [duplicate, setDuplicate] = useState(null);
  const [draggingPdf, setDraggingPdf] = useState(false);

  const isNew = exam.id === null;
  const pdfUrl = pendingPdf?.url ?? getPdfUrl(exam.pdfPath);

  const updateExam = changes => setExam(current => ({ ...current, ...changes }));

  const { id, year, semester, name, variant } = exam;
  useEffect(() => {
    let cancelled = false;

    findDuplicateExam({ id, year, semester, name, variant })
      // Si la consulta falla, la restricción única de la base de datos sigue impidiendo el duplicado
      .catch(() => null)
      .then(found => {
        if (!cancelled) setDuplicate(found);
      });

    return () => {
      cancelled = true;
    };
  }, [id, year, semester, name, variant]);

  // Un PDF soltado fuera de la zona no debe abrirse en la pestaña y hacer perder lo que no se guardó
  useEffect(() => {
    const preventOpen = event => event.preventDefault();
    window.addEventListener('dragover', preventOpen);
    window.addEventListener('drop', preventOpen);
    return () => {
      window.removeEventListener('dragover', preventOpen);
      window.removeEventListener('drop', preventOpen);
    };
  }, []);

  const clearPendingPdf = () => {
    if (pendingPdf) URL.revokeObjectURL(pendingPdf.url);
    setPendingPdf(null);
  };

  const acceptPdf = file => {
    if (file.type !== 'application/pdf') {
      setNotice({ type: 'error', text: 'El archivo debe ser un PDF.' });
      return;
    }
    if (file.size > MAX_PDF_BYTES) {
      setNotice({ type: 'error', text: 'El PDF no puede pesar más de 20 MB.' });
      return;
    }

    clearPendingPdf();
    setPendingPdf({ file, url: URL.createObjectURL(file) });
    setNotice(null);
  };

  const handleSelectPdf = event => {
    const file = event.target.files[0];
    // Permite volver a elegir el mismo archivo después de quitarlo
    event.target.value = '';
    if (file) acceptPdf(file);
  };

  const handleDragOver = event => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    setDraggingPdf(true);
  };

  const handleDragLeave = event => {
    // Pasar por encima de un elemento hijo también dispara dragleave
    if (!event.currentTarget.contains(event.relatedTarget)) setDraggingPdf(false);
  };

  const handleDrop = event => {
    event.preventDefault();
    setDraggingPdf(false);
    const files = event.dataTransfer.files;
    if (files.length > 1) {
      setNotice({ type: 'error', text: 'Suelta un solo PDF por examen.' });
      return;
    }
    if (files.length === 1) acceptPdf(files[0]);
  };

  const handleRemovePdf = () => {
    clearPendingPdf();
    updateExam({ pdfPath: null });
  };

  const handleSave = async status => {
    if (duplicate) return;
    if (status === 'published' && !pdfUrl) {
      setNotice({ type: 'error', text: 'Para publicar, el examen necesita su PDF.' });
      return;
    }

    setSaving(true);
    setNotice(null);

    try {
      // Revisa de nuevo justo antes de guardar, por si otra persona lo creó mientras tanto
      const found = await findDuplicateExam(exam);
      if (found) {
        setDuplicate(found);
        setSaving(false);
        return;
      }

      const saved = await saveExam(
        { ...exam, status },
        { pdfFile: pendingPdf?.file ?? null, previousPdfPath: savedPdfPath }
      );
      const savedNotice = {
        type: 'success',
        text:
          status === 'published'
            ? 'Examen publicado. Ya está disponible para el estudiantado.'
            : 'Borrador guardado. Aún no es visible para el estudiantado.',
      };

      clearPendingPdf();
      if (isNew) {
        // La pantalla de edición vuelve a cargar el examen ya con su id
        navigate(`/admin/examen/${saved.id}`, { replace: true, state: { notice: savedNotice } });
        return;
      }

      setExam(saved);
      setSavedPdfPath(saved.pdfPath);
      setNotice(savedNotice);
    } catch (error) {
      setNotice({
        type: 'error',
        text:
          error?.code === DUPLICATE_KEY
            ? 'Ya existe un examen con ese año, semestre, nombre y tipo.'
            : 'No se pudo guardar el examen. Inténtalo de nuevo.',
      });
    }
    setSaving(false);
  };

  const heading = isNew ? 'Subir examen' : 'Editar examen';

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-heading font-semibold text-ink">{heading}</h1>
          <p className="mt-1 text-small text-neutral-500">
            Estado:{' '}
            <span className="font-semibold text-ink">
              {exam.status === 'published' ? 'Publicado' : 'Borrador'}
            </span>
            {isNew && ' · sin guardar'}
          </p>
        </div>

        {/* Editar / Vista estudiante */}
        <div className="inline-flex gap-1 rounded-control bg-neutral-200/70 p-1">
          {[
            { id: 'edit', label: 'Editar' },
            { id: 'preview', label: 'Vista estudiante' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setView(tab.id)}
              aria-pressed={view === tab.id}
              className={`rounded-control px-4 py-2 text-small font-semibold transition-colors duration-150 ${
                view === tab.id ? 'bg-accent text-white' : 'text-neutral-500 hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {notice && (
        <p
          role={notice.type === 'error' ? 'alert' : 'status'}
          className={`mt-6 rounded-control px-4 py-3 text-small ${
            notice.type === 'error' ? 'bg-danger-soft text-danger' : 'bg-success-soft text-success'
          }`}
        >
          {notice.text}
        </p>
      )}

      {view === 'preview' ? (
        <div className="mt-6 rounded-panel border-2 border-dashed border-neutral-300 p-4 sm:p-8">
          <p className="mb-6 font-mono text-label font-medium uppercase text-neutral-500">
            Así lo verá el estudiante
          </p>
          <ExamView exam={exam} pdfUrl={pdfUrl} />
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {/* Datos del examen */}
          <section className={cardClass}>
            <h2 className="mb-4 font-display text-subheading font-semibold text-ink">Datos del examen</h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SelectField
                id="examen-anio"
                label="Año"
                value={exam.year}
                onChange={value => updateExam({ year: Number(value) })}
                options={YEARS.map(year => ({ value: year, label: year }))}
              />
              <SelectField
                id="examen-semestre"
                label="Semestre"
                value={exam.semester}
                onChange={value => updateExam({ semester: value })}
                options={SEMESTERS.map(semester => ({ value: semester.id, label: semester.label }))}
              />
              <SelectField
                id="examen-nombre"
                label="Examen"
                value={exam.name}
                onChange={value => updateExam({ name: value })}
                options={EXAM_NAMES.map(name => ({ value: name, label: name }))}
              />
              <SelectField
                id="examen-tipo"
                label="Tipo"
                value={exam.variant}
                onChange={value => updateExam({ variant: value })}
                options={VARIANTS.map(variant => ({ value: variant, label: variant }))}
              />
            </div>

            {duplicate && (
              <p role="alert" className="mt-4 rounded-control bg-danger-soft px-4 py-3 text-small text-danger">
                Ya existe un examen {duplicate.status === 'published' ? 'publicado' : 'en borrador'} con
                estas asignaciones ({duplicate.name} {duplicate.variant},{' '}
                {SEMESTERS.find(option => option.id === duplicate.semester)?.label} {duplicate.year}). Cambia
                algún dato o{' '}
                <Link to={`/admin/examen/${duplicate.id}`} className="font-semibold underline">
                  edita el existente
                </Link>
                .
              </p>
            )}
          </section>

          {/* PDF descargable: se puede elegir o arrastrar desde el explorador de archivos */}
          <section
            className={`${cardClass} transition-colors duration-150 ${
              draggingPdf ? 'border-accent bg-accent/5' : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <h2 className="font-display text-subheading font-semibold text-ink">PDF del examen</h2>
            <p className="mt-1 text-small text-neutral-500">
              Se muestra en la página del examen y el estudiante puede descargarlo.
            </p>

            <div
              className={`mt-4 rounded-control border-2 border-dashed px-4 py-8 text-center text-small transition-colors duration-150 ${
                draggingPdf ? 'border-accent text-accent' : 'border-neutral-300 text-neutral-500'
              }`}
            >
              {draggingPdf
                ? 'Suelta el PDF aquí'
                : `Arrastra el PDF desde el explorador de archivos${pdfUrl ? ' para reemplazarlo' : ''}, o usa el botón.`}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {pdfUrl && (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="max-w-full truncate rounded-control bg-neutral-100 px-3 py-2 text-small font-semibold text-ink hover:text-accent"
                >
                  {pendingPdf ? `${pendingPdf.file.name} · se subirá al guardar` : 'Ver PDF actual ↗'}
                </a>
              )}

              <label className={`${secondaryButton} cursor-pointer`}>
                {pdfUrl ? 'Reemplazar PDF' : 'Elegir PDF'}
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleSelectPdf}
                  className="sr-only"
                />
              </label>

              {pdfUrl && (
                <button
                  type="button"
                  onClick={handleRemovePdf}
                  className="text-small font-semibold text-neutral-500 transition-colors duration-150 hover:text-danger"
                >
                  Quitar PDF
                </button>
              )}
            </div>
          </section>
        </div>
      )}

      {/* Guardar */}
      <div className="sticky bottom-0 mt-8 flex flex-wrap items-center justify-end gap-2 border-t border-neutral-200 bg-paper/95 py-4 backdrop-blur">
        <button
          type="button"
          disabled={saving || Boolean(duplicate)}
          onClick={() => handleSave('draft')}
          className={secondaryButton}
        >
          {exam.status === 'published' ? 'Guardar y despublicar' : 'Guardar borrador'}
        </button>
        <button
          type="button"
          disabled={saving || Boolean(duplicate)}
          onClick={() => handleSave('published')}
          className={primaryButton}
        >
          {saving ? 'Guardando…' : exam.status === 'published' ? 'Guardar cambios' : 'Publicar'}
        </button>
      </div>
    </div>
  );
}
