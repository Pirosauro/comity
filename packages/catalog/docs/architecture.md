# Architecture - @comity/catalog

## Internal structure

- `index.ts` aggregates public exports.
- `contracts/` defines stable contracts/types.
- `setup/` defines setup/runtime integration surfaces.

## Main flows

- Setup flow: application composition -> setup module -> runtime services/adapters.
- Contract flow: consumer -> module contracts -> concrete implementations in adapters/applications.

## Architecture decisions

- Current classification remains: Core Module.
- No API, export, or dependency-graph modifications are introduced in this phase.

## Boundary

- The package keeps its current ownership and boundaries.
- Any unresolved architecture decisions are tracked as follow-up and not resolved in this documentation phase.
