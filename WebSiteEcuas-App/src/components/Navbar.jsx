import { Link, NavLink, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Inicio', end: true },
  { path: '/exams', label: 'Exámenes' },
];

export default function Navbar() {
  const { pathname } = useLocation();

  // "Volver" sube un nivel: examen → lista de exámenes → inicio
  const backPath = pathname.startsWith('/exam/') ? '/exams' : '/';
  const showBack = pathname !== '/';

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-md print:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={`${import.meta.env.BASE_URL}logo.svg`}
            alt=""
            className="h-10 w-10"
          />
          <span className="leading-tight">
            <span className="block font-display text-lg font-semibold text-ink">
              Estudiando ED
            </span>
            <span className="block text-xs text-slate-500">
              Ecuaciones Diferenciales · TEC
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {showBack && (
            <Link
              to={backPath}
              className="mr-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:bg-slate-100 hover:text-ink sm:px-4"
            >
              ← Volver
            </Link>
          )}
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition sm:px-4 ${
                  isActive
                    ? 'bg-ink text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-ink'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
