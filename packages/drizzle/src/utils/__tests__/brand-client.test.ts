import { describe, it, expect } from "vitest";
import { brandClient } from "../brand-client.js";
import { DRIZZLE_KIND } from "../../constants.js";

describe("brandClient", () => {
  it("should attach non-enumerable DRIZZLE_KIND property", () => {
    const client = { foo: "bar" } as any;
    const branded = brandClient(client, "d1");

    expect(branded[DRIZZLE_KIND]).toBe("d1");
    // property should be own but non-enumerable
    expect(Object.prototype.hasOwnProperty.call(branded, DRIZZLE_KIND)).toBe(
      true
    );
    expect(
      Object.prototype.propertyIsEnumerable.call(branded, DRIZZLE_KIND)
    ).toBe(false);
  });
});
