import MathLoader from './MathLoader';

// Hoja tamaño carta con el indicador de carga. Ocupa lo mismo que la primera página del PDF,
// así el contenido no salta mientras se cargan los datos, pdf.js, el archivo y la página.
export default function PdfPlaceholder() {
  return (
    <div className="mx-auto flex aspect-[8.5/11] w-full max-w-reader items-center justify-center bg-white shadow-raised">
      <MathLoader label="Cargando examen…" />
    </div>
  );
}
