/**
 * Decomposes a path into segments.
 */
export function segmentize(path: string): Array<string> {
  let start = 0;
  let end = path.length;

  if (path.startsWith("/")) {
    start++;
  }

  if (path.endsWith("/")) {
    end--;
  }

  return path.slice(start, end).split("/");
}
