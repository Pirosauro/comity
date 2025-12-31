import type { DrizzleKind } from "../types.js";

export function wrapQuery<
  T,
  O extends (this: T, ...args: any[]) => Promise<any>
>(
  kind: DrizzleKind,
  target: T,
  original: O,
  emit: (event: string, payload: unknown) => Promise<void>
) {
  return async function (
    ...args: Parameters<O>
  ): Promise<Awaited<ReturnType<O>>> {
    const start = performance.now();
    const payload = {
      adapter: kind,
      id: crypto.randomUUID(),
      startedAt: start,
      timestamp: new Date().toISOString(),
    };

    // Emit the start event
    await emit("@comity/drizzle:query", {
      ...payload,
      event: "start",
    });

    try {
      const result = await original.apply(target, args);
      const stop = performance.now();

      // Emit the end event
      await emit("@comity/drizzle:query", {
        ...payload,
        event: "end",
        finishedAt: stop,
        duration: stop - start,
        timestamp: new Date().toISOString(),
      });

      return result;
    } catch (error) {
      const stop = performance.now();

      // Emit the error event
      await emit("@comity/drizzle:query", {
        ...payload,
        event: "error",
        finishedAt: stop,
        duration: stop - start,
        error,
        timestamp: new Date().toISOString(),
      });

      throw error;
    }
  };
}
