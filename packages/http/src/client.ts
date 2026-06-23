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

/** Cleanup function for abort listeners. */
type AbortCleanup = () => void;

/**
 * Reads the abort reason from a signal when available.
 *
 * @param signal - Abort signal to inspect.
 *
 * @returns Abort reason propagated by the caller or runtime.
 */
function getAbortReason(signal: AbortSignal): unknown {
  return "reason" in signal ? signal.reason : undefined;
}

/**
 * Combines multiple abort signals into a single signal.
 *
 * @param signals - Signals that should abort the same request.
 *
 * @returns Combined signal plus a cleanup function for listeners.
 */
function combineAbortSignals(signals: readonly AbortSignal[]): {
  /** Combined abort signal. */
  signal: AbortSignal;
  /** Cleanup for listeners attached during the fallback path. */
  cleanup: AbortCleanup;
} {
  if (typeof AbortSignal.any === "function") {
    return {
      signal: AbortSignal.any(Array.from(signals)),
      /**
       *
       */
      cleanup: () => undefined,
    };
  }

  const controller = new AbortController();
  const cleanups: AbortCleanup[] = [];

  /**
   * Aborts the combined controller using the originating signal reason.
   *
   * @param signal - Signal that triggered the abort.
   *
   * @returns void
   */
  const abortFrom = (signal: AbortSignal) => {
    controller.abort(getAbortReason(signal));
  };

  for (const signal of signals) {
    if (signal.aborted) {
      abortFrom(signal);

      return {
        signal: controller.signal,
        /**
         *
         */
        cleanup: () => undefined,
      };
    }

    /**
     *
     */
    const handler = () => abortFrom(signal);

    signal.addEventListener("abort", handler, { once: true });
    cleanups.push(() => signal.removeEventListener("abort", handler));
  }

  return {
    signal: controller.signal,
    /**
     *
     */
    cleanup: () => {
      for (const cleanup of cleanups) {
        cleanup();
      }
    },
  };
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
