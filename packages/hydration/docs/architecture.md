# @comity/hydration — Architecture

`@comity/hydration` is organized around a small island-hydration workflow.

---

## Package Structure

- `contracts/` defines island, strategy, discovery, and hydration interfaces
- `controller.ts` orchestrates hydration behavior
- `serializer.ts` handles contract serialization and parsing
- `client/` contains browser-facing helpers
- `lifecycle/` contains lifecycle integration
- `internal/` contains implementation helpers

---

## Runtime Flow

1. An island contract is discovered or constructed.
2. The contract is serialized when needed.
3. The hydration controller and adapters resolve the correct hydration path.
4. The island is hydrated or rendered according to the selected strategy.

---

## Boundary Rules

- the package does not render full HTML documents
- the package does not fetch application data
- framework-specific behavior belongs in adapter packages

---

## Stability Notes

The public contract layer is the stable surface.
Implementation details inside `internal/` may evolve independently.
