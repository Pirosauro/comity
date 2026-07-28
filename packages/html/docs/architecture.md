# @comity/html — Architecture

`@comity/html` is organized around a small rendering pipeline.

---

## Package Structure

- `contracts/` defines public HTML concepts
- `error/` defines package-scoped rendering errors
- `hooks/` exposes lifecycle-related observability points
- the root entrypoint re-exports the public surface

---

## Runtime Flow

1. A renderer receives structured inputs.
2. The renderer pipeline assembles the document state.
3. The document writer produces the final HTML output.
4. Layout information remains explicit throughout the flow.

---

## Boundary Rules

- the package does not load data
- the package does not know about repositories
- the package does not depend on application-specific view logic

---

## Internal Responsibility

The implementation can change, but the public contracts must remain stable enough for renderers and adapters to compose against them.
