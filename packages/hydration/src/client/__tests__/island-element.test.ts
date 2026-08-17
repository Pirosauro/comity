import { beforeEach, describe, expect, it, vi } from "vitest";

class FakeHTMLElement {
  querySelector = vi.fn();
  dispatchEvent = vi.fn();
}

vi.stubGlobal("HTMLElement", FakeHTMLElement);

const { IslandElement, registerIslandElement } = await import("../island-element.js");

describe("IslandElement", () => {
  beforeEach(() => {
    vi.stubGlobal("customElements", {
      get: vi.fn().mockReturnValue(undefined),
      define: vi.fn(),
    });
  });

  it("starts in the idle state", () => {
    const element = new IslandElement();

    expect(element.state).toBe("idle");
  });

  it("returns null when there is no script tag", () => {
    const element = new IslandElement();

    (element.querySelector as ReturnType<typeof vi.fn>).mockReturnValue(null);

    expect(element.contract).toBeNull();
  });

  it("returns null when the script tag is empty", () => {
    const element = new IslandElement();

    (element.querySelector as ReturnType<typeof vi.fn>).mockReturnValue({
      textContent: "",
    });

    expect(element.contract).toBeNull();
  });

  it("parses the contract from the embedded script tag", () => {
    const element = new IslandElement();

    (element.querySelector as ReturnType<typeof vi.fn>).mockReturnValue({
      textContent: JSON.stringify({
        id: "hero",
        component: "Hero",
        data: {},
        strategy: { kind: "immediate" },
      }),
    });

    expect(element.contract).toEqual({
      id: "hero",
      component: "Hero",
      data: {},
      strategy: { kind: "immediate" },
    });
  });

  it("returns null when the script content is not a valid contract", () => {
    const element = new IslandElement();

    (element.querySelector as ReturnType<typeof vi.fn>).mockReturnValue({
      textContent: '{"id":1}',
    });

    expect(element.contract).toBeNull();
  });

  it("caches the parsed contract", () => {
    const element = new IslandElement();
    const querySelector = vi.fn().mockReturnValue({
      textContent: JSON.stringify({
        id: "hero",
        component: "Hero",
        data: {},
        strategy: { kind: "immediate" },
      }),
    });

    (element.querySelector as ReturnType<typeof vi.fn>).mockImplementation(querySelector);

    const first = element.contract;
    const second = element.contract;

    expect(first).toBe(second);
    expect(querySelector).toHaveBeenCalledTimes(1);
  });

  it("transitions to materialized when connected", () => {
    const element = new IslandElement();

    element.connectedCallback();

    expect(element.state).toBe("materialized");
  });

  it("resets the cached contract when disconnected", () => {
    const element = new IslandElement();
    const querySelector = vi.fn().mockReturnValue({
      textContent: JSON.stringify({
        id: "hero",
        component: "Hero",
        data: {},
        strategy: { kind: "immediate" },
      }),
    });

    (element.querySelector as ReturnType<typeof vi.fn>).mockImplementation(querySelector);

    expect(element.contract).not.toBeUndefined();
    expect(querySelector).toHaveBeenCalledTimes(1);

    element.disconnectedCallback();
    element.contract;

    expect(querySelector).toHaveBeenCalledTimes(2);
  });

  it("performs a valid state transition", () => {
    const element = new IslandElement();

    expect(element.transition("materialized")).toBe(true);
    expect(element.state).toBe("materialized");
    expect(element.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "island-state-transition",
        detail: { from: "idle", to: "materialized", success: true },
      })
    );
  });

  it("rejects an invalid state transition", () => {
    const element = new IslandElement();

    expect(element.transition("completed")).toBe(false);
    expect(element.state).toBe("idle");
    expect(element.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "island-state-transition",
        detail: { from: "idle", to: "completed", success: false },
      })
    );
  });

  it("follows the full transition chain", () => {
    const element = new IslandElement();

    expect(element.transition("materialized")).toBe(true);
    expect(element.transition("hydrating")).toBe(true);
    expect(element.transition("completed")).toBe(true);
    expect(element.state).toBe("completed");
  });

  it("registers the island custom element when not already registered", () => {
    const { get, define } = globalThis.customElements as {
      get: ReturnType<typeof vi.fn>;
      define: ReturnType<typeof vi.fn>;
    };

    registerIslandElement();

    expect(get).toHaveBeenCalledWith("comity-island");
    expect(define).toHaveBeenCalledWith("comity-island", IslandElement);
  });

  it("does not re-register the island custom element when already registered", () => {
    const { get, define } = globalThis.customElements as {
      get: ReturnType<typeof vi.fn>;
      define: ReturnType<typeof vi.fn>;
    };

    get.mockReturnValue(IslandElement);

    registerIslandElement();

    expect(define).not.toHaveBeenCalled();
  });
});