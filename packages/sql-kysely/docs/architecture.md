# Architecture

`@comity/sql-kysely` follows a strict adapter architecture.

```text
Application / Domain
↓
@comity/sql
↓
@comity/sql-kysely
↓
Kysely ORM
↓
SQL Database
```

## Key principles

### Adapter purity

The adapter:

- translates Comity contracts into Kysely calls
- translates Kysely errors into `SqlError`

It does not:

- introduce new abstractions
- leak Kysely types
- embed domain logic

### Capability-based transactions

Transactions are represented explicitly via `SqlTransaction`.
No ambient or implicit transaction context exists.

### Error normalization

All failures are converted to canonical `SqlError` instances.
Raw Kysely or driver errors never escape the adapter.

## Execution flow

```text
SqlClient.query()
    ↓
Kysely execution
    ↓
Error mapping
    ↓
SqlResult
```

Transactions follow the same flow but are scoped to a single transaction context.
