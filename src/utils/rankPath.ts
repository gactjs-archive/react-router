import { segmentize } from "./segmentize";

enum SegmentPoints {
  Root = 1,
  Wildcard = -1,
  Dynamic = 2,
  Static = 3,
  Any = 4,
}

/**
 * Ranks the provided path.
 *
 * @remarks
 * - The rank is used by <Switch /> to select a <Route />.
 *
 * - The rank algorithm is borrowed from the {@link https://github.com/reach/router | Reach Router}.
 */
export function rankPath(path: string): number {
  let score = 0;

  for (const segment of segmentize(path)) {
    score += SegmentPoints.Any;
    if (segment === "") {
      score += SegmentPoints.Root;
    } else if (segment === "*") {
      score += SegmentPoints.Dynamic;
    } else if (segment === "**") {
      score += SegmentPoints.Wildcard;
    } else {
      score += SegmentPoints.Static;
    }
  }

  return score;
}
