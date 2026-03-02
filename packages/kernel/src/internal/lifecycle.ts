import type { Result } from "@comity/primitives/result";
import type { KernelLifecycleState } from "../lifecycle/types.js";

import { failure, success } from "@comity/primitives/result";
import { KernelError } from "../error/kernel.js";

/**
 * Lifecycle manager for the kernel.
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
   * @returns - Current kernel state.
   */
  get state(): KernelLifecycleState {
    return this.#state;
  }

  /**
   * Check if the current state matches the given state.
   *
   * @param what - State to check against.
   *
   * @returns True if the current state matches the given state, false otherwise
   */
  is(what: KernelLifecycleState): boolean {
    return this.#state === what;
  }

  /**
   * Seal the kernel.
   *
   * @returns - Result of the lifecycle seal operation.
   *
   * @remarks
   * Sealing the kernel transitions it to a state where services can be resolved,
   * events can be emitted, and hooks can be executed. After sealing, no further
   * modifications to services, events, or hooks are allowed.
   */
  seal(): Result<KernelLifecycleState, KernelError> {
    // Can only seal from "open" state
    if (this.#state !== "open") {
      return failure(
        new KernelError("invalid_lifecycle_state", {
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
   * Start the kernel.
   *
   * @returns - Result of the lifecycle start operation.
   *
   * @remarks
   * Starting the kernel transitions it to a "running" state where it can
   * actively process requests, resolve services, and handle events.
   * This operation can only be performed from the "sealed" state.
   */
  start(): Result<KernelLifecycleState, KernelError> {
    if (this.#state !== "sealed") {
      return failure(
        new KernelError("invalid_lifecycle_state", {
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
   * Stop the kernel.
   *
   * @returns - Result of the lifecycle stop operation.
   *
   * @remarks
   * Stopping the kernel transitions it back to the "sealed" state from
   * the "running" state. This operation can only be performed when
   * the kernel is currently "running".
   */
  stop(): Result<KernelLifecycleState, KernelError> {
    if (this.#state !== "running") {
      return failure(
        new KernelError("invalid_lifecycle_state", {
          action: "stop",
          state: this.#state,
        })
      );
    }

    // Transition to "stopped" state
    this.#state = "stopped";

    return success(this.#state);
  }

  /**
   * Check if services can be defined in the current state.
   *
   * @returns True if services can be defined, false otherwise.
   */
  canDefineServices(): boolean {
    return this.#state === "open";
  }

  /**
   * Check if services can be resolved in the current state.
   *
   * @returns True if services can be resolved, false otherwise.
   */
  canResolveServices(): boolean {
    return this.#state === "sealed" || this.#state === "running";
  }

  /**
   * Check if events can be emitted in the current state.
   *
   * @returns True if events can be emitted, false otherwise.
   */
  canEmitEvents(): boolean {
    return this.#state === "sealed" || this.#state === "running";
  }

  /**
   * Check if hooks can be executed in the current state.
   *
   * @returns True if hooks can be executed, false otherwise.
   */
  canExecuteHooks(): boolean {
    return this.#state === "sealed" || this.#state === "running";
  }
}
