# Address Module Agent Instructions

This package owns address domain concepts.

Important rules:

- Address is a mutable entity.
- AddressSnapshot is immutable.
- Country-specific logic does not belong here.
- Geography enrichment belongs to @comity/address-geography.
- Formatting belongs to @comity/address-formatters.
- Validation libraries must never be imported directly.

Never create:

- ItalyAddress
- ChinaAddress
- ShippingAddress
- BillingAddress

Use generic address concepts.
