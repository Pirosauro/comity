## Core Error Handling Context (Authoritative)

You are working within the **Comity Core** architecture.

### Fundamental Rule

Errors are **domain objects**, not transport-layer artifacts.

### Base Class

All domain errors **MUST** extend `BaseError` from `@comity/core`.

```ts
export abstract class BaseError extends Error {
  abstract readonly code: string;
  readonly meta: Record<string, unknown>;

  protected constructor(message: string, meta: Record<string, unknown>) {
    super(message);
    this.meta = Object.freeze(meta);
  }
}
```

### Error Codes

- MUST be **stable and machine-readable**
- MUST follow the format:  
  `<namespace>:<failure_kind>`
- Example:
  ```ts
  readonly code = "core:invalid_input";
  ```
- Codes MUST describe **semantic failure categories**, not HTTP or framework concepts.

### Naming Rules

- Error class names MUST describe **domain semantics**, not transport-layer terms.
- ❌ Do NOT use HTTP-derived names (e.g. `UnprocessableEntityError`)
- ✅ Use semantic names:
  - `InvalidInputError`
  - `DomainViolationError`
  - `ConflictError`
  - `UnauthorizedError`

### Core Error Taxonomy (Canonical)

| Code                     | Meaning                      | Typical HTTP Mapping (adapter only) |
| ------------------------ | ---------------------------- | ----------------------------------- |
| core:bad_request         | Input not interpretable      | 400                                 |
| core:invalid_input       | Input understood but invalid | 422                                 |
| core:domain_violation    | Domain invariant violated    | 422                                 |
| core:unauthorized        | Authentication required      | 401                                 |
| core:forbidden           | Access denied                | 403                                 |
| core:not_found           | Resource missing             | 404                                 |
| core:conflict            | State conflict               | 409                                 |
| core:rate_limited        | Request rate exceeded        | 429                                 |
| core:service_unavailable | Temporary unavailability     | 503                                 |
| core:internal            | Internal failure             | 500                                 |

### Message and Metadata

- Error messages MUST be **human-readable and immutable**
- Variable or contextual information MUST go in `meta`
- `meta` MAY include:
  - identifiers
  - state
  - field names
  - suggested `httpStatus`
- Messages MUST NOT be dynamically composed.

### When to Create a New Error Class

Create a new error class **ONLY IF**:

- it represents a **stable semantic failure**
- it has a **distinct machine-readable code**
- it may be **handled programmatically**
- it crosses module or layer boundaries

Avoid creating error classes for one-off or purely local failures.

### Prohibited Practices

- ❌ Throwing strings or generic `Error`
- ❌ Encoding variable data in the message
- ❌ Using transport-layer terminology in core errors
- ❌ Creating many fine-grained error classes

Always prefer **few, coarse-grained, stable error types** with rich metadata.
