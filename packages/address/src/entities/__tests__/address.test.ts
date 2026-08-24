import { describe, expect, it, beforeEach } from "vitest";
import { isFailure } from "@comity/primitives/result";
import { Instant } from "@comity/primitives/time";
import { Address } from "../address.js";
import { AddressId } from "../../value-objects/address-id.js";
import { AddressLine } from "../../value-objects/address-line.js";

function makeAddressId(value: string): AddressId {
  const result = AddressId.create(value);

  if (isFailure(result)) {
    throw new Error("Unexpected failure");
  }

  return result.value;
}

function makeAddressLine(value: string): AddressLine {
  const result = AddressLine.create(value);

  if (isFailure(result)) {
    throw new Error("Unexpected failure");
  }

  return result.value;
}

const id = makeAddressId("addr-1");
const line = makeAddressLine("Via Roma 10");

const persistedCreatedAt = Instant.fromEpochMilliseconds(1_700_000_000_000);
const persistedUpdatedAt = Instant.fromEpochMilliseconds(1_700_000_500_000);
const hydratedCreatedAt = Instant.fromEpochMilliseconds(1_500_000_000_000);
const hydratedUpdatedAt = Instant.fromEpochMilliseconds(1_600_000_000_000);

const fields = {
  lines: [line],
  city: "Milano",
  administrativeArea: "MI",
  postalCode: "20100",
  countryCode: "IT",
  label: "home",
  metadata: { department: "sales" },
  contacts: [{ type: "phone", value: "+39 02 1234567" }],
  createdAt: persistedCreatedAt,
};

function createAddress(overrides?: Partial<typeof fields>) {
  return new Address({ ...fields, ...overrides }, makeAddressId("test-id"));
}

