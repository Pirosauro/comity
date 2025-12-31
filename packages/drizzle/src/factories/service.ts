import type { DrizzleAlikeQueryBuilder, DrizzleService } from "../types.js";
import { sql } from "drizzle-orm";
import { Container } from "@comity/core/primitives";
import { RepositoryRegistry } from "../registry.js";
import { DRIZZLE_KIND, HEALTH_THRESHOLDS } from "../constants.js";

export function createDrizzleService<
  DB extends Pick<DrizzleAlikeQueryBuilder, "execute" | typeof DRIZZLE_KIND>
>(db: DB): DrizzleService<DB> {
  const repositories = new RepositoryRegistry(new Container());
  const kind = db[DRIZZLE_KIND] ?? "unknown";

  return {
    kind,

    registerRepository: (key, factory) => {
      repositories.register(key, () => factory(db));
    },

    getRepository: (key) => {
      return repositories.get(key);
    },

    healthCheck: async () => {
      const timestamp = new Date().toISOString();

      try {
        const start = performance.now(); // Semantic clarity and better precision than Date.now();

        // Simple connectivity test
        await db.execute(sql`SELECT 1`);

        const latency = performance.now() - start;

        // Check latency against health thresholds
        if (latency >= HEALTH_THRESHOLDS.unhealthyMs) {
          return {
            status: "unhealthy",
            timestamp,
            details: {
              latency,
              reason: "Database response too slow",
            },
          };
        }

        // Check for degraded status
        if (latency >= HEALTH_THRESHOLDS.degradedMs) {
          return {
            status: "degraded",
            timestamp,
            details: {
              latency,
            },
          };
        }

        // Check for healthy status
        return {
          status: "healthy",
          timestamp,
          details: {
            latency,
          },
        };
      } catch (error) {
        // On error, return unhealthy status with error details
        return {
          status: "unhealthy",
          timestamp,
          details: {
            error: error instanceof Error ? error.message : "Unknown error",
          },
        };
      }
    },
  };
}
