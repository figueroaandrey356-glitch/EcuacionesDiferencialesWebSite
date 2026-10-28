export default function Footer() {
  return (
    <footer className="bg-ink text-neutral-300 print:hidden">
      <div className="mx-auto max-w-page px-gutter pb-8 pt-section">
        {/* El sitio ocupa la mitad; curso y profesor se reparten el resto */}
        <div className="grid gap-x-12 gap-y-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="font-display text-heading font-semibold text-white">
              Estudiando ED
            </p>
            <p className="mt-3 max-w-sm text-small text-neutral-300">
              Banco de exámenes anteriores de Ecuaciones Diferenciales del TEC, para ver en línea o
              descargar en PDF.
            </p>
          </div>

          <div className="md:col-span-3">
            <h3 className="font-sans tabular-nums text-label font-medium uppercase text-neutral-300">
              Curso
            </h3>
            <p className="mt-3 text-small font-medium text-white">
              Ecuaciones Diferenciales
            </p>
            <p className="text-small text-neutral-300">
              Instituto Tecnológico de Costa Rica
            </p>
          </div>

          <div className="md:col-span-3">
            <h3 className="font-sans tabular-nums text-label font-medium uppercase text-neutral-300">
              Profesor
            </h3>
            <p className="mt-3 text-small font-medium text-white">
              MSc. Norberto Gerardo Oviedo Ugalde
            </p>
            <a
              href="mailto:noviedo@itcr.ac.cr"
              className="text-small text-neutral-300 underline underline-offset-4 transition-colors duration-150 hover:text-white"
            >
              noviedo@itcr.ac.cr
            </a>
          </div>
        </div>

        <div className="mt-section-sm flex flex-col gap-1 border-t border-white/15 pt-6 text-caption text-neutral-300 sm:flex-row sm:justify-between">
          {/* TODO(copy): confirmar con el TEC si este aviso legal es correcto para el sitio */}
          <p>© 2026 Instituto Tecnológico de Costa Rica. Todos los derechos reservados.</p>
          {/* TODO(copy): texto genérico. Propuesta: "Material de práctica del curso · v1.0", o quitar la línea */}
          <p>Plataforma educativa con fines académicos · v1.0</p>
        </div>
      </div>
    </footer>
  );
}
