import type { IslandHydrationState } from "../contracts/island.js";
import type { MaybeIslandContract } from "../serializer.js";

import { JsonIslandSerializer } from "../serializer.js";

/**
 * Custom element representing a Comity hydration island.
 *
 * @remarks
 * Responsibilities:
 * - Bridge DOM lifecycle → Island lifecycle
 * - Expose parsed island contract
 * - Emit lifecycle events at DOM level
 */
export class IslandElement extends HTMLElement {
  /** Current hydration state */
  #state: IslandHydrationState = "idle";

  // Cached island contract (lazy)
  #contract: MaybeIslandContract;

  /** @returns Current hydration state */
  get state(): IslandHydrationState {
    return this.#state;
  }

  /** @returns MaybeIslandContract */
  get contract(): MaybeIslandContract {
    // Return cached value if available
    if (this.#contract !== undefined) {
      return this.#contract;
    }

    // Parse contract from embedded script tag
    const script = this.querySelector('script[type="application/json"]');

    // If no script tag or empty content, cache null
    if (!script?.textContent) {
      this.#contract = null;

      return this.#contract;
    }

    // Deserialize contract
    try {
      this.#contract = JsonIslandSerializer.deserialize(script.textContent);
    } catch {
      this.#contract = null;
    }

    return this.#contract;
  }

  /** @inheritdoc */
  connectedCallback() {
    this.transition("materialized");
  }

  /** @inheritdoc */
  disconnectedCallback() {
    this.#contract = undefined;
  }

  /**
   * Transition to next state
   *
   * @param next - Next state
   *
   * @returns True if the transition was successful, false otherwise
   *
   * @remarks
   * This method dispatches a "island-state-transition" event with details about the transition.
   *
   * NOTE:
   * The "materialized" state is triggered automatically when the element is connected to the DOM.
   */
  transition(next: IslandHydrationState): boolean {
    const from = this.#state;
    const validTransitions: Record<IslandHydrationState, IslandHydrationState[]> = {
      idle: ["materialized"],
      materialized: ["hydrating", "failed"],
      hydrating: ["completed", "failed"],
      completed: [],
      failed: [],
    };

    // Validate transition
    if (!validTransitions[from]?.includes(next)) {
      // Emit failed transition event
      this.dispatchEvent(
        new CustomEvent("island-state-transition", {
          detail: { from, to: next, success: false },
        })
      );

      return false;
    }

    this.#state = next;

    // Emit transition event
    this.dispatchEvent(
      new CustomEvent("island-state-transition", {
        detail: { from, to: this.#state, success: true },
      })
    );

    return true;
  }
}

/**
 * Registers the Comity island custom element
 */
export function registerIslandElement(): void {
  if (!customElements.get("comity-island")) {
    customElements.define("comity-island", IslandElement);
  }
}
