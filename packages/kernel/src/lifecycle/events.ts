/**
 * Kernel lifecycle events.
 *
 * These events describe observable state transitions of the kernel.
 * They do NOT expose internal execution details.
 */
export interface KernelEvents {
  /**
   * Fired when the kernel transitions from `open` to `sealed`.
   *
   * No further modules or services can be registered after this point.
   */
  kernelSealed(): void;

  /**
   * Fired when the kernel enters the `running` state.
   *
   * At this point all modules are initialized and the application is ready.
   */
  kernelStarted(): void;

  /**
   * Fired when the kernel transitions to `stopped`.
   *
   * This is the final lifecycle event.
   */
  kernelStopped(): void;
}