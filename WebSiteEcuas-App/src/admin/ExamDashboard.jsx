import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteExam, fetchAllExams, setExamStatus } from '../data/examsApi';
import { primaryButton } from './ui';

const statusStyles = {
  published: 'bg-success-soft text-success',
  draft: 'bg-warning-soft text-warning',
};

const statusLabels = { published: 'Publicado', draft: 'Borrador' };

export default function ExamDashboard() {
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
    if (nextStatus === 'published' && !exam.pdfPath) {
      setError(`"${exam.name} - ${exam.variant}" no tiene PDF. Súbelo antes de publicarlo.`);
      return;
    }
    runAction(exam, () => setExamStatus(exam.id, nextStatus), 'No se pudo cambiar el estado del examen.');
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
          <h1 className="font-display text-heading font-semibold text-ink">Exámenes</h1>
          <p className="mt-1 text-small text-neutral-500">
            Solo los exámenes publicados aparecen en el sitio de estudiantes.
          </p>
        </div>

        <Link to="/admin/subir" className={primaryButton}>
          + Subir examen
        </Link>
      </div>

      {error && (
        <p role="alert" className="mt-6 rounded-control bg-danger-soft px-4 py-3 text-small text-danger">
          {error}
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-panel border border-neutral-200 bg-surface">
        {exams === null ? (
          <p className="px-6 py-12 text-center text-neutral-500">Cargando exámenes…</p>
        ) : exams.length === 0 ? (
          <p className="px-6 py-12 text-center text-neutral-500">
            Aún no hay exámenes. Sube el primero con su PDF.
          </p>
        ) : (
          <table className="w-full min-w-[640px] text-left text-small">
            <thead className="border-b border-neutral-200 font-mono text-label uppercase text-neutral-500">
              <tr>
                <th className="px-6 py-3 font-semibold">Examen</th>
                <th className="px-4 py-3 font-semibold">Periodo</th>
                <th className="px-4 py-3 font-semibold">PDF</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-6 py-3 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {exams.map(exam => {
                const busy = busyId === exam.id;

                return (
                  <tr key={exam.id} className={busy ? 'opacity-50' : ''}>
                    <td className="px-6 py-4">
                      <Link
                        to={`/admin/examen/${exam.id}`}
                        className="font-semibold text-ink hover:text-accent"
                      >
                        {exam.name}
                      </Link>
                      <span className="block text-caption text-neutral-500">{exam.variant}</span>
                    </td>
                    <td className="px-4 py-4 text-neutral-600">
                      {exam.year} · {exam.semester}
                    </td>
                    <td className="px-4 py-4 text-neutral-600">
                      {exam.pdfPath ? 'Sí' : <span className="text-danger">Falta</span>}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-pill px-2.5 py-1 text-caption font-semibold ${statusStyles[exam.status]}`}
                      >
                        {statusLabels[exam.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-3 whitespace-nowrap font-semibold">
                        <Link to={`/admin/examen/${exam.id}`} className="text-accent hover:underline">
                          Editar
                        </Link>
                        <button
                          disabled={busy}
                          onClick={() => handleToggleStatus(exam)}
                          className="text-neutral-600 hover:text-ink hover:underline"
                        >
                          {exam.status === 'published' ? 'Despublicar' : 'Publicar'}
                        </button>
                        <button
                          disabled={busy}
                          onClick={() => handleDelete(exam)}
                          className="text-danger hover:underline"
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
