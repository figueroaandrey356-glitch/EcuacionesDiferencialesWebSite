import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

function ViewerMessage({ children }) {
  return <p className="py-section-sm text-center text-neutral-500">{children}</p>;
}

// Dibuja todas las páginas del PDF dentro del sitio. Se usa pdf.js en lugar de un <iframe>
// porque los navegadores de celular no muestran PDF incrustados.
export default function PdfViewer({ url, title }) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(null);
  const [numPages, setNumPages] = useState(0);

  // Las páginas se ajustan al ancho disponible, también al girar el celular
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.floor(entry.contentRect.width));
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="mx-auto w-full max-w-reader">
      {width && (
        <Document
          file={url}
          onLoadSuccess={pdf => setNumPages(pdf.numPages)}
          loading={<ViewerMessage>Cargando examen…</ViewerMessage>}
          error={<ViewerMessage>No se pudo mostrar el PDF. Puedes descargarlo con el botón de arriba.</ViewerMessage>}
          className="space-y-4"
        >
          {Array.from({ length: numPages }, (_, index) => (
            <Page
              key={index}
              pageNumber={index + 1}
              width={width}
              loading={null}
              className="overflow-hidden bg-white shadow-raised"
              aria-label={`${title}, página ${index + 1} de ${numPages}`}
            />
          ))}
        </Document>
      )}
    </div>
  );
}
