import type { IslandContract } from "../contracts/island.js";

/**
 * Island contract or null/undefined
 */
type MaybeIslandContract = IslandContract | null | undefined;

/**
 * Custom element for Comity islands
 */
export class ComityIslandElement extends HTMLElement {
  // Contract cache
  #contract: MaybeIslandContract = undefined;

  // Hydration state (timestamp)
  #hydrated = 0;

  /**
   * Getter for island contract
   *
   * @returns Island contract
   */
  get contract() {
    if (typeof this.#contract === "undefined") {
      const script = this.querySelector('script[type="application/json"]');

      try {
        if (typeof script?.textContent !== "string") {
          throw new Error("Island contract script not found");
        }

        this.#contract = JSON.parse(script.textContent);
      } catch (error) {
        console.error(
          "[@comity/hydration] Failed to parse island contract",
          error,
        );

        this.#contract = null;
      }
    }

    return this.#contract;
  }

  /**
   * Hydration state timestamp
   *
   * @returns Hydration timestamp
   */
  get hydrated() {
    return this.#hydrated;
  }

  /**
   * Sets hydration timestamp
   *
   * @param value Hydration timestamp
   */
  set hydrated(value: number) {
    this.#hydrated = value;
  }

  /**
   * Callback when the element is connected to the DOM
   */
  connectedCallback() {
    // Notify that the island has been connected
    this.dispatchEvent(
      new CustomEvent("comity-island:connected", {
        bubbles: true,
      }),
    );
  }

  /**
   * Callback when the element is disconnected from the DOM
   */
  disconnectedCallback() {
    // Free memory
    this.#contract = undefined;

    this.dispatchEvent(
      new CustomEvent("comity-island:disconnected", {
        bubbles: true,
      }),
    );
  }
}
