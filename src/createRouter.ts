import { GactHistory, Location } from "@gact/history";
import { ReactStore } from "@gact/react-store";
import { PathFor, StoreValue } from "@gact/store";

import { createLink, LinkType } from "./createLink";
import { createRoute, RouteType } from "./createRoute";
import { createSwitch, SwitchType } from "./createSwitch";
import { createUsePathParams, UsePathParams } from "./createUsePathParams";
import { createUseSearchParams, UseSearchParams } from "./createUseSearchParams";
import { HistoryState } from "./types";

/**
 * Provides declarative routing and navigation.
 *
 * @typeParam S - the Gact store state
 * @typeParam HS - the history state
 */
export type Router<HS extends HistoryState = HistoryState> = {
  Route: RouteType;
  Switch: SwitchType;
  Link: LinkType<HS>;
  useSearchParams: UseSearchParams;
  usePathParams: UsePathParams;
};

/**
 * Creates a `Router`.
 *
 * @typeParam S - the Gact store state
 * @typeParam HS - the history state
 */
export function createRouter<
  S extends StoreValue,
  HS extends HistoryState = HistoryState
>(store: ReactStore<S>) {
  return function(
    locationPath: PathFor<S, Location<HS>>,
    history: GactHistory<HS>
  ): Router<HS> {
    /**
     * Sync location with store state.
     * No need to cleanup since this will happen for the app's lifetime.
     */
    history.subscribe(function(location) {
      store.set(locationPath, location);
    });

    const Route = createRoute(store)(locationPath);
    const Switch = createSwitch(store)(locationPath, Route);
    const Link = createLink(store)(locationPath, history);
    const useSearchParams = createUseSearchParams(store)(locationPath);
    const usePathParams = createUsePathParams(store)(locationPath);

    return { Link, Route, Switch, usePathParams, useSearchParams };
  };
}
