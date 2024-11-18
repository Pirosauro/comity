/** @jest-environment jsdom */
import { describe, expect, jest, it } from "@jest/globals";
import { listenMediaOnce, observeOnce, idle } from "../../dist/strategies.js";

describe("listenMediaOnce", () => {
  it("should call the callback when the media query matches", () => {
    const query = "(max-width: 600px)";
    const fn = jest.fn();

    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));

    const removeListener = listenMediaOnce(query, fn);

    expect(fn).toHaveBeenCalled();
    removeListener();
  });

  it("should remove the event listener when returned function is called", () => {
    const query = "(max-width: 600px)";
    const fn = jest.fn();
    const removeEventListener = jest.fn();

    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener,
    }));

    const removeListener = listenMediaOnce(query, fn);

    removeListener();
    expect(removeEventListener).toHaveBeenCalled();
  });
});

describe("observeOnce", () => {
  let observerMock;

  beforeEach(() => {
    observerMock = {
      observe: jest.fn(),
      unobserve: jest.fn(),
    };

    global.IntersectionObserver = jest.fn().mockImplementation((callback) => {
      return observerMock;
    });
  });

  it("should not call the callback when the element is not intersecting", () => {
    const element = document.createElement("div");
    const child = document.createElement("div");

    element.appendChild(child);

    const fn = jest.fn();

    window.IntersectionObserver.mockImplementation((callback) => {
      callback([{ isIntersecting: false, target: child }]);

      return observerMock;
    });

    observeOnce(element, fn);
    expect(fn).not.toHaveBeenCalled();
    expect(observerMock.unobserve).not.toHaveBeenCalled();
  });
});

describe("idle", () => {
  it("should call the callback using requestIdleCallback if available", () => {
    const fn = jest.fn();

    window.requestIdleCallback = jest.fn().mockImplementation((cb) => cb());

    idle(fn);
    expect(fn).toHaveBeenCalled();
  });

  it("should call the callback using setTimeout if requestIdleCallback is not available", () => {
    const fn = jest.fn();

    window.requestIdleCallback = undefined;
    jest.useFakeTimers();

    idle(fn);
    jest.runAllTimers();
    expect(fn).toHaveBeenCalled();
  });
});
