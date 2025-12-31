import type { NodePgClient } from "drizzle-orm/node-postgres";
import type { DRIZZLE_KIND } from "../../constants.js";

export type ObservableClientAlike = {
  on<K extends "error">(
    event: K,
    listener: (error: Error) => void
  ): ObservableClientAlike;
} & Pick<NodePgClient, "query" | "connect">;

export type PostgresClient = NodePgClient & {
  readonly [DRIZZLE_KIND]: "postgres";
};

export interface PostgresClientOptions {
  /** Event emitter */
  emit: <T>(name: string, payload?: T) => Promise<void>;
}
