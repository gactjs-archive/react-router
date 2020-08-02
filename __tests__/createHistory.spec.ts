import { createHistory } from "@gact/history";

import { createHistory as routerCreateHistory } from "../src/createHistory";

describe("createHistory", function() {
  test("creates a history identical to the one created by @gact/history ", function() {
    expect(routerCreateHistory().location).toStrictEqual(
      createHistory().location
    );
  });
});
