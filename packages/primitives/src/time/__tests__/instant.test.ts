import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Instant } from "../instant.js";

describe("Instant", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-15T10:30:00.000Z"));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("now", () => {
    it("should create an Instant at the current time", () => {
      const instant = Instant.now();

      expect(instant).toBeInstanceOf(Instant);
      expect(instant.epochMilliseconds).toBe(Date.now());
    });
  });

  describe("fromEpochMilliseconds", () => {
    it("should create an Instant from epoch milliseconds", () => {
      const instant = Instant.fromEpochMilliseconds(1_700_000_000_000);

      expect(instant).toBeInstanceOf(Instant);
      expect(instant.epochMilliseconds).toBe(1_700_000_000_000);
    });

    it("should support the Unix epoch", () => {
      const instant = Instant.fromEpochMilliseconds(0);

      expect(instant.epochMilliseconds).toBe(0);
    });
  });

  describe("toISOString", () => {
    it("should convert the Instant to an ISO 8601 string", () => {
      const instant = Instant.fromEpochMilliseconds(1_705_314_600_000);

      expect(instant.toISOString()).toBe("2024-01-15T10:30:00.000Z");
    });

    it("should produce the same string for the same instant", () => {
      const instant = Instant.fromEpochMilliseconds(1_705_314_600_000);

      expect(instant.toISOString()).toBe(instant.toISOString());
    });
  });

  describe("epochMilliseconds", () => {
    it("should expose the underlying epoch milliseconds", () => {
      const instant = Instant.fromEpochMilliseconds(42);

      expect(instant.epochMilliseconds).toBe(42);
    });
  });
});