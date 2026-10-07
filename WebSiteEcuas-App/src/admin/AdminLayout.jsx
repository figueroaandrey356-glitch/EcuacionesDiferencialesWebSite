import { Link, NavLink } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const menuItems = [
  { path: '/admin', label: 'Exámenes', hint: 'Ver, editar y publicar', end: true },
  { path: '/admin/subir', label: 'Subir examen (PDF)', hint: 'Solo para descargar' },
  { path: '/admin/nuevo', label: 'Crear paso a paso', hint: 'Enunciados y soluciones' },
];

export default function AdminLayout({ email, children }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-sand-200/70 bg-ink text-white print:hidden">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-3">
          <Link to="/admin" className="flex items-center gap-3">
            <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="" className="h-9 w-9" />
            <span className="leading-tight">
              <span className="block font-display text-subheading font-semibold">Estudiando ED</span>
              <span className="block text-caption text-white/60">Administración</span>
            </span>
          </Link>

          <div className="flex items-center gap-3 text-small">
            <span className="hidden text-white/60 sm:inline">{email}</span>
            <button
              onClick={() => supabase.auth.signOut()}
              className="rounded-control border border-white/25 px-3 py-2 font-medium transition-colors duration-150 hover:bg-white/10"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl items-start gap-8 px-6 py-8 lg:grid-cols-[240px_1fr]">
        <nav
          aria-label="Menú de administración"
          className="rounded-panel border border-sand-200 bg-surface p-3 print:hidden lg:sticky lg:top-24"
        >
          <ul className="space-y-1">
            {menuItems.map(item => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `block rounded-control px-3 py-2.5 transition-colors duration-150 ${
                      isActive ? 'bg-accent/10' : 'hover:bg-sand-100'
                    }`
                  }
                >
                  <span className="block text-small font-semibold text-ink">{item.label}</span>
                  <span className="block text-caption text-sand-500">{item.hint}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mt-3 border-t border-sand-200 pt-3">
            <a
              href={`${import.meta.env.BASE_URL}exams`}
              target="_blank"
              rel="noreferrer"
              className="block rounded-control px-3 py-2.5 text-small font-semibold text-sand-600 transition-colors duration-150 hover:bg-sand-100 hover:text-ink"
            >
              Abrir sitio de estudiantes ↗
            </a>
          </div>
        </nav>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
