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
    <nav className="sticky top-0 z-50 border-b border-neutral-200 bg-paper print:hidden">
      <div className="mx-auto flex max-w-page items-center justify-between gap-3 px-gutter py-3">
        {/* Logo */}
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img
            src={`${import.meta.env.BASE_URL}logo.svg`}
            alt=""
            className="h-10 w-10 shrink-0"
          />
          <span className="leading-tight">
            <span className="block whitespace-nowrap font-display text-body font-semibold text-ink sm:text-subheading">
              Estudiando ED
            </span>
            <span className="hidden text-caption text-neutral-500 sm:block">
              Ecuaciones Diferenciales · TEC
            </span>
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-1">
          {showBack && (
            <Link
              to={backPath}
              className="mr-1 hidden rounded-control border border-neutral-300 px-3 py-2 text-small font-medium text-neutral-600 transition-colors duration-150 hover:border-neutral-400 hover:bg-neutral-100 hover:text-ink sm:block sm:px-4"
            >
              <span aria-hidden="true">← </span>Volver
            </Link>
          )}
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `rounded-control px-2.5 py-2 text-small font-medium transition-colors duration-150 sm:px-4 ${
                  isActive
                    ? 'bg-accent text-white'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-ink'
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
