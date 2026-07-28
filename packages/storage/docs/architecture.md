# @comity/storage — Architecture

`@comity/storage` is organized around storage contracts, built-in stores, and
kernel setup metadata.

## Main areas

- `contracts/` — storage and store contracts
- `error/` — storage error definitions
- `hooks/` — runtime hooks
- `setup/` — module setup and token wiring
- `stores/` — built-in store implementations
- `facade.ts` — default storage facade

## Architectural note

The package stays contract-oriented and leaves external provider integration to
adapters or applications.

