import type { ComityIslandElement } from "../element.js";

/**
 * Visible hydration strategy
 *
 * @param elem Element to observe for visibility
 * @param run Function to run when the element becomes visible
 */
export function visible(
  elem: ComityIslandElement,
  run: () => Promise<void>,
): void {
  // Create an intersection observer
  const observer = new IntersectionObserver(([entry]) => {
    // Element is visible, disconnect observer and run the function
    if (entry?.isIntersecting) {
      observer.disconnect();
      run();
    }
  });

  // Start observing the element
  observer.observe(elem);
}
