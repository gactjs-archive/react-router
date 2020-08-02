import React, { useEffect } from "react";

import { act, render } from "@testing-library/react";

import { createRoute } from "../src/createRoute";
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

  test("Route renders child if path matches current location", function() {
    let rendered = false;

    function Comp(): null {
      useEffect(function() {
        rendered = true;
      }, []);

      return null;
    }

    act(function() {
      history.push("/1");
    });

    render(
      <Route path="/1">
        <Comp />
      </Route>
    );

    expect(rendered).toBe(true);
  });

  test("Route does not render child when the path does not match current location", function() {
    let rendered = false;

    function Comp(): null {
      useEffect(function() {
        rendered = true;
      }, []);

      return null;
    }

    act(function() {
      history.push("/1");
    });

    render(
      <Route path="/">
        <Comp />
      </Route>
    );

    expect(rendered).toBe(false);
  });

  test("Route renders child if switchMatch is true", function() {
    let rendered = false;

    function Comp(): null {
      useEffect(function() {
        rendered = true;
      }, []);

      return null;
    }

    act(function() {
      history.push("/1");
    });

    render(
      <Route switchMatch path="/">
        <Comp />
      </Route>
    );

    expect(rendered).toBe(true);
  });
});
