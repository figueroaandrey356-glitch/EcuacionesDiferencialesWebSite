import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import PdfPlaceholder from './PdfPlaceholder';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

// Separación entre páginas en px (space-y-4)
const PAGE_GAP = 16;

function ViewerMessage({ children }) {
  return <p className="py-section-sm text-center text-neutral-500">{children}</p>;
}

// Dibuja todas las páginas del PDF dentro del sitio. Se usa pdf.js en lugar de un <iframe>
// porque los navegadores de celular no muestran PDF incrustados.
export default function PdfViewer({ url, title }) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [pagesDrawn, setPagesDrawn] = useState(0);

  // Las páginas se ajustan al ancho disponible, también al girar el celular
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.floor(entry.contentRect.width));
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const pageHeight = (width * 11) / 8.5;
  const reservedHeight = Math.max(numPages, 1) * pageHeight + Math.max(numPages - 1, 0) * PAGE_GAP;

  return (
    <div
      ref={containerRef}
      className="mx-auto w-full max-w-reader"
      // Las páginas aparecen una tras otra y empujaban hacia abajo lo que sigue al visor; se reserva
      // el alto de todas (hojas carta y el espacio entre ellas) hasta que la última esté dibujada
      style={width && pagesDrawn < Math.max(numPages, 1) ? { minHeight: reservedHeight } : undefined}
    >
      {!width && <PdfPlaceholder />}
      {width && (
        <Document
          file={url}
          // Sin Suspense react-pdf usa loading y error; con él, un PDF dañado tumbaba toda la página
          suspense={false}
          onLoadSuccess={pdf => setNumPages(pdf.numPages)}
          loading={<PdfPlaceholder />}
          error={<ViewerMessage>No se pudo mostrar el PDF. Puedes descargarlo con el botón de arriba.</ViewerMessage>}
          className="space-y-4"
        >
          {/* Entre que el archivo carga y se sabe cuántas páginas tiene */}
          {numPages === 0 && <PdfPlaceholder />}
          {Array.from({ length: numPages }, (_, index) => (
            <Page
              key={index}
              pageNumber={index + 1}
              width={width}
              // La primera página tarda en dibujarse; las demás aparecen debajo a medida que están
              loading={index === 0 ? <PdfPlaceholder /> : null}
              onRenderSuccess={() => setPagesDrawn(count => count + 1)}
              className="overflow-hidden bg-white shadow-raised"
              aria-label={`${title}, página ${index + 1} de ${numPages}`}
            />
          ))}
        </Document>
      )}
    </div>
  );
}
