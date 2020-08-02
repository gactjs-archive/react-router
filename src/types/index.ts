import { Location as HistoryLocation } from "@gact/history";
import { StoreRecord } from "@gact/store";

/**
 * A URL pathname beginning with a / or an array of such pathnames.
 *
 * @remarks
 * - The pathname segments can contain a wildcard (e.g  `/*` describes any
 * path with a single segment).
 *
 * - A pathname is allowed to end with `**`, which declares that all suffixes are
 * acceptable (e.g. `/home/**` describes all paths that start with `/home`).
 *
 * - The path must be absolute (i.e start with a /). The `@gact/react-router` does not
 * deal with relative paths.
 */
export type Path = string | Array<string>;

/**
 * History state that's compatible with the Gact store.
 */
export type HistoryState = StoreRecord | null;

/**
 * An entry in a history stack.
 *
 * @typeParam HS - the history state
 */
export type Location<HS extends HistoryState = HistoryState> = HistoryLocation<
  HS
>;

/**
 * A record of parameters extracted from a pathname.
 */
export type PathParams = Record<string, string | null>;
