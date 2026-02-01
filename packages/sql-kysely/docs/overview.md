# @comity/sql-kysely

`@comity/sql-kysely` is a concrete SQL adapter for the Comity framework,
built on top of Kysely ORM.

This package implements the contracts defined in `@comity/sql` and delegates
actual query execution to Kysely, while preserving Comity principles:
explicitness, capability-based design, and strict separation between domain and infrastructure.

## What this package is

- A **thin adapter** between `@comity/sql` and Kysely ORM
- Responsible for:
  - executing SQL queries
  - managing transactions
  - normalizing errors into `SqlError`
  - optionally emitting lifecycle signals

## What this package is NOT

- ❌ An ORM
- ❌ A repository framework
- ❌ A domain abstraction layer
- ❌ A Kysely wrapper meant to be used directly by applications

Applications should depend only on `@comity/sql` contracts, never on Kysely.

## Usage

```ts
import { createKyselySqlClient } from "@comity/sql-kysely";

const sql = createKyselySqlClient({
  client: kyselyClient,
});
```
