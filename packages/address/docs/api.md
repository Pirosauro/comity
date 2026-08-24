# @comity/address — API Reference

## Public Exports

```text
@comity/address
├── Address (class)
├── AddressId (value object)
├── AddressLine (value object)
├── AddressContact (type)
├── AddressCreate (type)
├── AddressUpdate (type)
├── AddressData (type)
├── AddressFields (type)
├── AddressState (type)
├── AddressSnapshot (type)
├── AddressRepository (contract)
└── AddressValidator (contract)
```

All types exported from `@comity/address` are stable. Types prefixed with `Address` represent parts of the address data model. The `Address` entity class is the primary consumer-facing type.

---

## Address Entity

```ts
class Address {
  constructor(fields: AddressCreate, id?: AddressId);

  get id(): AddressId | undefined;
  get lines(): ReadonlyArray<AddressLine>;
  get city(): string;
  get administrativeArea(): string | null;
  get postalCode(): string;
  get countryCode(): string;
  get label(): string | null;
  get metadata(): Readonly<Record<string, string>> | null;
  get contacts(): ReadonlyArray<AddressContact>;
  get createdAt(): Instant;

  update(changes: AddressUpdate): void;
  snapshot(): AddressSnapshot;
}
```

### Creation

```ts
const address = new Address({
  lines: [AddressLine.create("Via Roma 1")],
  city: "Milano",
  postalCode: "20100",
  countryCode: "IT",
  administrativeArea: null,
  label: null,
  metadata: null,
  contacts: [],
}, AddressId.create("addr-1"));
```

`id` is optional. A newly created address without an id has `id` as `undefined`.

### Update

```ts
address.update({ city: "Roma", postalCode: "00100" });
```

`update` mutates the entity. It returns `void`.

### Snapshot

```ts
const snapshot = address.snapshot();
```

Returns an immutable snapshot with field `capturedAt` rather than `createdAt`. The snapshot separates historical state from live entity state.

---

## AddressId

```ts
class AddressId {
  static create(value: string): Result<AddressId, InvalidIdentifierError>;
  get value(): string;

  equals(other: AddressId): boolean;
  toString(): string;
}
```

Value Objects are created through `create()`, which returns a `Result`. The
constructor is private: an empty or whitespace-only identifier yields an
`empty` failure instead of throwing, so an invalid `AddressId` can never exist.

---

## AddressLine

```ts
class AddressLine {
  static create(value: string): Result<AddressLine, never>;
  get value(): string;

  equals(other: AddressLine): boolean;
  toString(): string;
}
```

Address lines carry no validation: any string is a valid line. Creation is
kept consistent with the Comity Value Object pattern through `create()`, whose
`never` error type signals that creation cannot fail.

---

## AddressSnapshot

```ts
type AddressSnapshot = Readonly<
  AddressFields & {
    readonly id: AddressId | undefined;
    readonly capturedAt: Instant;
  }
>;
```

`AddressSnapshot` is a type, not a class. It is created by calling `address.snapshot()`.

---

## AddressCreate

```ts
type AddressCreate = Omit<AddressFields, "id">;
```

---

## AddressUpdate

```ts
type AddressUpdate = Partial<AddressFields>;
```

---

## AddressData and AddressFields

```ts
interface AddressData {
  readonly lines: ReadonlyArray<AddressLine>;
  readonly city: string;
  readonly administrativeArea: string | null;
  readonly postalCode: string;
  readonly countryCode: string;
}

interface AddressFields extends AddressData {
  readonly label: string | null;
  readonly metadata: Readonly<Record<string, string>> | null;
  readonly contacts: ReadonlyArray<AddressContact>;
}
```

---

## AddressState

```ts
interface AddressState extends AddressData {
  readonly id: AddressId;
}
```

---

## AddressContact

```ts
interface AddressContact {
  readonly type: string;
  readonly value: string;
}
```

---

## AddressRepository

```ts
interface AddressRepository {
  get(id: AddressId): Promise<Result<Address | null, RepositoryError>>;
  save(address: Address): Promise<Result<void, RepositoryError>>;
}
```

---

## AddressValidator

```ts
interface AddressValidator {
  validate(address: Address): Result<void>;
}
```

`Result` is imported from `@comity/primitives/result`. The validator is an extension point exposed as a contract; implementations belong to adapters.

---

## Dependencies

```
@comity/address depends on @comity/primitives
```

Must not depend on:

- `@comity/address-geography`
- `@comity/address-formatters`
- `@comity/address-validation-*`
- Any validation library
- Any database driver
- Any UI or HTTP framework