import { Fragment } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// $$...$$ es una fórmula centrada en su propia línea; $...$ va dentro del texto
const MATH_PATTERN = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g;

export default function MathText({ text }) {
  const parts = (text ?? '').split(MATH_PATTERN);

  return parts.map((part, index) => {
    const isBlock = part.length > 4 && part.startsWith('$$') && part.endsWith('$$');
    const isInline = !isBlock && part.length > 2 && part.startsWith('$') && part.endsWith('$');

    if (!isBlock && !isInline) {
      return <Fragment key={index}>{part}</Fragment>;
    }

    const tex = isBlock ? part.slice(2, -2) : part.slice(1, -1);
    // throwOnError: false → una fórmula mal escrita se muestra en rojo en vez de romper la página
    const html = katex.renderToString(tex, { displayMode: isBlock, throwOnError: false });

    return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
  });
}
