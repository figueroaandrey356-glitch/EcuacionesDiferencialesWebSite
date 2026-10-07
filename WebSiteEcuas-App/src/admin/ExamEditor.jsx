import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ExamView from '../components/ExamView';
import QuestionEditor from './QuestionEditor';
import { getPdfUrl, saveExam } from '../data/examsApi';
import { EXAM_NAMES, SEMESTERS, VARIANTS, YEARS } from '../data/examOptions';
import { createEmptyQuestion, toDraftQuestion, toSavedQuestions } from './examDraft';
import { addButton, cardClass, inputClass, labelClass, primaryButton, secondaryButton } from './ui';

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

// pdfOnly: el formulario abre solo con los datos y el PDF (opción "Subir examen" del menú)
export default function ExamEditor({ initialExam, pdfOnly = false }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [exam, setExam] = useState(() => ({
    ...initialExam,
    questions: initialExam.questions.map(toDraftQuestion),
  }));
  // PDF elegido pero aún sin subir: { file, url } con una URL local para la vista previa
  const [pendingPdf, setPendingPdf] = useState(null);
  // PDF que el examen tiene guardado, para borrarlo si se reemplaza o se quita
  const [savedPdfPath, setSavedPdfPath] = useState(initialExam.pdfPath);
  const [showQuestions, setShowQuestions] = useState(!pdfOnly || initialExam.questions.length > 0);
  const [view, setView] = useState('edit');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(location.state?.notice ?? null);

  const isNew = exam.id === null;
  const previewExam = { ...exam, questions: toSavedQuestions(exam.questions) };
  const pdfUrl = pendingPdf?.url ?? getPdfUrl(exam.pdfPath);

  const updateExam = changes => setExam(current => ({ ...current, ...changes }));

  const updateQuestions = update =>
    setExam(current => ({ ...current, questions: update(current.questions) }));

  const handleAddQuestion = () => {
    setShowQuestions(true);
    updateQuestions(questions => [...questions, createEmptyQuestion()]);
  };

  const handleChangeQuestion = (id, changes) => {
    updateQuestions(questions => questions.map(q => (q.id === id ? { ...q, ...changes } : q)));
  };

  const handleMoveQuestion = (index, offset) => {
    updateQuestions(current => {
      const questions = [...current];
      [questions[index], questions[index + offset]] = [questions[index + offset], questions[index]];
      return questions;
    });
  };

  const handleRemoveQuestion = (question, number) => {
    const hasContent = toSavedQuestions([question]).length > 0;
    if (hasContent && !window.confirm(`¿Eliminar el problema ${number} con todo su contenido?`)) return;

    updateQuestions(questions => questions.filter(q => q.id !== question.id));
  };

  const clearPendingPdf = () => {
    if (pendingPdf) URL.revokeObjectURL(pendingPdf.url);
    setPendingPdf(null);
  };

  const handleSelectPdf = event => {
    const file = event.target.files[0];
    // Permite volver a elegir el mismo archivo después de quitarlo
    event.target.value = '';
    if (!file) return;

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

  const handleRemovePdf = () => {
    clearPendingPdf();
    updateExam({ pdfPath: null });
  };

  const handleSave = async status => {
    const hasContent = Boolean(pdfUrl) || previewExam.questions.some(q => q.statement);
    if (status === 'published' && !hasContent) {
      setNotice({
        type: 'error',
        text: 'Para publicar, el examen necesita un PDF o al menos un problema con enunciado.',
      });
      return;
    }

    setSaving(true);
    setNotice(null);

    try {
      const saved = await saveExam(
        { ...previewExam, status },
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

      setExam({ ...saved, questions: saved.questions.map(toDraftQuestion) });
      setSavedPdfPath(saved.pdfPath);
      setNotice(savedNotice);
    } catch {
      setNotice({ type: 'error', text: 'No se pudo guardar el examen. Inténtalo de nuevo.' });
    }
    setSaving(false);
  };

  let heading = 'Editar examen';
  if (isNew) heading = pdfOnly ? 'Subir examen (PDF)' : 'Crear examen paso a paso';

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">{heading}</h1>
          <p className="mt-1 text-sm text-slate-500">
            Estado:{' '}
            <span className="font-semibold text-ink">
              {exam.status === 'published' ? 'Publicado' : 'Borrador'}
            </span>
            {isNew && ' · sin guardar'}
          </p>
        </div>

        {/* Editar / Vista estudiante */}
        <div className="inline-flex gap-1 rounded-xl bg-slate-200/70 p-1">
          {[
            { id: 'edit', label: 'Editar' },
            { id: 'preview', label: 'Vista estudiante' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setView(tab.id)}
              aria-pressed={view === tab.id}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                view === tab.id ? 'bg-white text-ink shadow-sm' : 'text-slate-500 hover:text-ink'
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
          className={`mt-6 rounded-lg px-4 py-3 text-sm ${
            notice.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
          }`}
        >
          {notice.text}
        </p>
      )}

      {view === 'preview' ? (
        <div className="mt-6 rounded-2xl border-2 border-dashed border-slate-300 p-4 sm:p-8">
          <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Así lo verá el estudiante
          </p>
          <ExamView exam={previewExam} pdfUrl={pdfUrl} />
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {/* Datos del examen */}
          <section className={cardClass}>
            <h2 className="mb-4 font-display text-xl font-semibold text-ink">Datos del examen</h2>
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
          </section>

          {/* PDF descargable */}
          <section className={cardClass}>
            <h2 className="font-display text-xl font-semibold text-ink">Enunciado en PDF</h2>
            <p className="mt-1 text-sm text-slate-500">
              El estudiante podrá descargar este archivo desde la página del examen.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {pdfUrl && (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="max-w-full truncate rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-ink hover:text-primary"
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
                  className="text-sm font-semibold text-slate-500 transition hover:text-red-600"
                >
                  Quitar PDF
                </button>
              )}
            </div>
          </section>

          {/* Problemas paso a paso */}
          {showQuestions && (
            <section className="space-y-6">
              <div className="rounded-2xl bg-primary/5 px-5 py-4 text-sm text-slate-600 ring-1 ring-primary/15">
                <p className="font-semibold text-ink">Cómo escribir fórmulas</p>
                <p className="mt-1">
                  Pega el texto tal cual y encierra cada fórmula entre signos de dólar con notación
                  LaTeX: <code className="font-mono text-ink">{'$\\frac{dy}{dx} = 2x$'}</code> dentro
                  del texto, o <code className="font-mono text-ink">{'$$\\int 2x\\,dx = x^2 + C$$'}</code>{' '}
                  para una fórmula centrada en su propia línea. Debajo de cada campo verás cómo queda.
                </p>
              </div>

              {exam.questions.map((question, index) => (
                <QuestionEditor
                  key={question.id}
                  question={question}
                  number={index + 1}
                  isFirst={index === 0}
                  isLast={index === exam.questions.length - 1}
                  onChange={changes => handleChangeQuestion(question.id, changes)}
                  onMove={offset => handleMoveQuestion(index, offset)}
                  onRemove={() => handleRemoveQuestion(question, index + 1)}
                />
              ))}
            </section>
          )}

          <button type="button" onClick={handleAddQuestion} className={`w-full ${addButton}`}>
            {showQuestions ? '+ Agregar problema' : '+ Agregar solución paso a paso (opcional)'}
          </button>
        </div>
      )}

      {/* Guardar */}
      <div className="sticky bottom-0 mt-8 flex flex-wrap items-center justify-end gap-2 border-t border-slate-200 bg-paper/95 py-4 backdrop-blur">
        <button
          type="button"
          disabled={saving}
          onClick={() => handleSave('draft')}
          className={secondaryButton}
        >
          {exam.status === 'published' ? 'Guardar y despublicar' : 'Guardar borrador'}
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => handleSave('published')}
          className={primaryButton}
        >
          {saving ? 'Guardando…' : exam.status === 'published' ? 'Guardar cambios' : 'Publicar'}
        </button>
      </div>
    </div>
  );
}
