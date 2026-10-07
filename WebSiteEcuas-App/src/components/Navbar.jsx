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
    <nav className="sticky top-0 z-50 border-b border-sand-200 bg-paper print:hidden">
      <div className="mx-auto flex max-w-page items-center justify-between px-gutter py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={`${import.meta.env.BASE_URL}logo.svg`}
            alt=""
            className="h-10 w-10"
          />
          <span className="leading-tight">
            <span className="block font-display text-subheading font-semibold text-ink">
              Estudiando ED
            </span>
            <span className="block text-caption text-sand-500">
              Ecuaciones Diferenciales · TEC
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {showBack && (
            <Link
              to={backPath}
              className="mr-1 rounded-control border border-sand-300 px-3 py-2 text-small font-medium text-sand-600 transition-colors duration-150 hover:border-sand-400 hover:bg-sand-100 hover:text-ink sm:px-4"
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
                `rounded-control px-3 py-2 text-small font-medium transition-colors duration-150 sm:px-4 ${
                  isActive
                    ? 'bg-ink text-white'
                    : 'text-sand-600 hover:bg-sand-100 hover:text-ink'
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
