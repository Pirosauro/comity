import { describe, expect, it } from "vitest";
import { TenantId } from "../tenant-id.js";

describe("TenantId", () => {
  describe("create", () => {
    it("creates a TenantId from a valid value", () => {
      const result = TenantId.create("tenant-1");

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.value.value).toBe("tenant-1");
      expect(result.value.toString()).toBe("tenant-1");
    });

    it("preserves surrounding whitespace in the stored value", () => {
      const result = TenantId.create(" tenant-1 ");

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.value.toString()).toBe(" tenant-1 ");
    });

    it("fails with an empty error for an empty value", () => {
      const result = TenantId.create("");

      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.error.code).toBe("value-object:empty");
      expect(result.error.meta.details.kind).toBe("TenantId");
    });

    it("fails with an empty error for a whitespace-only value", () => {
      const result = TenantId.create("   ");

      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.error.code).toBe("value-object:empty");
    });
  });

  describe("equality", () => {
    it("is equal for identical values", () => {
      const a = TenantId.create("tenant-1");
      const b = TenantId.create("tenant-1");

      if (!a.success || !b.success) throw new Error("Unexpected failure");
      expect(a.value.equals(b.value)).toBe(true);
    });

    it("is not equal for different values", () => {
      const a = TenantId.create("tenant-1");
      const b = TenantId.create("tenant-2");

      if (!a.success || !b.success) throw new Error("Unexpected failure");
      expect(a.value.equals(b.value)).toBe(false);
    });
  });

  describe("immutability", () => {
    it("exposes its value only through a getter", () => {
      const result = TenantId.create("tenant-1");
      if (!result.success) throw new Error("Unexpected failure");
      const tenantId = result.value as unknown as Record<string, unknown>;

      expect(typeof tenantId.value).toBe("string");
      expect(tenantId["#value"]).toBeUndefined();
    });
  });
});
