/** @jest-environment jsdom */
import { expect, jest, it } from "@jest/globals";
import { createClient } from "../../dist/client";

// mocks for customElements.define
const customElementsDefineMock = jest.fn();
// mocks for console
const consoleLogMock = jest.fn();
const consoleWarnMock = jest.fn();
const consoleErrorMock = jest.fn();

beforeAll(() => {
  Object.defineProperty(global, "customElements", {
    value: { define: customElementsDefineMock },
    writable: true,
  });
  Object.defineProperty(console, "log", {
    value: consoleLogMock,
  });
  Object.defineProperty(console, "warn", {
    value: consoleWarnMock,
  });
  Object.defineProperty(console, "error", {
    value: consoleErrorMock,
  });
});

describe("createClient", () => {
  it("should define custom element comity-island", async () => {
    const options = {
      debug: false,
      islands: {},
      integrations: {},
    };

    await createClient(options);
    expect(customElementsDefineMock).toHaveBeenCalledWith(
      "comity-island",
      expect.any(Function)
    );
  });

  /* @todo: add more tests to cover the functionality of the createClient function */
});

/* @todo: add tests for the Island class methods like connectedCallback, init, and hydrate */
