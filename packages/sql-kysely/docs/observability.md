# Observability

This adapter optionally supports lifecycle hooks exposed by `@comity/sql`.

## Characteristics

- Best-effort only
- No guarantees of delivery
- No built-in metrics backend

## Typical signals

- query started
- query completed
- query failed
- transaction started
- transaction committed / rolled back

Observability must never affect correctness.
