# Decision: Primitives are concept-only

## Context

Shared modules often drift into helpers or orchestration, creating instability and hidden coupling.

## Decision

Primitives define semantic contracts only. They exclude policy, orchestration, side effects, and environment-specific behavior.

## Consequences

- APIs remain stable and predictable over time.
- Convenience layers and behaviors live in higher-level packages.
- Documentation emphasizes intent and constraints rather than implementation.
