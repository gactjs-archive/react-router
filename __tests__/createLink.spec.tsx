import React from "react";

import { cleanup, fireEvent, render } from "@testing-library/react";

import { createLink } from "../src/createLink";
import { createRouterSetup } from "../testHelpers/createRouterSetup";

describe("createLink", function() {
  const {
    history,
    store: { path, get },
    withStore,
    streamLocation,
  } = createRouterSetup();

  streamLocation();

  beforeEach(() => {
    history.push("/", null);
  });

  const Link = withStore(createLink)(path("location"), history);

  test("calls history.push by default", function() {
    const push = jest.spyOn(history, "push").mockImplementation();

    const { getByText } = render(<Link href="/1">one</Link>);

    fireEvent.click(getByText("one"));

    expect(push).toHaveBeenCalledWith("/1", undefined);

    push.mockRestore();
  });

  test("calls history.replace if replace=true", function() {
    const replace = jest.spyOn(history, "replace").mockImplementation();

    const { getByText } = render(
      <Link replace href="/1">
        Home
      </Link>
    );

    fireEvent.click(getByText("Home"));

    expect(replace).toHaveBeenCalledWith("/1", undefined);

    replace.mockRestore();
  });

  test("adds provided state to navigated to location", function() {
    const { getByText } = render(
      <Link href="/" state={{ navigated: true }}>
        one
      </Link>
    );

    fireEvent.click(getByText("one"));

    expect(get(path("location", "state"))).toStrictEqual({ navigated: true });
  });

  test("does not navigate on non-main click", function() {
    const { getByText } = render(
      <Link
        href="/"
        activeClassName="active"
        activeStyle={{ background: "blue" }}
      >
        one
      </Link>
    );

    fireEvent.click(getByText("one"), { button: 1 });

    expect(get(path("location", "pathname"))).toBe("/");
  });

  test("adds activeClassName and activeStyle if Link's href is active", function() {
    const { getByText } = render(
      <Link
        href="/"
        activeClassName="active"
        activeStyle={{ background: "blue" }}
      >
        one
      </Link>
    );

    const anchor = getByText("one");

    expect(anchor.getAttribute("class")).toBe("active");
    expect(anchor.getAttribute("style")).toBe("background: blue;");
  });

  test("does not add activeClassName and activeStyle if Link's href is not active", function() {
    const { getByText } = render(
      <Link
        href="/1"
        activeClassName="active"
        activeStyle={{ background: "blue" }}
      >
        one
      </Link>
    );

    const anchor = getByText("one");
    expect(anchor.getAttribute("class")).toBe(null);
    expect(anchor.getAttribute("style")).toBe(null);
  });

  test("calls the provided onClick handler", function() {
    const onClick = jest.fn();

    const { getByText } = render(
      <Link href="/" onClick={onClick}>
        one
      </Link>
    );

    fireEvent.click(getByText("one"));

    expect(onClick).toHaveBeenCalled();
  });

  test("forwards ref", function() {
    let ref;

    function refMock(instance: HTMLAnchorElement): void {
      ref = instance;
    }

    render(
      <Link href="/" ref={refMock}>
        one
      </Link>
    );

    expect(ref).toBeInstanceOf(HTMLAnchorElement);
  });

  afterEach(cleanup);
});
