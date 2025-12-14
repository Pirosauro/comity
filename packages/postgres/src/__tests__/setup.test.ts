import { describe, it, expect, vi, beforeEach } from "vitest";
import { setup } from "../setup.js";

// Mock middleware factory
vi.mock("../middleware-factory.js", () => ({
  createDatabaseMiddleware: vi.fn().mockReturnValue(vi.fn()),
}));

describe("Database Setup Module", () => {
  let mockCtx: any;
  let mockApp: any;
  let mockOnHook: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockApp = {
      use: vi.fn(),
    };

    mockOnHook = vi.fn();

    mockCtx = {
      onHook: mockOnHook,
    };
  });

  it("should have correct module metadata", () => {
    expect(setup.name).toBe("@comity/postgres");
    expect(setup.version).toBe("1.0.0");
    expect(setup.dependsOn).toEqual(["@comity/application", "@comity/logger"]);
    expect(setup.incompatibleWith).toEqual([]);
  });

  it("should export setup function", () => {
    expect(typeof setup.setup).toBe("function");
  });

  it("should return async function when setup is called", async () => {
    const options = {};
    const setupFunction = await setup.setup(options);

    expect(typeof setupFunction).toBe("function");
  });

  it("should handle empty options", async () => {
    const setupFunction = await setup.setup({});

    expect(typeof setupFunction).toBe("function");
  });

  it("should handle undefined options", async () => {
    const setupFunction = await setup.setup(undefined);

    expect(typeof setupFunction).toBe("function");
  });

  it("should create middleware and register hook when setup function is called", async () => {
    const { createDatabaseMiddleware } = await import("../middleware-factory.js");
    const mockMiddleware = vi.fn();
    vi.mocked(createDatabaseMiddleware).mockReturnValue(mockMiddleware);

    const setupFunction = await setup.setup({});
    await setupFunction(mockCtx);

    expect(createDatabaseMiddleware).toHaveBeenCalledWith({}, mockCtx);
    expect(mockOnHook).toHaveBeenCalledWith(
      "@comity/application:initialized",
      expect.any(Function)
    );

    // Call the hook handler
    const hookHandler = mockOnHook.mock.calls[0][1];
    hookHandler(mockApp);

    expect(mockApp.use).toHaveBeenCalledWith(mockMiddleware);
  });

  it("should pass options to createDatabaseMiddleware", async () => {
    const { createDatabaseMiddleware } = await import("../middleware-factory.js");
    const options = {
      maxConnections: 20,
      connectionTimeout: 10000,
    };

    const setupFunction = await setup.setup(options);
    await setupFunction(mockCtx);

    expect(createDatabaseMiddleware).toHaveBeenCalledWith(options, mockCtx);
  });
});
