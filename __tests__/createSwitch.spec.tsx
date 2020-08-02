import React, { useEffect } from "react";

import { act, render } from "@testing-library/react";

import { createRoute } from "../src/createRoute";
import { createSwitch } from "../src/createSwitch";
import { createRouterSetup } from "../testHelpers/createRouterSetup";

describe("createRoute", function() {
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

  const Route = withStore(createRoute)(path("location"));
  const Switch = withStore(createSwitch)(path("location"), Route);

  test("renders child Route that best matches the current location", function() {
    let rendered: string | null = null;

    function Comp({ identifer }: { identifer: string }): null {
      useEffect(function() {
        rendered = identifer;
      }, []);

      return null;
    }

    act(function() {
      history.push("/1");
    });

    render(
      <Switch>
        <Route path="/">
          <Comp identifer="" />
        </Route>
        <Route path="/1">
          <Comp identifer="1" />
        </Route>
      </Switch>
    );

    expect(rendered).toBe("1");
  });

  test("renders null if none of the Routes match", function() {
    let rendered: string | null = null;

    function Comp({ identifer }: { identifer: string }): null {
      useEffect(function() {
        rendered = identifer;
      }, []);

      return null;
    }

    act(function() {
      history.push("/2");
    });

    render(
      <Switch>
        <Route path="/">
          <Comp identifer="" />
        </Route>
        <Route path="/1">
          <Comp identifer="1" />
        </Route>
      </Switch>
    );

    expect(rendered).toBe(null);
  });

  test("handles Route with multiple paths", function() {
    let rendered: string | null = null;

    function Comp({ identifer }: { identifer: string }): null {
      useEffect(function() {
        rendered = identifer;
      }, []);

      return null;
    }

    act(function() {
      history.push("/1");
    });

    render(
      <Switch>
        <Route path="/">
          <Comp identifer="" />
        </Route>
        <Route path={["/1", "/2"]}>
          <Comp identifer="1or2" />
        </Route>
        <Route path="/**">
          <Comp identifer="default" />
        </Route>
      </Switch>
    );

    expect(rendered).toBe("1or2");

    act(function() {
      history.push("/");
    });

    expect(rendered).toBe("");

    act(function() {
      history.push("/2");
    });

    expect(rendered).toBe("1or2");
  });

  test("Switch throws if passed a non-Route child", function() {
    const consoleError = jest.spyOn(console, "error").mockImplementation();

    expect(function() {
      render(
        <Switch>
          <p>not a route</p>
          <Route path="/">Home</Route>
        </Switch>
      );
    }).toThrowError("Only <Route /> is allowed to be a child");

    consoleError.mockRestore();
  });
});
