import type { BaseError } from "@comity/primitives/error";
import type { KernelLifecycleState } from "./types.js";

/**
 * Kernel lifecycle events.
 *
 * @remarks
 * These events describe observable state transitions of the kernel.
 * They do NOT expose internal execution details.
 */
export interface KernelLifecycleEmitter {
  /**
   * Fired when the kernel transitions from `open` to `sealed`.
   *
   * @remarks
   * No further services can be registered after this point.
   */
  onKernelSealed(): void;

  /**
   * Fired when the kernel enters the `running` state.
   *
   * @remarks
   * At this point all modules are initialized and the application is ready.
   */
  onKernelStarted(): void;

  /**
   * Fired when the kernel transitions to `stopped`.
   *
   * @remarks
   * This is the final lifecycle event.
   */
  onKernelStopped(): void;

  /**
   * Fired when the kernel transitions between states.
   *
   * @param from - The previous state
   * @param to - The new state
   */
  onStateTransition?: (from: KernelLifecycleState, to: KernelLifecycleState) => void;

  /**
   * Fired when an error occurs in the kernel.
   *
   * @param error - The error that occurred
   */
  onError?: (error: BaseError) => void;
}
