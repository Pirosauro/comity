# @comity/customer

Customer domain abstractions for Comity.

This module provides a database-agnostic customer domain that can be reused by storefronts, CRMs, customer portals, back offices and other applications.

## Features

- Customer model
- Customer profile
- Contact information
- Addresses
- Customer preferences
- Repository contracts
- Customer use cases
- Input validation
- Domain errors

## Design goals

- Database agnostic
- Transport agnostic
- Framework agnostic
- No HTTP dependencies
- No HTML/UI dependencies
- Reusable across applications

Persistence is provided by adapters implementing the repository contracts.

## Typical architecture

Application
↓
Customer Use Cases
↓
Customer Repository
↓
Persistence Adapter

## What this module does NOT provide

- Database implementations
- Authentication
- Authorization
- Sessions
- Password management
- HTTP APIs
- Admin interfaces

Those concerns belong to other Comity modules or adapters.

## Public API

- Models
- Repository contracts
- Use cases
- Validation contracts (if exposed)
- Errors

## Extension points

The module is designed to integrate with:

- @comity/storefront
- @comity/auth
- @comity/media
- CRM systems
- ERP integrations
