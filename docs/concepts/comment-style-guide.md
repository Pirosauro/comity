# Comment Style Guide

1. Document boundaries, not internals

Write verbose comments only at public boundaries (package entrypoints, setup functions, adapters).
They must explain what the module offers, what it deliberately excludes, and how it is meant to be used.

If it replaces a README section, it belongs here.

2. Comments must state invariants or intent

Inside core logic, comments must describe semantic guarantees or constraints, not implementation steps.

For public APIs, use JSDoc tags to document the contract:

- `@param` explains non-obvious parameter semantics

- `@returns` clarifies success conditions beyond the type

- `@throws` documents exceptional control flow

- `@remarks` captures design decisions affecting usage

- `@example` shows correct patterns and common mistakes

Good comments answer:

- what callers may rely on

- what must never be relied upon

- what is intentionally an implementation detail

3. Never repeat the code

Do not explain what the code does line by line.
If the comment can be derived by reading the function body, delete it.

Comments exist to explain decisions, not syntax.

4. Optimize for misuse prevention

Write comments where misuse would be plausible and dangerous.
If removing a comment could reasonably lead to incorrect usage, the comment is required.

Comments are part of the API contract.
