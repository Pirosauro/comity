# Customer Module Skill

## Purpose

The Customer module models customer information independently from storage, transport and presentation.

It represents the customer domain, not an application.

---

## Responsibilities

The module owns:

- Customer identity
- Customer profile
- Contact information
- Addresses
- Preferences
- Customer lifecycle
- Validation
- Repository contracts
- Customer use cases

---

## Non Responsibilities

This module must never implement:

- Authentication
- Authorization
- Sessions
- Password hashing
- JWT
- HTTP
- GraphQL
- SQL
- Rendering
- Storefront logic

Those belong to other modules.

---

## Architectural Rules

The module is a Core Module.

It:

- may depend on @comity/primitives
- may depend on @comity/kernel only if runtime integration is required
- must not depend on adapters
- must not depend on applications

---

## Domain Model

Customer

↓

Profile

↓

Contacts

↓

Addresses

↓

Preferences

The aggregate root is Customer.

Everything else belongs to the customer aggregate.

---

## Repository Philosophy

Repositories expose customer persistence.

Repositories never expose SQL, ORM or HTTP concepts.

Repositories return Result<T, RepositoryError>.

---

## Validation

Validation is part of the customer domain.

Validation must occur before persistence.

Repositories assume validated input.

The validation implementation is intentionally unspecified and must not require a specific validation library.

---

## Use Cases

Use cases orchestrate repositories.

Typical examples:

- CreateCustomer
- UpdateCustomer
- DeleteCustomer
- GetCustomer
- SearchCustomers

Use cases never know how persistence works.

---

## Errors

Errors are domain errors.

Examples:

- CustomerNotFound
- DuplicateCustomer
- InvalidCustomer
- InvalidAddress

Infrastructure errors are normalized into RepositoryError.

---

## Extension Strategy

New capabilities should be added through composition.

Examples:

Customer

- Loyalty
- GDPR
- Marketing Preferences

Avoid creating monolithic customer objects.

---

## Future Integrations

Designed to work with:

- Storefront
- CRM
- Admin
- ERP
- Marketing Automation

without changing the public contracts.
