/** ids used to wire label, hint and error to a control. */
export function fieldIds(id) {
  return { hint: `${id}-hint`, error: `${id}-error` };
}

/** aria-describedby value for a control (hint first, then error). */
export function describedBy(id, { hint, error }) {
  const ids = fieldIds(id);
  return [hint && ids.hint, error && ids.error].filter(Boolean).join(' ') || undefined;
}

/**
 * Shared control classes: the reference's underline field on dark (no box,
 * 1 px bottom border, transparent). Error state: a 2 px light-red underline.
 */
export const controlClass = (error) =>
  [
    'w-full border-b bg-transparent text-body text-white placeholder:text-smoke',
    'transition-colors duration-(--duration-link) ease-snap hover:border-white focus:border-white disabled:cursor-not-allowed disabled:opacity-60',
    error ? 'border-b-2 border-error-on-dark' : 'border-smoke',
  ].join(' ');
