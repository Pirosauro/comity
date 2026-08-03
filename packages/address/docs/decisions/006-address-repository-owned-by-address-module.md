# ADR-006 — AddressRepository Owned by Address Module

**Status:** Accepted

## Context

Comity uses a clear pattern: Core Modules define contracts, Adapters implement infrastructure.

An address can be persisted through different technologies:
- SQL database
- Document database
- External API
- ERP
- CRM

The domain module must not know the storage technology.

## Decision

`@comity/address` exposes `AddressRepository` as a contract. It contains no implementations.

```typescript
interface AddressRepository {
  get(id: AddressId): Promise<Result<Address | null, RepositoryError>>;
  save(address: Address): Promise<Result<void, RepositoryError>>;
}
```

The repository exposes `get` and `save` only.
There is no `delete` operation.

Physical deletion is an infrastructure or maintenance concern outside the domain model.

Adapters implement this contract.

## Consequences

**Positive:**
- Clear ownership
- Repository is replaceable
- No coupling with persistence technology
- Consistent with other Comity modules

**Negative:**
- Consumer-specific queries require separate interfaces
- May result in multiple repository interfaces per deployment