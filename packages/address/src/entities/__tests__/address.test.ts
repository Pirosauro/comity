import { describe, expect, it, beforeEach } from "vitest";
import { Instant } from "@comity/primitives/time";
import { Address } from "../address.js";
import { AddressId } from "../../value-objects/address-id.js";
import { AddressLine } from "../../value-objects/address-line.js";

const id = new AddressId("addr-1");
const line = new AddressLine("Via Roma 10");

const fields = {
  lines: [line],
  city: "Milano",
  administrativeArea: "MI",
  postalCode: "20100",
  countryCode: "IT",
  label: "home",
  metadata: { department: "sales" },
  contacts: [{ type: "phone", value: "+39 02 1234567" }],
};

function createAddress(overrides?: Partial<typeof fields>) {
  return new Address({ ...fields, ...overrides }, new AddressId("test-id"));
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
      const lines = [new AddressLine("A")];
      const address = new Address({ ...fields, lines }, new AddressId("id"));

      lines.push(new AddressLine("B"));

      expect(address.lines).toHaveLength(1);
    });

    it("should defensive-copy metadata on creation", () => {
      const metadata = { foo: "bar" };
      const address = new Address({ ...fields, metadata }, new AddressId("id"));

      metadata["baz"] = "qux";

      expect(address.metadata).toEqual({ foo: "bar" });
    });

    it("should defensive-copy contacts on creation", () => {
      const contacts = [{ type: "phone", value: "+39" }];
      const address = new Address({ ...fields, contacts }, new AddressId("id"));

      contacts.push({ type: "email", value: "x@y.com" });

      expect(address.contacts).toHaveLength(1);
    });
  });

  describe("update", () => {
    let address: Address;

    beforeEach(() => {
      address = new Address(fields, id);
    });

    it("should update lines", () => {
      address.update({ lines: [new AddressLine("New Street")] });

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
    it("should capture current state with id", () => {
      const address = new Address(fields, id);
      const snapshot = address.snapshot();

      expect(snapshot.id?.toString()).toBe("addr-1");
      expect(snapshot.city).toBe("Milano");
      expect(snapshot.capturedAt).toBeInstanceOf(Instant);
    });

    it("should capture current state without id", () => {
      const address = new Address(fields);
      const snapshot = address.snapshot();

      expect(snapshot.id).toBeUndefined();
    });

    it("should include label, metadata, and contacts in snapshot", () => {
      const address = new Address(fields, id);
      const snapshot = address.snapshot();

      expect(snapshot.label).toBe("home");
      expect(snapshot.metadata).toEqual({ department: "sales" });
      expect(snapshot.contacts).toHaveLength(1);
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