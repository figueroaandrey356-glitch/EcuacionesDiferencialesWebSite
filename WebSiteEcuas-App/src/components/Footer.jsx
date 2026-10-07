export default function Footer() {
  return (
    <footer className="bg-ink text-sand-300 print:hidden">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Sección 1: Sitio */}
          <div>
            <p className="font-display text-subheading font-semibold text-white">
              Estudiando ED
            </p>
            <p className="mt-2 max-w-xs text-small text-sand-400">
              Plataforma interactiva de práctica para estudiantes de
              Ecuaciones Diferenciales.
            </p>
          </div>

          {/* Sección 2: Curso */}
          <div>
            <h3 className="font-mono text-label font-medium uppercase text-sand-500">
              Curso
            </h3>
            <p className="mt-3 text-small font-medium text-white">
              Ecuaciones Diferenciales
            </p>
            <p className="text-small text-sand-400">
              Instituto Tecnológico de Costa Rica
            </p>
          </div>

          {/* Sección 3: Profesor */}
          <div>
            <h3 className="font-mono text-label font-medium uppercase text-sand-500">
              Profesor
            </h3>
            <p className="mt-3 text-small font-medium text-white">
              MSc. Norberto Gerardo Oviedo Ugalde
            </p>
            <a
              href="mailto:noviedo@itcr.ac.cr"
              className="text-small text-sand-400 underline-offset-4 transition hover:text-white hover:underline"
            >
              noviedo@itcr.ac.cr
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-1 border-t border-white/10 pt-6 text-caption text-sand-500 sm:flex-row sm:justify-between">
          <p>© 2026 Instituto Tecnológico de Costa Rica. Todos los derechos reservados.</p>
          <p>Plataforma educativa con fines académicos · v1.0</p>
        </div>
      </div>
    </footer>
  );
}
