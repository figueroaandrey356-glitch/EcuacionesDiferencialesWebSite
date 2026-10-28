import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ExamView from '../components/ExamView';
import MathLoader from '../components/MathLoader';
import { DUPLICATE_KEY, findDuplicateExam, getPdfUrl, PDF_FIELDS, saveExam } from '../data/examsApi';
import { EXAM_NAMES, SEMESTERS, VARIANTS, YEARS } from '../data/examOptions';
import PdfField from './PdfField';
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

const pickPdfPaths = exam => Object.fromEntries(PDF_FIELDS.map(field => [field, exam[field]]));

export default function ExamEditor({ initialExam }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [exam, setExam] = useState(initialExam);
  // PDF elegidos pero aún sin subir, por campo (pdfPath, solutionPdfPath): { file, url } con una
  // URL local para la vista previa
  const [pendingPdfs, setPendingPdfs] = useState({});
  // PDF que el examen tiene guardados, para borrarlos si se reemplazan o se quitan
  const [savedPaths, setSavedPaths] = useState(() => pickPdfPaths(initialExam));
  const [view, setView] = useState('edit');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(location.state?.notice ?? null);
  // Examen que ya tiene el mismo año, semestre, nombre y tipo; null si la combinación está libre
  const [duplicate, setDuplicate] = useState(null);

  const isNew = exam.id === null;
  const urlFor = field => pendingPdfs[field]?.url ?? getPdfUrl(exam[field]);
  const pdfUrl = urlFor('pdfPath');
  const solutionPdfUrl = urlFor('solutionPdfPath');

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

  const clearPendingPdf = field => {
    if (pendingPdfs[field]) URL.revokeObjectURL(pendingPdfs[field].url);
    setPendingPdfs(current => ({ ...current, [field]: null }));
  };

  const acceptPdf = (field, file) => {
    if (file.type !== 'application/pdf') {
      setNotice({ type: 'error', text: 'El archivo debe ser un PDF.' });
      return;
    }
    if (file.size > MAX_PDF_BYTES) {
      setNotice({ type: 'error', text: 'El PDF no puede pesar más de 20 MB.' });
      return;
    }

    clearPendingPdf(field);
    setPendingPdfs(current => ({ ...current, [field]: { file, url: URL.createObjectURL(file) } }));
    setNotice(null);
  };

  const removePdf = field => {
    clearPendingPdf(field);
    updateExam({ [field]: null });
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

      const files = Object.fromEntries(PDF_FIELDS.map(field => [field, pendingPdfs[field]?.file ?? null]));
      const saved = await saveExam({ ...exam, status }, { files, previousPaths: savedPaths });
      const savedNotice = {
        type: 'success',
        text:
          status === 'published'
            ? 'Examen publicado. Ya está disponible para el estudiantado.'
            : 'Borrador guardado. Aún no es visible para el estudiantado.',
      };

      PDF_FIELDS.forEach(clearPendingPdf);
      if (isNew) {
        // La pantalla de edición vuelve a cargar el examen ya con su id
        navigate(`/admin/examen/${saved.id}`, { replace: true, state: { notice: savedNotice } });
        return;
      }

      setExam(saved);
      setSavedPaths(pickPdfPaths(saved));
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
          <p className="mb-6 font-sans tabular-nums text-label font-medium uppercase text-neutral-500">
            Así lo verá el estudiante
          </p>
          <ExamView exam={exam} pdfUrl={pdfUrl} solutionPdfUrl={solutionPdfUrl} />
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

          {/* Los dos PDF: el enunciado es obligatorio para publicar, la solución es opcional */}
          <PdfField
            title="PDF del examen (sin solución)"
            description="Se muestra en la página del examen y el estudiante puede descargarlo. Es obligatorio para publicar."
            url={pdfUrl}
            pendingName={pendingPdfs.pdfPath?.file.name}
            onFile={file => acceptPdf('pdfPath', file)}
            onRemove={() => removePdf('pdfPath')}
            onError={text => setNotice({ type: 'error', text })}
          />
          <PdfField
            title="PDF con solución"
            description="Opcional. Si lo subes, el estudiante puede cambiar a la versión con solución."
            url={solutionPdfUrl}
            pendingName={pendingPdfs.solutionPdfPath?.file.name}
            onFile={file => acceptPdf('solutionPdfPath', file)}
            onRemove={() => removePdf('solutionPdfPath')}
            onError={text => setNotice({ type: 'error', text })}
          />
        </div>
      )}

      {/* Guardar */}
      <div className="sticky bottom-0 mt-8 flex flex-wrap items-center justify-end gap-2 border-t border-neutral-200 bg-paper/95 py-4 backdrop-blur">
        {saving && (
          <MathLoader
            size="sm"
            label={PDF_FIELDS.some(field => pendingPdfs[field]) ? 'Subiendo PDF…' : 'Guardando…'}
            className="mr-auto"
          />
        )}
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
