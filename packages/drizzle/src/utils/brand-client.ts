import type { DrizzleKind } from "../types.js";
import { DRIZZLE_KIND } from "../constants.js";

export function brandClient<T>(
  client: T,
  kind: DrizzleKind
): T & { [DRIZZLE_KIND]: DrizzleKind } {
  Object.defineProperty(client, DRIZZLE_KIND, {
    value: kind,
    enumerable: false,
    configurable: false,
    writable: false,
  });

  return client as T & { [DRIZZLE_KIND]: DrizzleKind };
}
