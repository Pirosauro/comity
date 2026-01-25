import type { Result } from "@comity/primitives/result";
import type { HttpLifecycleState } from "../lifecycle/state.js";

import { failure, success } from "@comity/primitives/result";
import { InvalidLifecycleStateError } from "../errors/invalid-lifecycle-state.js";

/**
 * Lifecycle manager for the HTTP facade.
 *
 * @remarks
 * Manages state transitions through "open", "sealed", and "running" stages.
 */
export class Lifecycle {
  #state: HttpLifecycleState = "open";

  /** Current lifecycle state. */
  get state(): HttpLifecycleState {
    return this.#state;
  }

  /**
   * Checks if the current state matches the given state.
   * @param what - State to check against.
   * @returns - True if state matches.
   */
  is(what: HttpLifecycleState): boolean {
    return this.#state === what;
  }

  /**
   * Transitions to sealed state (no more middleware can be registered).
   * @returns - Result containing the new state or error.
   */
  seal(): Result<HttpLifecycleState, InvalidLifecycleStateError> {
    // Can only seal from "open" state
    if (this.#state !== "open") {
      return failure(
        new InvalidLifecycleStateError({
          action: "seal",
          state: this.#state,
        })
      );
    }

    // Transition to "sealed" state
    this.#state = "sealed";

    return success(this.#state);
  }

  /**
   * Transitions to running state (can process requests).
   * @returns - Result containing the new state or error.
   */
  start(): Result<HttpLifecycleState, InvalidLifecycleStateError> {
    if (this.#state !== "sealed") {
      return failure(
        new InvalidLifecycleStateError({
          action: "start",
          state: this.#state,
        })
      );
    }

    // Transition to "running" state
    this.#state = "running";

    return success(this.#state);
  }

  /**
   * Transitions back to sealed state from running state.
   * @returns - Result containing the new state or error.
   */
  stop(): Result<HttpLifecycleState, InvalidLifecycleStateError> {
    if (this.#state !== "running") {
      return failure(
        new InvalidLifecycleStateError({
          action: "stop",
          state: this.#state,
        })
      );
    }

    // Transition to "sealed" state
    this.#state = "sealed";

    return success(this.#state);
  }
}
