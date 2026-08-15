import type { HttpMethod } from "@comity/http";
import type { AbortCleanup } from "./internal/abort.js";

import { combineAbortSignals } from "./internal/abort.js";
import { wait } from "./internal/wait.js";

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

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let cleanupAbortSignals: AbortCleanup | undefined;

  // Handle timeout
  if (timeout > 0) {
    const timeoutController = new AbortController();

    timeoutId = setTimeout(() => timeoutController.abort(), timeout);

    // Combine with existing signal if present
    if (fetchOptions.signal) {
      const combined = combineAbortSignals([fetchOptions.signal, timeoutController.signal]);

      fetchOptions.signal = combined.signal;
      cleanupAbortSignals = combined.cleanup;
    } else {
      fetchOptions.signal = timeoutController.signal;
    }
  }

  try {
    return await fetch(url, fetchOptions as RequestInit);
  } finally {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    cleanupAbortSignals?.();
  }
};
