import { describe, expect, it } from "vitest";
import { isFailure } from "@comity/primitives/result";
import { InventoryError } from "../../errors/inventory.js";
import { Availability } from "../availability.js";
import { Quantity } from "../quantity.js";

function qty(value: bigint, scale: number): Quantity {
  const result = Quantity.create(value, scale);

  if (isFailure(result)) {
    throw new Error("Unexpected failure");
  }

  return result.value;
}

describe("Availability", () => {
  it("should derive available as on-hand minus reserved", () => {
    const result = Availability.create(qty(100n, 0), qty(20n, 0));

    expect(isFailure(result)).toBe(false);
    if (!isFailure(result)) {
      expect(result.value.onHand.equals(qty(100n, 0))).toBe(true);
      expect(result.value.reserved.equals(qty(20n, 0))).toBe(true);
      expect(result.value.available.equals(qty(80n, 0))).toBe(true);
    }
  });

  it("should derive available equal to on-hand when nothing is reserved", () => {
    const result = Availability.create(qty(100n, 0), qty(0n, 0));

    expect(isFailure(result)).toBe(false);
    if (!isFailure(result)) {
      expect(result.value.available.equals(qty(100n, 0))).toBe(true);
    }
  });

  it("should derive available of zero when everything is reserved", () => {
    const result = Availability.create(qty(100n, 0), qty(100n, 0));

    expect(isFailure(result)).toBe(false);
    if (!isFailure(result)) {
      expect(result.value.available.equals(qty(0n, 0))).toBe(true);
    }
  });

  it("should support fractional quantities", () => {
    const result = Availability.create(qty(2500n, 3), qty(500n, 3));

    expect(isFailure(result)).toBe(false);
    if (!isFailure(result)) {
      expect(result.value.available.equals(qty(2000n, 3))).toBe(true);
    }
  });

  it("should fail with invalid_quantity when reserved exceeds on-hand", () => {
    const result = Availability.create(qty(10n, 0), qty(20n, 0));

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(InventoryError);
      expect(result.error.meta.reason).toBe("invalid_quantity");
      expect(result.error.meta.details?.field).toBe("reserved");
    }
  });

  it("should equal another availability with the same quantities", () => {
    const a = Availability.create(qty(100n, 0), qty(20n, 0));
    const b = Availability.create(qty(100n, 0), qty(20n, 0));

    expect(isFailure(a)).toBe(false);
    expect(isFailure(b)).toBe(false);
    if (!isFailure(a) && !isFailure(b)) {
      expect(a.value.equals(b.value)).toBe(true);
    }
  });

  it("should not equal another availability with different quantities", () => {
    const a = Availability.create(qty(100n, 0), qty(20n, 0));
    const b = Availability.create(qty(100n, 0), qty(30n, 0));

    expect(isFailure(a)).toBe(false);
    expect(isFailure(b)).toBe(false);
    if (!isFailure(a) && !isFailure(b)) {
      expect(a.value.equals(b.value)).toBe(false);
    }
  });

  it("should return a stable technical serialization", () => {
    const result = Availability.create(qty(100n, 0), qty(20n, 0));

    expect(isFailure(result)).toBe(false);
    if (!isFailure(result)) {
      expect(result.value.toString()).toBe(
        "80 scale 0 available (100 scale 0 on hand, 20 scale 0 reserved)"
      );
    }
  });

  it("should not allow bypassing validation through the constructor", () => {
    // @ts-expect-error the constructor is private; creation goes through create()
    new Availability(qty(100n, 0), qty(20n, 0), qty(80n, 0));
  });
});