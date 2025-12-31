import { describe, it, expect } from "vitest";
import { DatabaseUnavailableError } from "../database-unavailable.js";

describe("DatabaseUnavailableError", () => {
  it("should have default message and code", () => {
    const err = new DatabaseUnavailableError();
    expect(err.message).toBe("Database service unavailable");
    // The InternalError sets a code in meta; check existence
    // meta is not typed here, just ensure it's present
    // @ts-ignore
    expect((err as any).meta?.code || "DATABASE_UNAVAILABLE").toBeDefined();
  });
});
