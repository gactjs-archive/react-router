import { rankPath } from "../../src/utils/rankPath";

describe("rankPath", function() {
  test("simple paths", function() {
    expect(rankPath("/")).toBe(5);
    expect(rankPath("/*")).toBe(6);
    expect(rankPath("/1")).toBe(7);
    expect(rankPath("/**")).toBe(3);
  });

  test("multi-segment paths", function() {
    expect(rankPath("/*/*")).toBe(12);
    expect(rankPath("/*/1")).toBe(13);
    expect(rankPath("/1/2")).toBe(14);
    expect(rankPath("1/**")).toBe(10);
  });

  test("long paths", function() {
    expect(rankPath("/*/*/*/*")).toBe(24);
    expect(rankPath("/1/*/3/*")).toBe(26);
    expect(rankPath("/1/2/3/4")).toBe(28);
    expect(rankPath("/1/2/3/**")).toBe(24);
  });
});
