# Observability

@comity/sql exposes optional lifecycle hooks for observability.

These hooks:

- are synchronous
- must never throw
- must never alter control flow

They exist solely for logging, metrics, and tracing.
