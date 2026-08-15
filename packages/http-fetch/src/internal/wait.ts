/**
 * Utility function to pause execution
 *
 * @param ms - Time to wait in milliseconds
 *
 * @returns Promise that resolves after the specified time
 */
export const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
