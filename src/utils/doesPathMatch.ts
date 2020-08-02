import { Path } from "../types";
import { segmentize } from "./segmentize";

/**
 * Determines if the provided pathname matches the provided path.
 */
export function doesPathMatch(pathname: string, path: Path): boolean {
  const paths = Array.isArray(path) ? path : [path];
  const allPathnameParts = segmentize(pathname);

  for (const path of paths) {
    const pathParts = segmentize(path);
    let pathnameParts = allPathnameParts;

    if (pathParts[pathParts.length - 1] == "**") {
      pathParts.pop();
      pathnameParts = allPathnameParts.slice(0, pathParts.length);
    }

    // match only possible for paths of the same length
    if (pathParts.length !== pathnameParts.length) {
      continue;
    }

    if (
      pathParts.every(
        (part, i) =>
          (part === "*" && pathnameParts[i].length > 0) ||
          part === pathnameParts[i]
      )
    ) {
      return true;
    }
  }

  return false;
}
