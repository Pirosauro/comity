/**
 * Use MediaQuery string
 *
 * @param {string} query - The media query
 * @param {() => void} fn - The callback function
 * @return {() => void}
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

  handler(mediaQuery);

  mediaQuery.addEventListener("change", handler, { once: true });

  return () => mediaQuery.removeEventListener("change", handler);
};

/**
 * Use IntersectionObserver strategy
 *
 * @param {Element} element - The Element
 * @param {() => void} fn - The callback function
 */
export const observeOnce = (element: Element, fn: () => void) => {
  const options: IntersectionObserverInit = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  };

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
 * Use idle strategy
 *
 * @param {() => void} fn - The callback function
 */
export const idle = (fn: () => void) => {
  "requestIdleCallback" in window
    ? window.requestIdleCallback(fn)
    : setTimeout(fn, 250);
};
