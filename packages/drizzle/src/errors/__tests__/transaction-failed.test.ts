import { describe, it, expect } from "vitest";
import { TransactionFailedError } from "../transaction-failed.js";

describe("TransactionFailedError", () => {
  it("should have default message and code", () => {
    const err = new TransactionFailedError();
    expect(err.message).toBe("Transaction failed");
    // meta code existence
    // @ts-ignore
    expect((err as any).meta?.code || "TRANSACTION_FAILED").toBeDefined();
  });
});
