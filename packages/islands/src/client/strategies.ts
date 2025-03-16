/**
 * Use MediaQuery string to execute a callback function once the media query matches.
 *
 * @param {string} query - The media query string.
 * @param {() => void} fn - The callback function to execute when the media query matches.
 * @return {() => void} - A function to remove the event listener.
 */
export const listenMediaOnce = (
  query: string,
  fn: () => void
): (() => void) => {
  const mediaQuery = window.matchMedia(query);
  const handler = (event: MediaQueryList | MediaQueryListEvent) => {
    if (event.matches) {
      fn();
    }
  };

  // Execute the handler immediately to check if the media query matches.
  handler(mediaQuery);

  // Add an event listener to execute the handler when the media query changes.
  mediaQuery.addEventListener('change', handler, { once: true });

  // Return a function to remove the event listener.
  return () => mediaQuery.removeEventListener('change', handler);
};

/**
 * Use IntersectionObserver strategy to execute a callback function once an element is intersecting.
 *
 * @param {Element} element - The element to observe.
 * @param {() => void} fn - The callback function to execute when the element is intersecting.
 * @return {void}
 */
export const observeOnce = (element: Element, fn: () => void): void => {
  const options: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5,
  };

  /**
   * IntersectionObserver callback function.
   *
   * @param {IntersectionObserverEntry[]} entries - The entries observed.
   * @return {void}
   */
  const callback: IntersectionObserverCallback = async (entries) => {
    entries.forEach(async (e) => {
      if (!e.isIntersecting) return;

      if (element && element.childElementCount) {
        for (const child of element.children) {
          observer.unobserve(child);
        }
      }

      await fn();
    });
  };

  const observer = new IntersectionObserver(callback, options);

  if (element && element.childElementCount) {
    for (const child of element.children) {
      observer.observe(child);
    }
  }
};

/**
 * Use idle strategy to execute a callback function when the browser is idle.
 *
 * @param {() => void} fn - The callback function to execute when the browser is idle.
 * @return {void}
 */
export const idle = (fn: () => void): void => {
  typeof window?.requestIdleCallback === 'function'
    ? window.requestIdleCallback(fn)
    : setTimeout(fn, 250);
};
