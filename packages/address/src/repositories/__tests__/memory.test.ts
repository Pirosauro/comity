import { beforeEach, describe, expect, it } from "vitest";
import { Address } from "../../entities/address.js";
import { AddressId } from "../../value-objects/address-id.js";
import { MemoryAddressRepository } from "../memory.js";

function createId(value: string): AddressId {
  const result = AddressId.create(value);

  if (result.success === false) {
    throw new Error("Unexpected failure");
  }

  return result.value;
}

function makeAddress(overrides: Partial<Address> = {}): Address {
  return {
    id: createId("addr-1"),
    lines: ["1 Test St"],
    city: "Testville",
    administrativeArea: "TS",
    postalCode: "12345",
    countryCode: "US",
    label: "Home",
    metadata: {},
    contacts: [],
    createdAt: 1000,
    updatedAt: 1000,
    ...overrides,
  };
}

describe("MemoryAddressRepository", () => {
  let repository: MemoryAddressRepository;

  beforeEach(() => {
    repository = new MemoryAddressRepository();
  });

  it("returns null when no address exists", async () => {
    const result = await repository.getById(createId("missing"));

    expect(result).toEqual({ success: true, value: null });
  });

  it("returns an address saved by id", async () => {
    const address = makeAddress();
    await repository.save(address);

    const result = await repository.getById(address.id);

    expect(result.success).toBe(true);
    expect(result.value?.id.value).toBe("addr-1");
    expect(result.value?.city).toBe("Testville");
  });

  it("returns null for a different id", async () => {
    await repository.save(makeAddress());

    const result = await repository.getById(createId("other-addr"));

    expect(result).toEqual({ success: true, value: null });
  });

  it("saves and retrieves an address", async () => {
    const address = makeAddress({ city: "Metropolis" });
    await repository.save(address);

    const result = await repository.getById(address.id);

    expect(result.success).toBe(true);
    expect(result.value?.city).toBe("Metropolis");
    expect(result.value?.lines).toEqual(["1 Test St"]);
  });
});
