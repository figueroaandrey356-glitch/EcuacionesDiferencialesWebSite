// Indicador de carga: un signo de integral que se dibuja y se borra en bucle.
// Con movimiento reducido queda quieto y completo.
export default function MathLoader({ label = 'Cargando…', size = 'md', className = '' }) {
  // sm va en línea junto a otros controles; md se centra sola en su espacio
  const small = size === 'sm';

  return (
    <div role="status" className={`flex items-center ${small ? 'flex-row gap-2' : 'flex-col gap-3'} ${className}`}>
      <svg
        viewBox="0 0 40 96"
        aria-hidden="true"
        className={`integral-loader ${small ? 'h-6' : 'h-16'} w-auto text-accent`}
      >
        <path
          d="M33 10 C30 3 20 3 19 14 L17 78 C16 90 7 93 5 85"
          pathLength="1"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
      {label && <span className="text-small text-neutral-500">{label}</span>}
    </div>
  );
}
