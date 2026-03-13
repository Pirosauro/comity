# Decision: Errors as data

SQL failures are represented as typed data structures, not thrown exceptions.

Rationale:

- predictable control flow
- easier testing
- explicit error handling
- safer logging (no accidental leakage)

Adapters MAY throw in truly exceptional situations (misconfiguration, invariant violations),
but normal SQL failures MUST be returned as structured errors.
