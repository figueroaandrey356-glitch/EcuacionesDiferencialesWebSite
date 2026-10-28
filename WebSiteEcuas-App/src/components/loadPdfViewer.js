// pdf.js pesa bastante: solo se descarga al abrir un examen. La página del examen lo pide
// mientras carga los datos, en lugar de esperar a tenerlos
export const loadPdfViewer = () => import('./PdfViewer');
