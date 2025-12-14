import type { PostgresClient, PostgresService } from "./types.js";
import { Container } from "@comity/core/patterns";

export function createService(
  db: PostgresClient
): Omit<PostgresService, "healthCheck"> {
  const repositories = new Container();
  const partial = {
    select: db.select.bind(db),
    insert: db.insert.bind(db),
    update: db.update.bind(db),
    delete: db.delete.bind(db),
    transaction: db.transaction.bind(db),
    execute: db.execute?.bind(db),
  };

  return {
    ...partial,

    registerRepository: (key, repository) => {
      repositories.register(key, () => new repository(db));
    },

    getRepository: (key) => {
      return repositories.get(key);
    },
  };
}
