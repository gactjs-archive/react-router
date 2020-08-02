import { ReactStore } from "@gact/react-store";
import { PathFor, StoreValue } from "@gact/store";

import { HistoryState, Location, PathParams } from "./types";
import { computePathParams } from "./utils/computePathParams";

/**
 * Enables you to extract values from a path.
 */
export type UsePathParams = (path: string) => PathParams;

/**
 * Creates a `usePathParams` hook.
 *
 * @typeParam S - the Gact store state
 * @typeParam HS - the history state
 */
export function createUsePathParams<S extends StoreValue>({
  useValue,
}: ReactStore<S>) {
  return function<HS extends HistoryState = HistoryState>(
    locationPath: PathFor<S, Location<HS>>
  ): UsePathParams {
    return function UsePathParams(path: string): PathParams {
      const location = useValue(locationPath);

      return computePathParams(location.pathname, path);
    };
  };
}
