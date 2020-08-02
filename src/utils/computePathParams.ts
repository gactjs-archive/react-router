import { PathParams } from "../types";
import { doesPathMatch } from "./doesPathMatch";
import { segmentize } from "./segmentize";

/**
 * Extracts path parameters from the provided pathname if the pathname matches
 * the path.
 *
 * The path is like a regular path expect that wildcards `*` are replaced by `:<parameterIdentifer>`
 */
export function computePathParams(pathname: string, path: string): PathParams {
  const pathSegments = segmentize(path);
  const pathToMatch =
    "/" +
    pathSegments
      .map((segment) => (segment.startsWith(":") ? "*" : segment))
      .join("/");

  const params: PathParams = {};

  if (doesPathMatch(pathname, pathToMatch)) {
    const pathnameSegments = segmentize(pathname);

    for (const [index, segment] of pathSegments.entries()) {
      if (segment.startsWith(":")) {
        params[segment.slice(1)] = pathnameSegments[index];
      }
    }
  } else {
    for (const segment of pathSegments) {
      if (segment.startsWith(":")) {
        params[segment.slice(1)] = null;
      }
    }
  }

  return params;
}
