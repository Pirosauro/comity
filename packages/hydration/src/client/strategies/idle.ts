/**
 * Idle hydration strategy
 *
 * @param run Function to run when the browser is idle
 */
export function idle(run: () => Promise<void>): void {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(run);
  } else {
    setTimeout(run, 200);
  }
}
