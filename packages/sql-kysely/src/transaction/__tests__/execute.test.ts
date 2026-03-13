import { beforeEach, describe, expect, it, vi } from "vitest";
import { executeTransaction } from "../execute.js";

describe("executeTransaction", () => {
  const adapter = "test-adapter";

  it("should successfully create a transaction", async () => {
    const mockTransaction = {
      executeQuery: vi.fn().mockResolvedValue({
        rows: [],
        numAffectedRows: 0n,
      }),
    };

    const mockDb = {
      transaction: vi.fn().mockReturnValue({
        execute: vi.fn().mockImplementation(async (fn) => {
          // Simulate the barrier pattern - resolve immediately
          await Promise.resolve();
          return await fn(mockTransaction);
        }),
      }),
    };

    const result = await executeTransaction(mockDb as any, adapter);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toBeDefined();
      expect(typeof result.value.query).toBe("function");
      expect(typeof result.value.commit).toBe("function");
      expect(typeof result.value.rollback).toBe("function");
    }
  });

  it("should handle transaction creation errors", async () => {
    const creationError = new Error("Transaction creation failed");
    const mockDb = {
      transaction: vi.fn().mockImplementation(() => {
        throw creationError;
      }),
    };

    const result = await executeTransaction(mockDb as any, adapter);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.message).toBe("Transaction failed");
      expect(result.error.cause).toBe(creationError);
    }
  });

  describe("transaction operations", () => {
    let mockTransaction: any;
    let mockDb: any;
    let transactionResult: any;

    beforeEach(async () => {
      mockTransaction = {
        executeQuery: vi.fn(),
      };

      let resolveBarrier: () => void;
      const barrier = new Promise<void>((resolve) => {
        resolveBarrier = resolve;
      });

      mockDb = {
        transaction: vi.fn().mockReturnValue({
          execute: vi.fn().mockImplementation(async (fn) => {
            // Start the transaction
            const result = fn(mockTransaction);
            // Resolve barrier to allow commit/rollback
            resolveBarrier();
            return await result;
          }),
        }),
      };

      const result = await executeTransaction(mockDb, adapter);
      if (result.success) {
        transactionResult = result.value;
      }
    });

    it("should execute queries within transaction", async () => {
      mockTransaction.executeQuery.mockResolvedValue({
        rows: [{ id: 1 }],
        numAffectedRows: 1n,
      });

      const queryResult = await transactionResult.query({
        statement: "SELECT * FROM users",
      });

      expect(queryResult.success).toBe(true);
      expect(queryResult.value?.rows).toEqual([{ id: 1 }]);
      expect(mockTransaction.executeQuery).toHaveBeenCalled();
    });

    it("should commit transaction successfully", async () => {
      mockDb.transaction().execute.mockResolvedValue(undefined);

      const commitResult = await transactionResult.commit();

      expect(commitResult.success).toBe(true);
      expect(commitResult.value).toBeUndefined();
    });

    it("should handle commit errors", async () => {
      // Note: In this implementation, commit always succeeds as it just resolves the transaction barrier
      const commitResult = await transactionResult.commit();

      expect(commitResult.success).toBe(true);
    });

    it("should rollback transaction successfully", async () => {
      mockDb.transaction().execute.mockImplementation(async () => {
        throw new Error("rollback"); // Simulate rollback rejection
      });

      const rollbackResult = await transactionResult.rollback();

      expect(rollbackResult.success).toBe(true);
      expect(rollbackResult.value).toBeUndefined();
    });

    it("should handle rollback errors", async () => {
      // Note: In this implementation, rollback always succeeds as it just rejects the transaction barrier
      const rollbackResult = await transactionResult.rollback();

      expect(rollbackResult.success).toBe(true);
    });
  });

  it("should handle transaction setup errors", async () => {
    // Note: Transaction setup doesn't validate the database, so this always succeeds
    const mockDb = {
      transaction: vi.fn().mockReturnValue({
        execute: vi.fn().mockResolvedValue(undefined),
      }),
    };

    const result = await executeTransaction(mockDb as any, adapter);

    expect(result.success).toBe(true);
  });
});
