# ADR-008 — Generic Address Contacts

**Status:** Accepted

## Context

An address may carry contact information such as a phone number, fax number, or email.

If the module defines an enumeration of valid contact types, it would need to evolve that enumeration every time a new communication channel emerges. This is not sustainable for a domain module.

## Decision

Address contacts are modeled as generic `type`/`value` pairs without a predefined taxonomy:

```typescript
interface AddressContact {
  type: string;
  value: string;
}
```

The module does not:

- define an enumeration of valid contact types
- assign business meaning to any contact type
- enforce required or optional contacts
- validate contact value formats (e.g., phone number syntax)

Consumers decide which contact types they support and how to interpret them.

## Consequences

**Positive:**
- No perpetual contact taxonomy to maintain
- New communication channels require no module changes
- Consumers remain free to define their own contact semantics

**Negative:**
- No built-in type safety for contact types
- Structural validation of contacts is deferred to consumers