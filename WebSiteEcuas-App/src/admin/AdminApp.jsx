import { useEffect, useState } from 'react';
import { Link, Route, Routes, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { checkIsAdmin, fetchExam } from '../data/examsApi';
import AdminLayout from './AdminLayout';
import AdminLogin from './AdminLogin';
import ExamDashboard from './ExamDashboard';
import ExamEditor from './ExamEditor';
import { createEmptyExam, createEmptyQuestion } from './examDraft';
import { secondaryButton } from './ui';

function CenteredMessage({ title, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="max-w-md text-center">
        {title && <h1 className="font-display text-heading font-semibold text-ink">{title}</h1>}
        <div className="mt-3 text-neutral-600">{children}</div>
      </div>
    </div>
  );
}

function EditExamPage() {
  const { examId } = useParams();
  const [result, setResult] = useState({ examId: null, exam: null });

  useEffect(() => {
    let cancelled = false;

    fetchExam(examId)
      .catch(() => null)
      .then(exam => {
        if (!cancelled) setResult({ examId, exam });
      });

    return () => {
      cancelled = true;
    };
  }, [examId]);

  if (result.examId !== examId) {
    return <p className="py-12 text-center text-neutral-500">Cargando examen…</p>;
  }

  if (!result.exam) {
    return (
      <div className="py-12 text-center">
        <p className="text-neutral-600">No se encontró ese examen.</p>
        <Link to="/admin" className={`mt-6 inline-block ${secondaryButton}`}>
          ← Volver a exámenes
        </Link>
      </div>
    );
  }

  // key: al cambiar de examen el formulario se reinicia con los datos nuevos
  return <ExamEditor key={examId} initialExam={result.exam} />;
}

export default function AdminApp() {
  // undefined mientras Supabase resuelve si hay una sesión guardada
  const [session, setSession] = useState(undefined);
  // userId identifica a qué cuenta pertenece la respuesta
  const [adminCheck, setAdminCheck] = useState({ userId: null, isAdmin: false });

  useEffect(() => {
    if (!supabase) return undefined;

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id ?? null;

  useEffect(() => {
    if (!userId) return undefined;
    let cancelled = false;

    checkIsAdmin(userId)
      .catch(() => false)
      .then(isAdmin => {
        if (!cancelled) setAdminCheck({ userId, isAdmin });
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (!supabase) {
    return (
      <CenteredMessage title="Falta configurar la base de datos">
        <p>
          Crea el archivo <code className="font-mono text-ink">.env.local</code> con las claves de
          Supabase (hay una plantilla en <code className="font-mono text-ink">.env.example</code>) y
          reinicia el servidor.
        </p>
      </CenteredMessage>
    );
  }

  if (session === undefined || (userId && adminCheck.userId !== userId)) {
    return <CenteredMessage>Cargando…</CenteredMessage>;
  }

  if (!session) return <AdminLogin />;

  if (!adminCheck.isAdmin) {
    return (
      <CenteredMessage title="Sin permisos de administración">
        <p>La cuenta {session.user.email} no está autorizada para administrar exámenes.</p>
        <button onClick={() => supabase.auth.signOut()} className={`mt-6 ${secondaryButton}`}>
          Cerrar sesión
        </button>
      </CenteredMessage>
    );
  }

  return (
    <AdminLayout email={session.user.email}>
      <Routes>
        <Route index element={<ExamDashboard />} />
        <Route
          path="subir"
          element={<ExamEditor key="subir" initialExam={createEmptyExam()} pdfOnly />}
        />
        <Route
          path="nuevo"
          element={
            <ExamEditor
              key="nuevo"
              initialExam={{ ...createEmptyExam(), questions: [createEmptyQuestion()] }}
            />
          }
        />
        <Route path="examen/:examId" element={<EditExamPage />} />
      </Routes>
    </AdminLayout>
  );
}
