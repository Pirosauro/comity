# Decision: Stability over convenience

## Context

Convenience APIs create churn and hidden coupling, undermining the stability expected from primitives.

## Decision

Once documented as public, primitives are stable by default. Convenience APIs are excluded to preserve clarity and long-term maintainability.

## Consequences

- Breaking changes require strong justification.
- Consumers rely on predictable contracts across versions.
- Helper layers belong in dedicated, non-primitive packages.
