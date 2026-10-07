// Clases compartidas por las pantallas de administración
export const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-ink placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';

export const labelClass =
  'mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-500';

export const primaryButton =
  'rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50';

export const secondaryButton =
  'rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-slate-100 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50';

export const addButton =
  'rounded-lg border border-dashed border-primary/50 px-3 py-2 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary/5';

const iconButtonBase =
  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition disabled:cursor-not-allowed disabled:opacity-30';

export const iconButton = `${iconButtonBase} hover:bg-slate-100 hover:text-ink`;

export const dangerIconButton = `${iconButtonBase} hover:bg-red-50 hover:text-red-600`;

export const cardClass = 'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm';
