import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * False during SSR and hydration, true once the client has taken over — without
 * a `setState` in an effect, so there is no second render to wait for.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
