import type { Pool } from "pg";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { PostgresHealthCheck } from "./types.js";

/**
 * Database health check utilities
 *
 * Provides comprehensive health monitoring for PostgreSQL connections,
 * connection pools, and database responsiveness.
 */

/**
 * Performs a comprehensive health check on database connections
 *
 * @param primary - Primary database instance
 * @param replica - Replica database instance
 * @param primaryPool - Primary connection pool
 * @param replicaPool - Replica connection pool
 * @returns Promise resolving to detailed health check results
 *
 * @example
 * ```typescript
 * const health = await performHealthCheck(primary, replica, primaryPool, replicaPool);
 * if (health.status === 'unhealthy') {
 *   console.error('Database health check failed:', health);
 * }
 * ```
 */
export async function performHealthCheck(
  primary: NodePgDatabase<Record<string, never>> & { $client: Pool },
  replicas: (NodePgDatabase<Record<string, never>> & { $client: Pool })[]
): Promise<PostgresHealthCheck> {
  const timestamp = new Date().toISOString();
  // Test primary database
  const primaryHealth = await testPostgresConnection(primary.$client);
  // Test replicas database (only if different from primary)
  const replicasHealth = await Promise.all(
    replicas.map((r) => testPostgresConnection(r.$client))
  );
  // Get pool statistics
  const poolStats = {
    primary: getPoolStats(primary.$client),
    replicas: replicas.map((pool) => getPoolStats(pool.$client)),
  };
  // Determine overall status
  const status = determineOverallStatus(primaryHealth, replicasHealth);

  return {
    status,
    primary: primaryHealth,
    replicas: replicasHealth,
    poolStats,
    timestamp,
  };
}

/**
 * Tests a single database connection's health
 *
 * @param pool - Pool instance to test
 * @param name - Name identifier for logging
 * @returns Promise resolving to connection health status
 */
async function testPostgresConnection(
  pool: Pool
): Promise<PostgresHealthCheck["primary"]> {
  try {
    const start = performance.now(); // Semantic clarity and better precision than Date.now();

    // Simple connectivity test
    await pool.query("SELECT 1");

    const latency = performance.now() - start;

    return {
      status: "connected",
      latency,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return {
      status: "error",
      error: message,
    };
  }
}

/**
 * Gets connection pool statistics
 *
 * @param pool - PostgreSQL connection pool
 * @returns Pool statistics object
 */
function getPoolStats(pool: Pool): PostgresHealthCheck["poolStats"]["primary"] {
  return {
    total: pool.totalCount,
    idle: pool.idleCount,
    waiting: pool.waitingCount,
  };
}

/**
 * Determines overall database health status based on individual connection health
 *
 * @param primaryHealth - Primary database health status
 * @param replicaHealth - Replica database health status
 * @returns Overall health status
 */
function determineOverallStatus(
  primaryHealth: PostgresHealthCheck["primary"],
  replicasHealth: PostgresHealthCheck["replicas"]
): PostgresHealthCheck["status"] {
  // Primary must be healthy for overall health
  if (primaryHealth.status === "error") {
    return "unhealthy";
  }

  // If replica has issues but primary is ok, consider degraded
  if (replicasHealth.some((r) => r.status === "error")) {
    return "degraded";
  }

  // Check latency thresholds
  const primaryLatency = primaryHealth.latency || 0;
  const replicasLatency = replicasHealth.map((r) => r.latency || 0);

  // Consider degraded if latency is too high (> 1000ms)
  if (primaryLatency > 1000 || replicasLatency.some((r) => r > 1000)) {
    return "degraded";
  }

  return "healthy";
}
