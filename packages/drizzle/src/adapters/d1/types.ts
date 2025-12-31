import type { AnyD1Database } from "drizzle-orm/d1";

export type ObservableClientAlike = Pick<AnyD1Database, "query">;

export type D1Client = AnyD1Database & { readonly kind: "d1" };

export interface D1ClientOptions {
  /** Event emitter */
  emit: <T>(name: string, payload?: T) => Promise<void>;
}
