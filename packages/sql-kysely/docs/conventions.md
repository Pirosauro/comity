# @comity/sql-kysely — Conventions

`@comity/sql-kysely` is a thin adapter.

## Rules

- depend on `@comity/sql` and `@comity/kernel`
- keep Kysely-specific details inside the adapter boundary
- normalize driver failures into `SqlError`
- do not leak Kysely types into the domain boundary

