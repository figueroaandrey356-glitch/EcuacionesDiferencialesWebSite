// Clases compartidas por las pantallas de administración
export const inputClass =
  'w-full rounded-control border border-neutral-300 bg-surface px-3 py-2 text-small text-ink placeholder:text-neutral-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20';

export const labelClass =
  'mb-1.5 block font-sans text-label font-medium uppercase text-neutral-500';

export const primaryButton =
  'rounded-control bg-accent px-4 py-2.5 text-small font-semibold text-white transition-colors duration-150 hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50';

export const secondaryButton =
  'rounded-control border border-neutral-300 bg-surface px-4 py-2.5 text-small font-semibold text-neutral-600 transition-colors duration-150 hover:border-neutral-400 hover:bg-neutral-100 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50';

const iconButtonBase =
  'flex h-8 w-8 shrink-0 items-center justify-center rounded-control text-neutral-500 transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-30';

export const iconButton = `${iconButtonBase} hover:bg-neutral-100 hover:text-ink`;

export const dangerIconButton = `${iconButtonBase} hover:bg-danger-soft hover:text-danger`;

export const cardClass = 'rounded-panel border border-neutral-200 bg-surface p-6';
