import { ReactStore } from "@gact/react-store";
import { PathFor, StoreValue } from "@gact/store";

import { HistoryState, Location } from "./types";

/**
 * Provides the current URLSearchParams.
 */
export type UseSearchParams = () => URLSearchParams;

/**
 * Creates a `useSearchParams` hook.
 *
 * @typeParam S - the Gact store state
 * @typeParam HS - the history state
 */
export function createUseSearchParams<S extends StoreValue>({
  path,
  useValue,
}: ReactStore<S>) {
  return function<HS extends HistoryState = HistoryState>(
    locationPath: PathFor<S, Location<HS>>
  ): UseSearchParams {
    return function useSearchParams(): URLSearchParams {
      return new URLSearchParams(useValue(path(locationPath, "search")));
    };
  };
}
