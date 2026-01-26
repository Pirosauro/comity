import type { Result } from "@comity/primitives/result";
import type { KernelLifecycleState } from "../lifecycle/state.js";

import { failure, success } from "@comity/primitives/result";
import { InvalidLifecycleStateError } from "../errors/invalid-lifecycle-state.js";

/**
 * Lifecycle manager for the kernel
 *
 * @remarks
 * Manages the state transitions of the kernel through its lifecycle stages:
 * "open", "sealed", and "running".
 *
 * @example
 * ```typescript
 * const lifecycle = new Lifecycle();
 * console.log(lifecycle.state); // "open"
 *
 * const sealResult = lifecycle.seal();
 * if (sealResult.success) {
 *   console.log(sealResult.value); // "sealed"
 * }
 *
 * const startResult = lifecycle.start();
 * if (startResult.success) {
 *   console.log(startResult.value); // "running"
 * }
 * ```
 */
export class Lifecycle {
  #state: KernelLifecycleState = "open";

  /**
   * @returns Current kernel state
   */
  get state(): KernelLifecycleState {
    return this.#state;
  }

  /**
   * Check if the current state matches the given state
   *
   * @param what State to check against
   * @returns True if the current state matches the given state, false otherwise
   */
  is(what: KernelLifecycleState): boolean {
    return this.#state === what;
  }

  /**
   * Seal the kernel
   *
   * @returns Result of the lifecycle seal operation
   *
   * @remarks
   * Sealing the kernel transitions it to a state where services can be resolved,
   * events can be emitted, and hooks can be executed. After sealing, no further
   * modifications to services, events, or hooks are allowed.
   */
  seal(): Result<KernelLifecycleState, InvalidLifecycleStateError> {
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
   * Start the kernel
   *
   * @returns Result of the lifecycle start operation
   *
   * @remarks
   * Starting the kernel transitions it to a "running" state where it can
   * actively process requests, resolve services, and handle events.
   * This operation can only be performed from the "sealed" state.
   */
  start(): Result<KernelLifecycleState, InvalidLifecycleStateError> {
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
   * Stop the kernel
   *
   * @returns Result of the lifecycle stop operation
   *
   * @remarks
   * Stopping the kernel transitions it back to the "sealed" state from
   * the "running" state. This operation can only be performed when
   * the kernel is currently "running".
   */
  stop(): Result<KernelLifecycleState, InvalidLifecycleStateError> {
    if (this.#state !== "running") {
      return failure(
        new InvalidLifecycleStateError({
          action: "stop",
          state: this.#state,
        })
      );
    }

    // Transition to "stopped" state
    this.#state = "stopped";

    return success(this.#state);
  }
}
