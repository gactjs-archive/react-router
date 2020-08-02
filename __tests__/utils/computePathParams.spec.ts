import { computePathParams } from "../../src/utils/computePathParams";

describe("computePathParams", function() {
  test("single param match", function() {
    const expectedParams = {
      id: "1",
    };

    expect(computePathParams("/1", "/:id")).toStrictEqual(expectedParams);
  });

  test("single param non-match", function() {
    const expectedParams = {
      id: null,
    };

    expect(computePathParams("/", "/:id")).toStrictEqual(expectedParams);
  });

  test("many params match", function() {
    const expectedParams = {
      one: "1",
      three: "3",
      two: "2",
    };

    expect(computePathParams("1/2/3/4", ":one/:two/:three/*")).toStrictEqual(
      expectedParams
    );
  });

  test("many params non-match", function() {
    const expectedParams = {
      one: null,
      three: null,
      two: null,
    };

    expect(computePathParams("/", ":one/:two/:three/*")).toStrictEqual(
      expectedParams
    );
  });
});
