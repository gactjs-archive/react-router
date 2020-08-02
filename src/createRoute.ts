import React, { ReactElement, ReactNode } from "react";

import { ReactStore } from "@gact/react-store";
import { PathFor, StoreValue } from "@gact/store";

import { HistoryState, Location } from "./types";
import { doesPathMatch } from "./utils/doesPathMatch";

export type Props = {
  children: ReactNode;
  path: string | Array<string>;
  switchMatch?: boolean;
};

/**
 * Route enables you to condition renders on the current location.
 */
export type RouteType = React.FunctionComponent<Props>;

/**
 * Creates a `Route` component.
 *
 * @typeParam S - the Gact store state
 * @typeParam HS - the history state
 */
export function createRoute<S extends StoreValue>({ useValue }: ReactStore<S>) {
  return function<HS extends HistoryState>(
    locationPath: PathFor<S, Location<HS>>
  ): RouteType {
    return function Route({
      children,
      path,
      switchMatch,
    }: Props): ReactElement | null {
      const location = useValue(locationPath);

      if (switchMatch || doesPathMatch(location.pathname, path)) {
        return children as ReactElement;
      }

      return null;
    };
  };
}
