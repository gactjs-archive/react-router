import React, { CSSProperties, forwardRef, useCallback, useMemo } from "react";

import { GactHistory, Location } from "@gact/history";
import { ReactStore } from "@gact/react-store";
import { PathFor, StoreValue } from "@gact/store";

import { HistoryState } from "./types";

type Props<HS extends HistoryState = HistoryState> = {
  href: string;
  state?: HS;
  replace?: boolean;
  children: React.ReactNode;
  activeClassName?: string;
  activeStyle?: CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
} & React.AnchorHTMLAttributes<HTMLAnchorElement> &
  React.HTMLAttributes<HTMLAnchorElement> &
  React.RefAttributes<HTMLAnchorElement>;

/**
 * Provides declarative navigation.
 *
 * @typeParam HS - the history state
 */
export type LinkType<
  HS extends HistoryState = HistoryState
> = React.FunctionComponent<Props<HS>>;

function isModifiedEvent(event: React.MouseEvent<HTMLElement>): boolean {
  return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
}

/**
 * Creates a `Link` component.
 *
 * @typeParam S - the Gact store state
 * @typeParam HS - the history state
 */
export function createLink<S extends StoreValue>({
  useValue,
  path,
}: ReactStore<S>) {
  return function<HS extends HistoryState = HistoryState>(
    locationPath: PathFor<S, Location<HS>>,
    history: GactHistory<HS>
  ): LinkType<HS> {
    return forwardRef<HTMLAnchorElement, Props<HS>>(function Link(
      {
        children,
        href,
        state,
        className,
        style = {},
        activeClassName,
        activeStyle = {},
        replace = false,
        onClick,
        ...rest
      },
      ref
    ) {
      const pathname = useMemo(
        () =>
          new URL(
            href,
            href.startsWith("/") ? window.location.origin : undefined
          ).pathname,
        [href]
      );
      const isActive = useValue(
        path(locationPath, "pathname"),
        (currentPathname) => currentPathname === pathname
      );
      const finalClassName = useMemo(
        () =>
          isActive
            ? [className, activeClassName].filter((c) => c).join(" ")
            : className,
        [className, activeClassName, isActive]
      );
      const finalStyle = isActive ? { ...style, ...activeStyle } : style;

      const navigate = useCallback(
        function() {
          const method = replace ? history.replace : history.push;

          method(href, state);
        },
        [href, replace, state]
      );

      function handleClick(event: React.MouseEvent<HTMLAnchorElement>): void {
        try {
          if (onClick) {
            onClick(event);
          }
        } catch (err) {
          // ensure we don't navigate away on error from provided onClick
          event.preventDefault();
          throw err;
        }

        if (
          !event.defaultPrevented && // onClick prevented default
          event.button === 0 && // ignore everything but left clicks
          (!rest.target || rest.target === "_self") && // let browser handle "target=_blank" etc.
          !isModifiedEvent(event) // ignore clicks with modifier keys
        ) {
          event.preventDefault();
          navigate();
        }
      }

      return (
        <a
          ref={ref}
          href={href}
          onClick={handleClick}
          className={finalClassName}
          style={finalStyle}
          {...rest}
        >
          {children}
        </a>
      );
    });
  };
}
