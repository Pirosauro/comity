# @comity/address

Address domain abstractions for Comity.

## Installation

```sh
npm install @comity/address
```

## Usage

```typescript
import { Address, AddressId, AddressLine } from "@comity/address";

const address = new Address({
  lines: [new AddressLine("Via Roma 10")],
  city: "Milano",
  administrativeArea: "MI",
  postalCode: "20100",
  countryCode: "IT",
  label: null,
  metadata: null,
  contacts: [],
}, new AddressId("addr-1"));

address.update({ city: "Roma" });

const snapshot = address.snapshot();
```

## Public API

| Export              | Description                            |
| ------------------- | -------------------------------------- |
| `Address`           | Mutable address entity                 |
| `AddressId`         | Address identifier value object        |
| `AddressLine`       | Single address line value object       |
| `AddressSnapshot`   | Immutable point-in-time address type   |
| `AddressContact`    | Contact info associated with address   |
| `AddressCreate`     | Data required to create new Address    |
| `AddressUpdate`     | Partial update data for Address        |
| `AddressData`       | Core address data                      |
| `AddressFields`     | Address data with label/metadata/contacts |
| `AddressState`      | AddressData extended with id           |
| `AddressRepository` | Repository contract                    |
| `AddressValidator`  | Validation contract                    |

## License

MIT