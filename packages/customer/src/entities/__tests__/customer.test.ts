import type { CustomerCreate } from "../../contracts/customer.js";

import { Instant } from "@comity/primitives/time";
import { beforeEach, describe, expect, it } from "vitest";
import { CustomerId } from "../../value-objects/customer-id.js";
import { Customer } from "../customer.js";

const id = new CustomerId("cust-1");
const fields: CustomerCreate = {
  displayName: "ACME Corp",
  givenName: "John",
  familyName: "Smith",
  contacts: [{ type: "email", value: "contact@acme.com" }],
  preferences: { currency: "USD", language: "en" },
  createdAt: Instant.fromEpochMilliseconds(123456789),
  updatedAt: null,
  deletedAt: null,
};

function createCustomer(overrides?: Partial<typeof fields>) {
  return new Customer({ ...fields, ...overrides }, new CustomerId("test-id"));
}

describe("Customer", () => {
  describe("creation", () => {
    it("should initialize all fields correctly", () => {
      const customer = new Customer(fields, id);

      expect(customer.id?.toString()).toBe("cust-1");
      expect(customer.displayName).toBe("ACME Corp");
      expect(customer.givenName).toBe("John");
      expect(customer.familyName).toBe("Smith");
      expect(customer.contacts).toHaveLength(1);
      expect(customer.contacts[0]?.type).toBe("email");
      expect(customer.preferences).toEqual({ currency: "USD", language: "en" });
      expect(customer.createdAt).toBeInstanceOf(Instant);
    });

    it("should allow creation without id", () => {
      const customer = new Customer(fields);

      expect(customer.id).toBeUndefined();
    });

    it("should allow creation with null givenName and familyName", () => {
      const customer = new Customer({
        ...fields,
        displayName: "User",
        givenName: null,
        familyName: null,
      });

      expect(customer.givenName).toBeNull();
      expect(customer.familyName).toBeNull();
    });

    it("should use provided createdAt when given", () => {
      const now = Instant.now();
      const customer = new Customer({ ...fields, createdAt: now });

      expect(customer.createdAt).toBeInstanceOf(Instant);
    });

    it("should default updatedAt to null", () => {
      const customer = new Customer(fields);

      expect(customer.updatedAt).toBeNull();
    });

    it("should default deletedAt to null", () => {
      const customer = new Customer(fields);

      expect(customer.deletedAt).toBeNull();
    });

    it("should accept explicit updatedAt", () => {
      const now = Instant.now();
      const customer = new Customer({ ...fields, updatedAt: now });

      expect(customer.updatedAt).toBeInstanceOf(Instant);
    });

    it("should accept explicit deletedAt", () => {
      const now = Instant.now();
      const customer = new Customer({ ...fields, deletedAt: now });

      expect(customer.deletedAt).toBeInstanceOf(Instant);
    });

    it("should defensive-copy contacts on creation", () => {
      const contacts = [{ type: "phone", value: "+39" }];
      const customer = new Customer({ ...fields, contacts }, new CustomerId("id"));

      contacts.push({ type: "email", value: "x@y.com" });

      expect(customer.contacts).toHaveLength(1);
    });

    it("should defensive-copy preferences on creation", () => {
      const preferences: Record<string, unknown> = { lang: "en" };
      const customer = new Customer({ ...fields, preferences }, new CustomerId("id"));

      preferences["theme"] = "dark";

      expect(customer.preferences).toEqual({ lang: "en" });
    });

    it("should allow creation with multiple contacts", () => {
      const contacts = [
        { type: "email", value: "a@b.com" },
        { type: "phone", value: "123" },
      ];
      const customer = new Customer({ ...fields, contacts }, id);

      expect(customer.contacts).toHaveLength(2);
    });
  });

  describe("update", () => {
    let customer: Customer;

    beforeEach(() => {
      customer = new Customer(fields, id);
    });

    it("should update display name", () => {
      customer.update({ displayName: "New Name" });

      expect(customer.displayName).toBe("New Name");
    });

    it("should update display name to null", () => {
      customer.update({ displayName: null });

      expect(customer.displayName).toBeNull();
    });

    it("should update given name", () => {
      customer.update({ givenName: "Jane" });

      expect(customer.givenName).toBe("Jane");
    });

    it("should update given name to null", () => {
      customer.update({ givenName: null });

      expect(customer.givenName).toBeNull();
    });

    it("should update family name", () => {
      customer.update({ familyName: "Doe" });

      expect(customer.familyName).toBe("Doe");
    });

    it("should update family name to null", () => {
      customer.update({ familyName: null });

      expect(customer.familyName).toBeNull();
    });

    it("should update contacts", () => {
      const contacts = [{ type: "email", value: "new@example.com" }];
      customer.update({ contacts });

      expect(customer.contacts).toHaveLength(1);
      expect(customer.contacts[0]?.value).toBe("new@example.com");
    });

    it("should update contacts to empty", () => {
      customer.update({ contacts: [] });

      expect(customer.contacts).toHaveLength(0);
    });

    it("should update preferences", () => {
      customer.update({ preferences: { lang: "it" } });

      expect(customer.preferences).toEqual({ lang: "it" });
    });

    it("should update preferences to empty", () => {
      customer.update({ preferences: {} });

      expect(customer.preferences).toEqual({});
    });

    it("should update multiple fields at once", () => {
      customer.update({
        displayName: "New Name",
        contacts: [{ type: "phone", value: "456" }],
      });

      expect(customer.displayName).toBe("New Name");
      expect(customer.contacts).toHaveLength(1);
      expect(customer.preferences).toEqual({ currency: "USD", language: "en" });
    });

    it("should not change fields that are not updated", () => {
      customer.update({});

      expect(customer.displayName).toBe("ACME Corp");
      expect(customer.contacts).toHaveLength(1);
    });
  });

  describe("snapshot", () => {
    it("should capture current state with id", () => {
      const customer = new Customer(fields, id);
      const snapshot = customer.snapshot();

      expect(snapshot.id.toString()).toBe("cust-1");
      expect(snapshot.displayName).toBe("ACME Corp");
      expect(snapshot.contacts).toHaveLength(1);
      expect(snapshot.capturedAt).toBeInstanceOf(Instant);
    });

    it("should include givenName and familyName in snapshot", () => {
      const customer = new Customer(fields, id);
      const snapshot = customer.snapshot();

      expect(snapshot.givenName).toBe("John");
      expect(snapshot.familyName).toBe("Smith");
    });

    it("should include preferences in snapshot", () => {
      const customer = new Customer(fields, id);
      const snapshot = customer.snapshot();

      expect(snapshot.preferences).toEqual({ currency: "USD", language: "en" });
    });

    it("should include createdAt in snapshot", () => {
      const customer = new Customer(fields, id);
      const snapshot = customer.snapshot();

      expect(snapshot.createdAt).toBeInstanceOf(Instant);
    });

    it("should include updatedAt in snapshot", () => {
      const customer = new Customer(fields, id);
      const snapshot = customer.snapshot();

      expect(snapshot.updatedAt).toBeNull();
    });

    it("should include deletedAt in snapshot", () => {
      const customer = new Customer(fields, id);
      const snapshot = customer.snapshot();

      expect(snapshot.deletedAt).toBeNull();
    });

    it("should be immutable after mutation of source", () => {
      const customer = createCustomer();
      const snapshot = customer.snapshot();

      customer.update({ displayName: "Changed" });

      expect(snapshot.displayName).toBe("ACME Corp");
    });

    it("should return a new object each call", () => {
      const customer = createCustomer();

      expect(customer.snapshot()).not.toBe(customer.snapshot());
    });

    it("should include defensive copies of mutable fields in snapshot", () => {
      const customer = createCustomer();
      const snapshot = customer.snapshot();

      expect(snapshot.contacts).not.toBe(customer.contacts);
    });
  });

  describe("defensive getters", () => {
    it("should return defensive copies for contacts", () => {
      const customer = createCustomer({ contacts: [{ type: "email", value: "a@b.com" }] });
      const contacts = customer.contacts;

      expect(contacts).not.toBe(customer.contacts);
    });

    it("should return defensive copies for preferences", () => {
      const customer = createCustomer({ preferences: { key: "val" } });
      const prefs = customer.preferences;

      expect(prefs).not.toBe(customer.preferences);
    });
  });
});
