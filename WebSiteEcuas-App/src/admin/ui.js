// Clases compartidas por las pantallas de administración
export const inputClass =
  'w-full rounded-control border border-sand-300 bg-surface px-3 py-2 text-sm text-ink placeholder:text-sand-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20';

export const labelClass =
  'mb-1.5 block text-xs font-semibold uppercase tracking-widest text-sand-500';

export const primaryButton =
  'rounded-control bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50';

export const secondaryButton =
  'rounded-control border border-sand-300 bg-surface px-4 py-2.5 text-sm font-semibold text-sand-600 transition hover:border-sand-400 hover:bg-sand-100 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50';

export const addButton =
  'rounded-control border border-dashed border-accent/50 px-3 py-2 text-sm font-semibold text-accent transition hover:border-accent hover:bg-accent/5';

const iconButtonBase =
  'flex h-8 w-8 shrink-0 items-center justify-center rounded-control text-sand-500 transition disabled:cursor-not-allowed disabled:opacity-30';

export const iconButton = `${iconButtonBase} hover:bg-sand-100 hover:text-ink`;

export const dangerIconButton = `${iconButtonBase} hover:bg-danger-soft hover:text-danger`;

export const cardClass = 'rounded-panel border border-sand-200 bg-surface p-6';
