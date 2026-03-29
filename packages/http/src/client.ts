import type { HttpMethod } from "./contracts/method.js";

/**
 * Options for the HTTP client, extending standard RequestInit with additional features
 */
export interface HttpOptions extends Omit<RequestInit, "method" | "headers"> {
  /** HTTP method to use (default: 'GET') */
  readonly method?: HttpMethod;

  /** Maximum time in milliseconds before aborting request */
  readonly timeout?: number;

  /** Delay in milliseconds before starting request (throttling) */
  readonly delay?: number;

  /** Headers to include in the request */
  readonly headers?: Record<string, string>;
}

/**
 * Utility function to pause execution
 *
 * @param ms - Time to wait in milliseconds
 *
 * @returns Promise that resolves after the specified time
 */
const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Enhanced HTTP client with timeout, delay, and Next.js support
 * @param url - URL or RequestInfo for the HTTP request
 * @param options - Configuration options including timeout, delay, and Next.js options
 *
 * @returns Promise resolving to Response object
 *
 * @example
 * ```typescript
 * // Basic GET request
 * const response = await client('https://api.example.com/data');
 *
 * // POST with JSON body and timeout
 * const result = await client('https://api.example.com/users', {
 *   method: 'POST',
 *   timeout: 5000,
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ name: 'John' })
 * });
 *
 * // With Next.js caching
 * const cached = await client('/api/data', {
 *   next: { revalidate: 60, tags: ['data'] }
 * });
 * ```
 */
export const client = async (url: Request | URL, options: HttpOptions = {}): Promise<Response> => {
  const { timeout = 0, delay = 0, ...fetchOptions } = options;

  // Apply delay if specified
  if (delay > 0) await wait(delay);

  let abortController: AbortController | undefined;

  // Handle timeout
  if (timeout > 0) {
    abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController?.abort(), timeout);

    // Combine with existing signal if present
    if (fetchOptions.signal) {
      // Fallback implementation for AbortSignal.any
      const combinedController = new AbortController();

      /**
       * Abort handler that triggers when either the fetch signal or the timeout signal is aborted.
       *
       * @returns void
       */
      const abortHandler = () => combinedController.abort();

      fetchOptions.signal.addEventListener("abort", abortHandler);
      abortController.signal.addEventListener("abort", abortHandler);

      fetchOptions.signal = combinedController.signal;
    } else {
      fetchOptions.signal = abortController.signal;
    }

    try {
      const response = await fetch(url, fetchOptions as RequestInit);

      clearTimeout(timeoutId);

      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      throw error;
    }
  }

  // Request without timeout
  return fetch(url, fetchOptions as RequestInit);
};
