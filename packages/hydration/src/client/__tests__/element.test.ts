// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ComityIslandElement } from "../element.js";

describe("ComityIslandElement", () => {
  let element: ComityIslandElement;

  beforeEach(() => {
    // Register custom element if not already registered
    if (!customElements.get("test-island")) {
      customElements.define("test-island", ComityIslandElement);
    }

    element = document.createElement("test-island") as ComityIslandElement;
  });

  describe("contract getter", () => {
    it("should parse contract from script tag", () => {
      const mockContract = { name: "test", data: {} };
      const mockScript = {
        textContent: JSON.stringify(mockContract),
      };

      element.querySelector = vi.fn().mockReturnValue(mockScript);

      expect(element.contract).toEqual(mockContract);
      expect(element.querySelector).toHaveBeenCalledWith('script[type="application/json"]');
    });

    it("should cache the contract after first access", () => {
      const mockContract = { name: "test", data: {} };
      const mockScript = {
        textContent: JSON.stringify(mockContract),
      };

      element.querySelector = vi.fn().mockReturnValue(mockScript);

      // Access contract twice
      element.contract;
      element.contract;

      // querySelector should only be called once
      expect(element.querySelector).toHaveBeenCalledTimes(1);
    });

    it("should return null if script tag is missing", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      element.querySelector = vi.fn().mockReturnValue(null);

      const result = element.contract;

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[@comity/hydration] Failed to parse island contract",
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it("should return null if script tag has no textContent", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      element.querySelector = vi.fn().mockReturnValue({ textContent: null });

      const result = element.contract;

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[@comity/hydration] Failed to parse island contract",
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it("should return null if JSON is invalid", () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const mockScript = {
        textContent: "invalid json",
      };

      element.querySelector = vi.fn().mockReturnValue(mockScript);

      const result = element.contract;

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[@comity/hydration] Failed to parse island contract",
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe("hydrated property", () => {
    it("should get and set hydrated timestamp", () => {
      const timestamp = Date.now();
      element.hydrated = timestamp;

      expect(element.hydrated).toBe(timestamp);
    });

    it("should default to 0", () => {
      expect(element.hydrated).toBe(0);
    });
  });

  describe("connectedCallback", () => {
    it("should dispatch comity-island:connected event", () => {
      const dispatchEventSpy = vi.spyOn(element, "dispatchEvent");

      element.connectedCallback();

      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "comity-island:connected",
          bubbles: true,
        })
      );
    });
  });

  describe("disconnectedCallback", () => {
    it("should dispatch comity-island:disconnected event", () => {
      const dispatchEventSpy = vi.spyOn(element, "dispatchEvent");

      element.disconnectedCallback();

      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "comity-island:disconnected",
          bubbles: true,
        })
      );
    });

    it("should clear contract cache", () => {
      // Set up contract
      const mockContract = { name: "test", data: {} };
      const mockScript = {
        textContent: JSON.stringify(mockContract),
      };
      element.querySelector = vi.fn().mockReturnValue(mockScript);

      // Access contract to cache it
      element.contract;

      // Disconnect
      element.disconnectedCallback();

      // Access contract again, should re-query
      element.contract;

      // querySelector should be called twice (once before disconnect, once after)
      expect(element.querySelector).toHaveBeenCalledTimes(2);
    });
  });
});
