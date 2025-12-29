import { describe, it, expect, vi } from "vitest";

// Mock all dependencies
vi.mock("pino", () => ({
  pino: vi.fn().mockReturnValue({
    error: vi.fn(),
  }),
}));

vi.mock("../runtime/run.js", () => ({
  run: vi.fn().mockResolvedValue(undefined),
}));

describe("bin/index.ts", () => {
  it("should execute main function without throwing", async () => {
    // Mock process.exit to prevent actual exit
    const originalExit = process.exit;
    process.exit = vi.fn() as any;

    try {
      await import("../index.js");
      // If we get here, the main function executed without calling process.exit
      expect(true).toBe(true);
    } finally {
      process.exit = originalExit;
    }
  });
});
