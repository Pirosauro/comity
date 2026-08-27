import { describe, expect, it } from "vitest";
import { ChannelId } from "../channel-id.js";

describe("ChannelId", () => {
  describe("create", () => {
    it("creates a ChannelId from a valid value", () => {
      const result = ChannelId.create("web");

      expect(result.success).toBe(true);
      if (!result.success) return;
      expect(result.value.value).toBe("web");
      expect(result.value.toString()).toBe("web");
    });

    it("fails with an empty error for an empty value", () => {
      const result = ChannelId.create("");

      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.error.code).toBe("value-object:empty");
      expect(result.error.meta.details.kind).toBe("ChannelId");
    });

    it("fails with an empty error for a whitespace-only value", () => {
      const result = ChannelId.create("   ");

      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.error.code).toBe("value-object:empty");
    });
  });

  describe("equality", () => {
    it("is equal for identical values", () => {
      const a = ChannelId.create("web");
      const b = ChannelId.create("web");

      if (!a.success || !b.success) throw new Error("Unexpected failure");
      expect(a.value.equals(b.value)).toBe(true);
    });

    it("is not equal for different values", () => {
      const a = ChannelId.create("web");
      const b = ChannelId.create("pos");

      if (!a.success || !b.success) throw new Error("Unexpected failure");
      expect(a.value.equals(b.value)).toBe(false);
    });
  });

  describe("immutability", () => {
    it("exposes its value only through a getter", () => {
      const result = ChannelId.create("web");
      if (!result.success) throw new Error("Unexpected failure");
      const channelId = result.value as unknown as Record<string, unknown>;

      expect(typeof channelId.value).toBe("string");
      expect(channelId["#value"]).toBeUndefined();
    });
  });
});