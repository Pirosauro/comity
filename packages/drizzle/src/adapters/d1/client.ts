import { AnyD1Database } from "drizzle-orm/d1/driver";
import type {
  D1Client,
  D1ClientOptions,
  ObservableClientAlike,
} from "./types.js";
import { wrapQuery } from "../../utils/wrap-query.js";
import { brandClient } from "../../utils/brand-client.js";

export function createD1Client(
  client: ObservableClientAlike,
  { emit, ...options }: D1ClientOptions
): D1Client {
  const branded = brandClient(client as D1Client, "d1");

  // If no emitter is provided, return the original client
  if (typeof emit !== "function") {
    return branded;
  }

  return new Proxy(branded, {
    get(target, prop, receiver) {
      if (prop === "kind") {
        return "d1";
      }

      if (prop === "query") {
        const original = target.query.bind(target);

        return wrapQuery<AnyD1Database, AnyD1Database["query"]>(
          "d1",
          target,
          original,
          emit
        );
      }

      return Reflect.get(target, prop, receiver);
    },
  });
}
