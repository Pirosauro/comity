# ADR-001 — Address as Domain Core Module

**Status:** Accepted

## Context

Comity requires a strict separation between domain contracts, infrastructure implementations, application logic, and external integrations.

An address is used by multiple bounded contexts:
- Customer
- Order
- Shipment
- Billing
- Organization
- Logistics

None of these domains should own their own address representation. Duplication would produce divergent models like `CustomerAddress`, `OrderAddress`, `ShippingAddress`, `BillingAddress`, and `CompanyAddress`, leading to inconsistency and difficult evolution.

## Decision

`@comity/address` is defined as a **Core Module** in Comity's layering model.

The module owns the address conceptual model and defines the stable contracts used by all other modules.

## Responsibilities

**@comity/address owns:**
- Address entity and value objects
- Address identity
- Address snapshots
- Address repository contract
- Address validation contract
- Address types (AddressData, AddressFields, AddressCreate, AddressUpdate, AddressContact, etc.)

**@comity/address does not own:**
- Country-specific rules
- Postal formatting
- Validation libraries
- Persistence implementation
- Domain errors (all errors come from @comity/primitives)
- Customer relationship
- Order relationship
- Shipping logic
- Billing logic
- UI representation
- HTTP/API mapping
- Address lifecycle (active, archived)

## Dependency direction

Allowed:
```
Customer / Order / Shipment / Billing
    ↓
@comity/address
    ↓
@comity/primitives
```

Forbidden:
```
@comity/address → Customer
@comity/address → Magento
@comity/address → React
```

## Consequences

**Positive:**
- Address ownership is centralized
- All consumers share the same domain language
- Infrastructure remains replaceable
- Country-specific behavior can evolve independently
- Future modules can reuse the same contract

**Negative:**
- The module must remain generic
- Some business-specific concepts must remain outside
- Consumers may require additional domain wrappers around Address