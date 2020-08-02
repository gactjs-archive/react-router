import * as history from "@gact/history";

import { HistoryState } from "./types";

/**
 * Creates a `GactHistory`.
 *
 * @remarks
 * Enforces that history state is compatible with the Gact store.
 */
export function createHistory<
  HS extends HistoryState = HistoryState
>(): history.GactHistory<HS> {
  return history.createHistory();
}
