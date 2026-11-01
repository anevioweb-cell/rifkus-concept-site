import { useSyncExternalStore } from 'react';

const noop = () => () => {};

/**
 * false during the server render and hydration, true right after: lets a
 * component add client-only extras without a hydration mismatch and without
 * setState in an effect.
 */
export function useHydrated() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
