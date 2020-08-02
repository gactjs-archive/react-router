import { doesPathMatch } from "../../src";

describe("doesPathMatch", function() {
  describe("static paths", function() {
    test("exact paths match", function() {
      expect(doesPathMatch("/", "/")).toBe(true);
      expect(doesPathMatch("/1", "/1")).toBe(true);
      expect(doesPathMatch("/1/2", "/1/2")).toBe(true);
      expect(doesPathMatch("/1/2/3", "/1/2/3")).toBe(true);
    });

    test("does not match if there is a disparity in a segment", function() {
      expect(doesPathMatch("/", "/!")).toBe(false);
      expect(doesPathMatch("/1", "/!1")).toBe(false);
      expect(doesPathMatch("/1/2", "/!1/2")).toBe(false);
      expect(doesPathMatch("/1/2/3", "/!1/2/3")).toBe(false);
    });

    test("does not match if paths are of different lengths", function() {
      expect(doesPathMatch("/1", "/")).toBe(false);
      expect(doesPathMatch("/1/2", "/1")).toBe(false);
      expect(doesPathMatch("/1/2/3", "/1/2")).toBe(false);
    });
  });

  describe("dynamic path", function() {
    test("matches anything for wildcard segments", function() {
      expect(doesPathMatch("/1", "/*")).toBe(true);
      expect(doesPathMatch("/1/2", "/1/*")).toBe(true);
      expect(doesPathMatch("/1/2", "/*/*")).toBe(true);
      expect(doesPathMatch("/1/2/3", "/*/2/3")).toBe(true);
      expect(doesPathMatch("/1/2/3", "/1/*/3")).toBe(true);
      expect(doesPathMatch("/1/2/3", "/1/2/*")).toBe(true);
      expect(doesPathMatch("/1/2/3", "/*/*/*")).toBe(true);
    });

    test("does not match if there is a disparity in a static segment", function() {
      expect(doesPathMatch("/1/2", "/!1/*")).toBe(false);
      expect(doesPathMatch("/1/2/3", "/*/!2/3")).toBe(false);
      expect(doesPathMatch("/1/2/3", "/!1/*/3")).toBe(false);
      expect(doesPathMatch("/1/2/3", "/!1/2/*")).toBe(false);
    });

    test("does not match if paths are of different lengths", function() {
      expect(doesPathMatch("/", "/*")).toBe(false);
      expect(doesPathMatch("/1/2", "/*")).toBe(false);
      expect(doesPathMatch("/1/2/3", "/*/*")).toBe(false);
    });
  });

  test("accepts all suffixes if path ends with **", function() {
    expect(doesPathMatch("/1", "/**")).toBe(true);
    expect(doesPathMatch("/1/2", "/**")).toBe(true);
    expect(doesPathMatch("/1/2/3", "/**")).toBe(true);
    expect(doesPathMatch("/1/2", "/1/**")).toBe(true);
    expect(doesPathMatch("/1/2/3", "/1/**")).toBe(true);
    expect(doesPathMatch("/1/2/3", "/1/**")).toBe(true);
  });

  test("checks all paths in an array of paths for a match", function() {
    expect(doesPathMatch("/1", ["/1", "/2", "/3"])).toBe(true);
    expect(doesPathMatch("/4", ["/1", "/2", "/3"])).toBe(false);
  });
});
