/** Cleanup function for abort listeners. */
export type AbortCleanup = () => void;

/**
 * Reads the abort reason from a signal when available.
 *
 * @param signal - Abort signal to inspect.
 *
 * @returns Abort reason propagated by the caller or runtime.
 */
export function getAbortReason(signal: AbortSignal): unknown {
  return "reason" in signal ? signal.reason : undefined;
}

/**
 * Combines multiple abort signals into a single signal.
 *
 * @param signals - Signals that should abort the same request.
 *
 * @returns Combined signal plus a cleanup function for listeners.
 */
export function combineAbortSignals(signals: readonly AbortSignal[]): {
  /** Combined abort signal. */
  signal: AbortSignal;
  /** Cleanup for listeners attached during the fallback path. */
  cleanup: AbortCleanup;
} {
  if (typeof AbortSignal.any === "function") {
    return {
      signal: AbortSignal.any(Array.from(signals)),
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
    cleanup: () => {
      for (const cleanup of cleanups) {
        cleanup();
      }
    },
  };
}
