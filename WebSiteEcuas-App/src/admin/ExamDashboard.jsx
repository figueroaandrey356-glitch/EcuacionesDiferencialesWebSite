import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteExam, fetchAllExams, saveExam, setExamStatus } from '../data/examsApi';
import { primaryButton, secondaryButton } from './ui';

const statusStyles = {
  published: 'bg-emerald-100 text-emerald-700',
  draft: 'bg-amber-100 text-amber-700',
};

const statusLabels = { published: 'Publicado', draft: 'Borrador' };

const describeContent = exam => {
  const parts = [];
  const count = exam.questions.length;
  if (count > 0) parts.push(count === 1 ? '1 problema' : `${count} problemas`);
  if (exam.pdfPath) parts.push('PDF');
  return parts.join(' + ') || 'Vacío';
};

export default function ExamDashboard() {
  const navigate = useNavigate();
  // null mientras carga
  const [exams, setExams] = useState(null);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  // Cambia después de cada acción para volver a pedir la lista
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetchAllExams()
      .then(loaded => {
        if (!cancelled) setExams(loaded);
      })
      .catch(() => {
        if (cancelled) return;
        setExams([]);
        setError('No se pudieron cargar los exámenes.');
      })
      .finally(() => {
        if (!cancelled) setBusyId(null);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadCount]);

  const runAction = async (exam, action, failureMessage) => {
    setBusyId(exam.id);
    setError('');
    try {
      await action();
      // La fila sigue marcada como ocupada hasta que llega la lista actualizada
      setReloadCount(count => count + 1);
    } catch {
      setError(failureMessage);
      setBusyId(null);
    }
  };

  const handleToggleStatus = exam => {
    const nextStatus = exam.status === 'published' ? 'draft' : 'published';
    runAction(exam, () => setExamStatus(exam.id, nextStatus), 'No se pudo cambiar el estado del examen.');
  };

  const handleDuplicate = async exam => {
    setBusyId(exam.id);
    setError('');
    try {
      // La copia no comparte el PDF: si lo hiciera, borrar un examen dejaría al otro sin archivo
      const copy = await saveExam({ ...exam, id: null, status: 'draft', pdfPath: null });
      navigate(`/admin/examen/${copy.id}`);
    } catch {
      setError('No se pudo duplicar el examen.');
      setBusyId(null);
    }
  };

  const handleDelete = exam => {
    const confirmed = window.confirm(
      `¿Eliminar "${exam.name} - ${exam.variant}" (${exam.year}, ${exam.semester})? Esta acción no se puede deshacer.`
    );
    if (confirmed) {
      runAction(exam, () => deleteExam(exam), 'No se pudo eliminar el examen.');
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Exámenes</h1>
          <p className="mt-1 text-sm text-slate-500">
            Solo los exámenes publicados aparecen en el sitio de estudiantes.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to="/admin/subir" className={secondaryButton}>
            Subir PDF
          </Link>
          <Link to="/admin/nuevo" className={primaryButton}>
            + Crear paso a paso
          </Link>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        {exams === null ? (
          <p className="px-6 py-12 text-center text-slate-500">Cargando exámenes…</p>
        ) : exams.length === 0 ? (
          <p className="px-6 py-12 text-center text-slate-500">
            Aún no hay exámenes. Sube un PDF o crea uno paso a paso para empezar.
          </p>
        ) : (
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-widest text-slate-500">
              <tr>
                <th className="px-6 py-3 font-semibold">Examen</th>
                <th className="px-4 py-3 font-semibold">Periodo</th>
                <th className="px-4 py-3 font-semibold">Contenido</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-6 py-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {exams.map(exam => {
                const busy = busyId === exam.id;

                return (
                  <tr key={exam.id} className={busy ? 'opacity-50' : ''}>
                    <td className="px-6 py-4">
                      <Link
                        to={`/admin/examen/${exam.id}`}
                        className="font-semibold text-ink hover:text-primary"
                      >
                        {exam.name}
                      </Link>
                      <span className="block text-xs text-slate-500">{exam.variant}</span>
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {exam.year} · {exam.semester}
                    </td>
                    <td className="px-4 py-4 text-slate-600">{describeContent(exam)}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[exam.status]}`}
                      >
                        {statusLabels[exam.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-3 whitespace-nowrap font-semibold">
                        <Link to={`/admin/examen/${exam.id}`} className="text-primary hover:underline">
                          Editar
                        </Link>
                        <button
                          disabled={busy}
                          onClick={() => handleToggleStatus(exam)}
                          className="text-slate-600 hover:text-ink hover:underline"
                        >
                          {exam.status === 'published' ? 'Despublicar' : 'Publicar'}
                        </button>
                        <button
                          disabled={busy}
                          onClick={() => handleDuplicate(exam)}
                          className="text-slate-600 hover:text-ink hover:underline"
                        >
                          Duplicar
                        </button>
                        <button
                          disabled={busy}
                          onClick={() => handleDelete(exam)}
                          className="text-red-600 hover:underline"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
