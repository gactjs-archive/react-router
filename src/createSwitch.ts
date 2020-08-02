import React, { ReactElement } from "react";

import { Location } from "@gact/history";
import { ReactStore } from "@gact/react-store";
import { PathFor, StoreRecord, StoreValue } from "@gact/store";

import { Props as RouteProps, RouteType } from "./createRoute";
import { doesPathMatch } from "./utils/doesPathMatch";
import { rankPath } from "./utils/rankPath";

type Props = {
  children: Array<ReactElement<RouteProps, RouteType>>;
};

type RankedRoute = {
  index: number;
  child: React.ReactElement;
  path: string;
  rank: number;
};

/**
 * Selects the best match (if any) among a collection of `Route`s.
 */
export type SwitchType = React.FunctionComponent<Props>;

/**
 * Creates a `Switch` component.
 *
 * @typeParam S - the Gact store state
 * @typeParam HS - the history state
 */
export function createSwitch<S extends StoreValue>({
  path,
  useValue,
}: ReactStore<S>) {
  return function<HS extends StoreRecord | null>(
    locationPath: PathFor<S, Location<HS>>,
    Route: RouteType
  ): SwitchType {
    return function Switch({ children }: Props): ReactElement | null {
      const pathname = useValue(path(locationPath, "pathname"));

      const match = React.Children.toArray(children)
        .reduce(function(routes: Array<RankedRoute>, child, index) {
          if (!(React.isValidElement(child) && child.type === Route)) {
            throw Error(
              "Only <Route /> is allowed to be a child of <Switch />"
            );
          }

          const { path: pathProp } = child.props as RouteProps;
          const paths = Array.isArray(pathProp) ? pathProp : [pathProp];

          for (const path of paths) {
            routes.push({ child, index, path, rank: rankPath(path) });
          }

          return routes;
        }, [])
        .sort((a, b) =>
          a.rank < b.rank ? 1 : a.rank > b.rank ? -1 : a.index - b.index
        )
        .find(({ path }) => doesPathMatch(pathname, path));

      if (match) {
        return React.cloneElement(match.child, { switchMatch: true });
      } else {
        return null;
      }
    };
  };
}
