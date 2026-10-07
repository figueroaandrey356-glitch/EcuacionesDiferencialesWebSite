import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { inputClass, labelClass, primaryButton } from './ui';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async event => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError('Correo o contraseña incorrectos.');
      setSubmitting(false);
    }
    // Si el inicio de sesión funciona, AdminApp detecta la sesión y muestra el panel
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="" className="h-12 w-12" />
        <h1 className="mt-4 font-display text-2xl font-semibold text-ink">
          Administración
        </h1>
        <p className="mt-1 text-sm text-slate-500">Estudiando ED · acceso restringido</p>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="admin-email" className={labelClass}>
              Correo
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={event => setEmail(event.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="admin-password" className={labelClass}>
              Contraseña
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={event => setPassword(event.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting} className={`mt-6 w-full ${primaryButton}`}>
          {submitting ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}
