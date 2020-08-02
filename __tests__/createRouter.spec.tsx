import { createRouter } from "../src";
import { createRouterSetup } from "../testHelpers/createRouterSetup";

describe("router", () => {
  test("router has the correct components and hooks", function() {
    const {
      history,
      store: { path },
      withStore,
    } = createRouterSetup();

    const router = withStore(createRouter)(path("location"), history);

    expect(router).toHaveProperty("Route");
    expect(router).toHaveProperty("Switch");
    expect(router).toHaveProperty("Link");
    expect(router).toHaveProperty("useSearchParams");
    expect(router).toHaveProperty("usePathParams");
  });

  test("location is streamed to store after router creation", function() {
    const {
      history,
      store: { path, get },
      withStore,
    } = createRouterSetup();
    withStore(createRouter)(path("location"), history);

    history.push("/1");

    expect(get(path("location", "pathname"))).toBe("/1");

    history.push("/2");
    expect(get(path("location", "pathname"))).toBe("/2");

    history.push("/3", { streams: true });
    expect(get(path("location", "pathname"))).toBe("/3");
    expect(get(path("location", "state"))).toStrictEqual({ streams: true });
  });
});
