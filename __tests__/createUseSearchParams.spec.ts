import { act, renderHook } from "@testing-library/react-hooks";

import { createUseSearchParams } from "../src/createUseSearchParams";
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

  const useSearchParams = withStore(createUseSearchParams)(path("location"));

  test("", function() {
    act(function() {
      history.push("/?a=a");
    });

    const { result } = renderHook(() => useSearchParams());
    expect(result.current.get("a")).toBe("a");

    act(function() {
      history.push("/");
    });

    expect(result.current.get("a")).toBe(null);
  });
});
