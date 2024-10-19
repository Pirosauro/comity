/** @jest-environment jsdom */
import { renderToString, hydrateRoot } from "react-dom/server";
import {
  reactRenderer,
  useRequestContext,
  createRenderer,
} from "../../dist/renderer.js";

// mock the necessary functions and types
jest.mock("hono", () => ({
  Context: jest.fn(),
}));
jest.mock("react-dom/server", () => ({
  renderToString: jest.fn(),
}));
jest.mock("react-dom/client", () => ({
  hydrateRoot: jest.fn(),
}));

describe("reactRenderer", () => {
  let ctx;
  let next;
  let component;
  let options;

  beforeEach(() => {
    ctx = {
      setRenderer: jest.fn(),
      html: jest.fn(),
    };
    next = jest.fn();
    component = ({ children }) => children;
    options = { docType: true };
  });

  it("should set the renderer and call next", async () => {
    const middleware = reactRenderer(component, options);
    await middleware(ctx, next);

    expect(ctx.setRenderer).toHaveBeenCalledWith(expect.any(Function));
    expect(next).toHaveBeenCalled();
  });

  it("should create a renderer with correct parameters", async () => {
    const renderer = createRenderer(ctx, component, options);
    const result = await renderer(<div>Test</div>, {});

    expect(renderToString).toHaveBeenCalled();
    expect(ctx.html).toHaveBeenCalledWith(
      expect.stringContaining("<!DOCTYPE html>")
    );
  });

  it("should throw an error if RequestContext is not provided", () => {
    expect(() => useRequestContext()).toThrow(
      "RequestContext is not provided."
    );
  });

  it("should hydrate the root element with the component", async () => {
    const element = document.createElement("div");
    const Component = () => <div>Test</div>;
    const props = {};

    await react(Component, props, element);

    expect(hydrateRoot).toHaveBeenCalledWith(element, expect.any(Object));
  });
});
