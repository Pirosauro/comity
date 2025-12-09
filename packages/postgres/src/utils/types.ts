/**
 * Health check result for database connections
 */
export interface PostgresHealthCheck {
  /** Overall database health status */
  status: "healthy" | "degraded" | "unhealthy" | "unknown";

  /** Primary database connection status */
  primary: {
    status: "connected" | "disconnected" | "error" | "unknown";
    latency?: number;
    error?: string;
  };

  /** Replica database connection status */
  replicas: {
    status: "connected" | "disconnected" | "error" | "unknown";
    latency?: number;
    error?: string;
  }[];

  /** Connection pool statistics */
  poolStats: {
    primary: {
      total: number;
      idle: number;
      waiting: number;
    };
    replicas: {
      total: number;
      idle: number;
      waiting: number;
    }[];
  };

  /** Timestamp of the health check */
  timestamp: string;
}
