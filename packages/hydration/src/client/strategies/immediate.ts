/**
 * Immediate hydration strategy
 *
 * @param run Function to run immediately
 */
export function immediate(run: () => Promise<void>): void {
  run();
}
