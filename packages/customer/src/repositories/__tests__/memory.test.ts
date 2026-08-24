import { beforeEach, describe, expect, it } from "vitest";
import { Customer } from "../../entities/customer.js";
import { CustomerId } from "../../value-objects/customer-id.js";
import { MemoryCustomerRepository } from "../memory.js";

function createId(value: string): CustomerId {
  const result = CustomerId.create(value);

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

  beforeEach(() => {
    repository = new MemoryCustomerRepository();
  });

  it("returns null when no customer exists", async () => {
    const result = await repository.getById(createId("missing"));

    expect(result).toEqual({ success: true, value: null });
  });

  it("returns a customer saved by id", async () => {
    const customer = makeCustomer();
    await repository.save(customer);

    const result = await repository.getById(customer.id);

    expect(result.success).toBe(true);
    expect(result.value?.id.value).toContain("cust-");
    expect(result.value?.displayName).toBe("John Doe");
  });

  it("returns null for a different id", async () => {
    await repository.save(makeCustomer());

    const result = await repository.getById(createId("other-cust"));

    expect(result).toEqual({ success: true, value: null });
  });

  it("search returns all customers when no criteria", async () => {
    await repository.save(makeCustomer({ displayName: "Alice" }));
    await repository.save(makeCustomer({ displayName: "Bob" }));
    await repository.save(makeCustomer({ displayName: "Charlie" }));

    const result = await repository.search();

    expect(result.success).toBe(true);
    expect(result.value?.total).toBe(3);
    expect(result.value?.items).toHaveLength(3);
  });
});
