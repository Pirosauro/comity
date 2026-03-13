# Transactions

`@comity/sql-kysely` implements transactions using Kysely's transaction API.

## Behavior

- Transactions are explicit
- Nested transactions are not created unless Kysely guarantees correctness
- Rollback occurs automatically on error

## Example

```ts
await sql.transaction(async (tx) => {
  await tx.query(...);
});
```

## Guarantees

- A transaction is either fully committed or rolled back
- Errors inside a transaction are normalized before propagation
