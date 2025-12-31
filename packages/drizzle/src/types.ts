import type { SQL } from "drizzle-orm";
import type { DRIZZLE_KIND } from "./constants.js";

export interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy" | "unknown";

  timestamp: string;

  details?: Record<string, unknown>;
}

export type DrizzleKind = "d1" | "postgres";

export interface DrizzleService<DB> {
  readonly kind: DrizzleKind | "unknown";

  /**  */
  registerRepository<T>(key: string, factory: (db: DB) => T): void;

  /** */
  getRepository<T>(key: string): T;

  /**  */
  healthCheck(): Promise<HealthStatus>;
}

export interface DrizzleAlikeQueryBuilder {
  [DRIZZLE_KIND]: DrizzleKind;

  limit(n: number): DrizzleAlikeQueryBuilder;

  offset(n: number): DrizzleAlikeQueryBuilder;

  execute(sql: SQL): Promise<unknown> | unknown;
}

interface QueryBaseEvent {
  id: string;
  adapter: DrizzleKind;
  timestamp: string; // ISO
  startedAt: number;
}

export interface QueryStartEvent extends QueryBaseEvent {
  event: "start";
}

export interface QueryEndEvent extends QueryBaseEvent {
  event: "end";
  finishedAt: number;
  duration: number;
}

export interface QueryErrorEvent extends QueryBaseEvent {
  event: "error";
  finishedAt: number;
  duration: number;
  error: unknown;
}

export type DrizzleModuleHooks = {
  "@comity/drizzle:initialized": DrizzleService<unknown>;

  "@comity/drizzle:shutdown": string;
};

export type DrizzleModuleEvents = {
  "@comity/drizzle:error": { error: Error };

  "@comity/drizzle:query": QueryStartEvent | QueryEndEvent | QueryErrorEvent;
};
