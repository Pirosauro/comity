# @comity/address

Address domain abstractions for Comity.

## Installation

```sh
npm install @comity/address
```

## Usage

```typescript
import { Address, AddressId, AddressLine } from "@comity/address";
import { Instant } from "@comity/primitives/time";

const address = new Address({
  lines: [new AddressLine("Via Roma 10")],
  city: "Milano",
  administrativeArea: "MI",
  postalCode: "20100",
  countryCode: "IT",
  label: null,
  metadata: null,
  contacts: [],
  createdAt: Instant.now(),
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
| `AddressCreate`     | Data required to create or hydrate an Address |
| `AddressUpdate`     | Partial update data for Address        |
| `AddressData`       | Core address data                      |
| `AddressState`      | Persistent state (`AddressData` + id + lifecycle metadata) |
| `AddressRepository` | Repository contract                    |
| `AddressValidator`  | Validation contract                    |

## License

MIT