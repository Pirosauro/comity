# Decision: Errors as data

## Context

SQL operations can fail routinely (constraint violations, network issues). Throwing exceptions couples control flow and leaks implementation details.

## Decision

Represent failures as structured data (`SqlError`) inside `SqlOperationResult`, rather than throwing exceptions.

## Consequences

- Enables explicit, predictable control flow
- Simplifies testing and error handling
- Reduces accidental leakage in logs and events
- Adapters may still throw for truly exceptional conditions (misconfiguration, invariant violations)
