import { act, renderHook } from "@testing-library/react-hooks";

import { createUsePathParams } from "../src/createUsePathParams";
import { createRouterSetup } from "../testHelpers/createRouterSetup";

describe("createUsePathParams", function() {
  const {
    history,
    store: { path },
    withStore,
    streamLocation,
  } = createRouterSetup();

  streamLocation();

  beforeEach(() => {
    history.push("/", null);
  });

  const usePathParams = withStore(createUsePathParams)(path("location"));

  test("", function() {
    act(function() {
      history.push("/1");
    });

    const { result } = renderHook(() => usePathParams("/:id"));
    expect(result.current).toStrictEqual({ id: "1" });

    act(function() {
      history.push("/1/2/3");
    });

    expect(result.current).toStrictEqual({ id: null });
  });

  test("", function() {
    act(function() {
      history.push("/1/2/3");
    });

    const { result } = renderHook(() => usePathParams("/:one/:two/:three"));
    expect(result.current).toStrictEqual({ one: "1", three: "3", two: "2" });

    act(function() {
      history.push("/");
    });

    expect(result.current).toStrictEqual({ one: null, three: null, two: null });
  });
});
