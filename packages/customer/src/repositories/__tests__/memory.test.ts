import { beforeEach, describe, expect, it } from "vitest";
import { Customer } from "../../entities/customer.js";
import { CustomerId } from "../../value-objects/customer-id.js";
import { MemoryCustomerRepository } from "../memory.js";
import { TenantId } from "@comity/organization";

function createId(value: string): CustomerId {
  const result = CustomerId.create(value);

  if (result.success === false) {
    throw new Error("Unexpected failure");
  }

  return result.value;
}

function createTenant(value: string): TenantId {
  const result = TenantId.create(value);

  if (result.success === false) {
    throw new Error("Unexpected failure");
  }

  return result.value;
}

function makeCustomer(overrides: Partial<Customer> = {}): Customer {
  const id = createId(`cust-${Math.random().toString(36).slice(2, 10)}`);
  return {
    id,
    displayName: "John Doe",
    givenName: "John",
    familyName: "Doe",
    contacts: [{ type: "email", value: "john@example.com" }],
    preferences: {},
    createdAt: 1000,
    updatedAt: 1000,
    deletedAt: null,
    ...overrides,
  };
}

describe("MemoryCustomerRepository", () => {
  let repository: MemoryCustomerRepository;
  const tenantA = createTenant("tenant-a");
  const tenantB = createTenant("tenant-b");

  beforeEach(() => {
    repository = new MemoryCustomerRepository();
  });

  it("returns null when no customer exists", async () => {
    const result = await repository.getById(createId("missing"), tenantA);

    expect(result).toEqual({ success: true, value: null });
  });

  it("returns a customer saved by id", async () => {
    const customer = makeCustomer();
    await repository.save(customer, tenantA);

    const result = await repository.getById(customer.id, tenantA);

    expect(result.success).toBe(true);
    expect(result.value?.id.value).toContain("cust-");
    expect(result.value?.displayName).toBe("John Doe");
  });

  it("returns null for a different id", async () => {
    await repository.save(makeCustomer(), tenantA);

    const result = await repository.getById(createId("other-cust"), tenantA);

    expect(result).toEqual({ success: true, value: null });
  });

  it("search returns all customers when no criteria", async () => {
    await repository.save(makeCustomer({ displayName: "Alice" }), tenantA);
    await repository.save(makeCustomer({ displayName: "Bob" }), tenantA);
    await repository.save(makeCustomer({ displayName: "Charlie" }), tenantA);

    const result = await repository.search(undefined, tenantA);

    expect(result.success).toBe(true);
    expect(result.value?.total).toBe(3);
    expect(result.value?.items).toHaveLength(3);
  });

  describe("tenant isolation", () => {
    it("read isolation - customer saved in tenant A is not readable using tenant B", async () => {
      const customer = makeCustomer({ id: createId("cust-shared-id") });
      await repository.save(customer, tenantA);

      const resultA = await repository.getById(customer.id, tenantA);
      const resultB = await repository.getById(customer.id, tenantB);

      expect(resultA.success).toBe(true);
      expect(resultA.value).not.toBeNull();
      expect(resultB.success).toBe(true);
      expect(resultB.value).toBeNull();
    });

    it("search isolation - search for tenant A does not return customers from tenant B", async () => {
      await repository.save(makeCustomer({ displayName: "Alice" }), tenantA);
      await repository.save(makeCustomer({ displayName: "Bob" }), tenantB);

      const resultA = await repository.search(undefined, tenantA);
      const resultB = await repository.search(undefined, tenantB);

      expect(resultA.success).toBe(true);
      expect(resultA.value?.total).toBe(1);
      expect(resultA.value?.items[0].displayName).toBe("Alice");

      expect(resultB.success).toBe(true);
      expect(resultB.value?.total).toBe(1);
      expect(resultB.value?.items[0].displayName).toBe("Bob");
    });

    it("remove isolation - removing customer using tenant B does not delete customer from tenant A", async () => {
      const customerA = makeCustomer({ id: createId("cust-1") });
      const customerB = makeCustomer({ id: createId("cust-2") });
      await repository.save(customerA, tenantA);
      await repository.save(customerB, tenantB);

      await repository.remove(customerA.id, tenantB);

      const resultA = await repository.getById(customerA.id, tenantA);
      const resultB = await repository.getById(customerB.id, tenantB);

      expect(resultA.success).toBe(true);
      expect(resultA.value).not.toBeNull();

      expect(resultB.success).toBe(true);
      expect(resultB.value).not.toBeNull();
    });

    it("save isolation - two customers with same CustomerId can belong to different tenants without collision", async () => {
      const sharedId = createId("cust-shared");
      const customerA = makeCustomer({ id: sharedId, displayName: "Alice" });
      const customerB = makeCustomer({ id: sharedId, displayName: "Bob" });

      await repository.save(customerA, tenantA);
      await repository.save(customerB, tenantB);

      const resultA = await repository.getById(sharedId, tenantA);
      const resultB = await repository.getById(sharedId, tenantB);

      expect(resultA.success).toBe(true);
      expect(resultA.value?.displayName).toBe("Alice");

      expect(resultB.success).toBe(true);
      expect(resultB.value?.displayName).toBe("Bob");
    });

    it("repository reuse - same instance can be used alternately for different tenants", async () => {
      const customerA = makeCustomer({ id: createId("cust-a") });
      const customerB = makeCustomer({ id: createId("cust-b") });

      await repository.save(customerA, tenantA);
      await repository.save(customerB, tenantB);

      const getA1 = await repository.getById(customerA.id, tenantA);
      const getB1 = await repository.getById(customerB.id, tenantB);
      const searchA = await repository.search(undefined, tenantA);
      const searchB = await repository.search(undefined, tenantB);
      const getA2 = await repository.getById(customerA.id, tenantA);
      const getB2 = await repository.getById(customerB.id, tenantB);

      expect(getA1.success).toBe(true);
      expect(getA1.value?.id.value).toBe(customerA.id.value);

      expect(getB1.success).toBe(true);
      expect(getB1.value?.id.value).toBe(customerB.id.value);

      expect(searchA.success).toBe(true);
      expect(searchA.value?.total).toBe(1);

      expect(searchB.success).toBe(true);
      expect(searchB.value?.total).toBe(1);

      expect(getA2.success).toBe(true);
      expect(getA2.value?.id.value).toBe(customerA.id.value);

      expect(getB2.success).toBe(true);
      expect(getB2.value?.id.value).toBe(customerB.id.value);
    });
  });
});
