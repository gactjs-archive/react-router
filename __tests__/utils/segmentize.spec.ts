import { segmentize } from "../../src/utils/segmentize";

describe("segmentize", function() {
  test("root path", function() {
    expect(segmentize("/")).toStrictEqual([""]);
  });

  test("multi-segment path", function() {
    expect(segmentize("/1/2/3")).toStrictEqual(["1", "2", "3"]);
  });

  test("ignores trailing slash", function() {
    expect(segmentize("//")).toStrictEqual([""]);
  });
});