describe("Address", () => {
  describe("creation", () => {
    it("should initialize all fields correctly", () => {
      const address = new Address(fields, id);

      expect(address.id?.toString()).toBe("addr-1");
      expect(address.lines).toHaveLength(1);
      expect(address.city).toBe("Milano");
      expect(address.administrativeArea).toBe("MI");
      expect(address.postalCode).toBe("20100");
      expect(address.countryCode).toBe("IT");
      expect(address.label).toBe("home");
      expect(address.metadata).toEqual({ department: "sales" });
      expect(address.contacts).toHaveLength(1);
      expect(address.createdAt).toBeInstanceOf(Instant);
    });

    it("should allow creation without id", () => {
      const address = new Address(fields);

      expect(address.id).toBeUndefined();
    });

    it("should defensive-copy arrays on creation", () => {
      const lines = [makeAddressLine("A")];
      const address = new Address({ ...fields, lines }, makeAddressId("id"));

      lines.push(makeAddressLine("B"));

      expect(address.lines).toHaveLength(1);
    });

    it("should defensive-copy metadata on creation", () => {
      const metadata = { foo: "bar" };
      const address = new Address({ ...fields, metadata }, makeAddressId("id"));

      metadata["baz"] = "qux";

      expect(address.metadata).toEqual({ foo: "bar" });
    });

    it("should defensive-copy contacts on creation", () => {
      const contacts = [{ type: "phone", value: "+39" }];
      const address = new Address({ ...fields, contacts }, makeAddressId("id"));

      contacts.push({ type: "email", value: "x@y.com" });

      expect(address.contacts).toHaveLength(1);
    });
  });

  describe("hydration", () => {
    it("should generate createdAt at construction when not supplied", () => {
      const withoutTimestamp = {
        lines: [line],
        city: "Roma",
        administrativeArea: "RM",
        postalCode: "00100",
        countryCode: "IT",
        label: null,
        metadata: null,
        contacts: [],
        createdAt: undefined,
      };

      const address = new Address(withoutTimestamp as never, makeAddressId("id"));

      expect(address.createdAt).toBeInstanceOf(Instant);
    });

    it("should default updatedAt to createdAt when neither is supplied", () => {
      const withoutTimestamp = {
        lines: [line],
        city: "Roma",
        administrativeArea: "RM",
        postalCode: "00100",
        countryCode: "IT",
        label: null,
        metadata: null,
        contacts: [],
        createdAt: undefined,
      };

      const address = new Address(withoutTimestamp as never, makeAddressId("id"));

      expect(address.updatedAt.epochMilliseconds).toBe(address.createdAt.epochMilliseconds);
    });

    it("should default updatedAt to createdAt when only createdAt is supplied", () => {
      const address = new Address(
        {
          ...fields,
          createdAt: persistedCreatedAt,
        },
        makeAddressId("id")
      );

      expect(address.updatedAt.epochMilliseconds).toBe(persistedCreatedAt.epochMilliseconds);
    });

    it("should preserve a supplied createdAt during hydration", () => {
      const address = new Address(
        {
          ...fields,
          createdAt: hydratedCreatedAt,
        },
        makeAddressId("id")
      );

      expect(address.createdAt.epochMilliseconds).toBe(hydratedCreatedAt.epochMilliseconds);
    });

    it("should preserve a supplied updatedAt during hydration", () => {
      const address = new Address(
        {
          ...fields,
          createdAt: hydratedCreatedAt,
          updatedAt: hydratedUpdatedAt,
        },
        makeAddressId("id")
      );

      expect(address.updatedAt.epochMilliseconds).toBe(hydratedUpdatedAt.epochMilliseconds);
    });

    it("should preserve all persisted lifecycle metadata during hydration", () => {
      const address = new Address(
        {
          ...fields,
          createdAt: hydratedCreatedAt,
          updatedAt: hydratedUpdatedAt,
        },
        makeAddressId("hydrated-1")
      );

      expect(address.id?.toString()).toBe("hydrated-1");
      expect(address.createdAt.epochMilliseconds).toBe(hydratedCreatedAt.epochMilliseconds);
      expect(address.updatedAt.epochMilliseconds).toBe(hydratedUpdatedAt.epochMilliseconds);
    });

    it("should not regenerate createdAt across the lifetime of the entity", () => {
      const address = new Address({ ...fields, createdAt: hydratedCreatedAt }, makeAddressId("id"));
      const original = address.createdAt;

      address.update({ city: "Roma" });

      expect(address.createdAt).toBe(original);
    });

    it("should preserve a persisted updatedAt that differs from createdAt", () => {
      const address = new Address(
        {
          ...fields,
          createdAt: hydratedCreatedAt,
          updatedAt: hydratedUpdatedAt,
        },
        makeAddressId("id")
      );

      expect(address.createdAt.epochMilliseconds).toBe(hydratedCreatedAt.epochMilliseconds);
      expect(address.updatedAt.epochMilliseconds).toBe(hydratedUpdatedAt.epochMilliseconds);
      expect(address.updatedAt.epochMilliseconds).not.toBe(address.createdAt.epochMilliseconds);
    });
  });

  describe("update", () => {
    let address: Address;

    beforeEach(() => {
      address = new Address(fields, id);
    });

    it("should update lines", () => {
      address.update({ lines: [makeAddressLine("New Street")] });

      expect(address.lines).toHaveLength(1);
      expect(address.lines[0]?.toString()).toBe("New Street");
    });

    it("should update city", () => {
      address.update({ city: "Roma" });

      expect(address.city).toBe("Roma");
    });

    it("should update administrative area", () => {
      address.update({ administrativeArea: "RM" });

      expect(address.administrativeArea).toBe("RM");
    });

    it("should update to null administrative area", () => {
      address.update({ administrativeArea: null });

      expect(address.administrativeArea).toBeNull();
    });

    it("should update postal code", () => {
      address.update({ postalCode: "00100" });

      expect(address.postalCode).toBe("00100");
    });

    it("should update country code", () => {
      address.update({ countryCode: "FR" });

      expect(address.countryCode).toBe("FR");
    });

    it("should update label", () => {
      address.update({ label: "office" });

      expect(address.label).toBe("office");
    });

    it("should update to null label", () => {
      address.update({ label: null });

      expect(address.label).toBeNull();
    });

    it("should update metadata", () => {
      address.update({ metadata: { key: "value" } });

      expect(address.metadata).toEqual({ key: "value" });
    });

    it("should update to null metadata", () => {
      address.update({ metadata: null });

      expect(address.metadata).toBeNull();
    });

    it("should update contacts", () => {
      const contacts = [{ type: "email", value: "test@example.com" }];
      address.update({ contacts });

      expect(address.contacts).toHaveLength(1);
    });

    it("should update multiple fields at once", () => {
      address.update({ city: "Roma", postalCode: "00100" });

      expect(address.city).toBe("Roma");
      expect(address.postalCode).toBe("00100");
      expect(address.countryCode).toBe("IT");
    });

    it("should not change fields that are not updated", () => {
      address.update({});

      expect(address.city).toBe("Milano");
      expect(address.postalCode).toBe("20100");
    });
  });

  describe("snapshot", () => {
    it("should snapshot a persisted address with its id", () => {
      const address = new Address(fields, id);
      const snapshot = address.snapshot();

      expect(snapshot.id?.toString()).toBe("addr-1");
      expect(snapshot.city).toBe("Milano");
      expect(snapshot.capturedAt).toBeInstanceOf(Instant);
    });

    it("should snapshot a non-persisted address without an id", () => {
      const address = new Address(fields);
      const snapshot = address.snapshot();

      expect(snapshot.id).toBeUndefined();
      expect(snapshot.city).toBe("Milano");
    });

    it("should include label, metadata, and contacts in snapshot", () => {
      const address = new Address(fields, id);
      const snapshot = address.snapshot();

      expect(snapshot.label).toBe("home");
      expect(snapshot.metadata).toEqual({ department: "sales" });
      expect(snapshot.contacts).toHaveLength(1);
    });

    it("should expose the entity createdAt in the snapshot", () => {
      const address = new Address(fields, id);
      const snapshot = address.snapshot();

      expect(snapshot.createdAt.epochMilliseconds).toBe(persistedCreatedAt.epochMilliseconds);
      expect(snapshot.createdAt).not.toBe(snapshot.capturedAt);
    });

    it("should expose the entity updatedAt in the snapshot", () => {
      const address = new Address(
        { ...fields, updatedAt: persistedUpdatedAt },
        id
      );
      const snapshot = address.snapshot();

      expect(snapshot.updatedAt.epochMilliseconds).toBe(persistedUpdatedAt.epochMilliseconds);
    });

    it("should be immutable after mutation of source", () => {
      const address = createAddress();
      const snapshot = address.snapshot();

      address.update({ city: "Roma" });

      expect(snapshot.city).toBe("Milano");
    });

    it("should return a new object each call", () => {
      const address = createAddress();

      expect(address.snapshot()).not.toBe(address.snapshot());
    });
  });

  describe("defensive getters", () => {
    it("should return defensive copies for lines", () => {
      const address = createAddress();
      const lines = address.lines;

      expect(lines).not.toBe(address.lines);
    });

    it("should return defensive copies for metadata", () => {
      const address = createAddress({ metadata: { key: "val" } });
      const meta = address.metadata;

      expect(meta).not.toBe(address.metadata);
    });

    it("should return null metadata without crash", () => {
      const address = createAddress({ metadata: null });

      expect(address.metadata).toBeNull();
    });

    it("should return defensive copies for contacts", () => {
      const address = createAddress();
      const contacts = address.contacts;

      expect(contacts).not.toBe(address.contacts);
    });
  });
});