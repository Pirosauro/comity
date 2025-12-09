import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { LoggerService } from "@comity/logger";

export function wrapTransaction(db: NodePgDatabase, logger: LoggerService) {
  const originalTransaction = db.transaction.bind(db);

  db.transaction = async function (fn, ...args) {
    const start = performance.now();

    logger.info("Transaction started");

    try {
      const result = await originalTransaction(fn, ...args);
      const duration = performance.now() - start;

      logger.info(`Transaction succeeded in ${duration}ms`);

      return result;
    } catch (error) {
      const duration = performance.now() - start;

      logger.error({ error }, `Transaction failed after ${duration}ms`);

      throw error;
    }
  };
}
