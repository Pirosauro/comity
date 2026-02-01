# ADR: Kysely as SQL execution engine

## Decision

Use Kysely ORM internally as the SQL execution engine.

## Rationale

- Strong typing
- Broad database support
- Minimal runtime overhead
- Good alignment with Comity's explicitness principles

## Consequences

- Kysely is not exposed publicly
- Applications are insulated from ORM changes
- Swapping the adapter remains possible
