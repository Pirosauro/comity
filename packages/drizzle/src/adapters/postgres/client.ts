import type { NodePgClient } from "drizzle-orm/node-postgres";
import type { DrizzleModuleEvents } from "../../types.js";
import type {
  ObservableClientAlike,
  PostgresClient,
  PostgresClientOptions,
} from "./types.js";
import { wrapQuery } from "../../utils/wrap-query.js";
import { brandClient } from "../../utils/brand-client.js";

export function createPostgresClient(
  client: ObservableClientAlike,
  { emit, ...options }: PostgresClientOptions
): PostgresClient {
  const branded = brandClient(client as PostgresClient, "postgres");

  // If no emitter is provided, return the original client
  if (typeof emit !== "function") {
    return branded;
  }

  // Attach events once
  client.on("error", (error) => {
    emit<DrizzleModuleEvents["@comity/drizzle:error"]>(
      "@comity/drizzle:error",
      { error }
    );
  });

  return new Proxy(branded, {
    get(target, prop, receiver) {
      if (prop === "query") {
        const original = target.query.bind(target);

        return wrapQuery<NodePgClient, NodePgClient["query"]>(
          "postgres",
          target,
          original,
          emit
        );
      }

      return Reflect.get(target, prop, receiver);
    },
  });
}
