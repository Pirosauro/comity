import { describe, it, expect, vi, beforeEach } from "vitest";
import { setup } from "../setup.js";
import { createWorkspaceMiddleware } from "../middleware-factory.js";

vi.mock("../middleware.js", () => ({
  createWorkspaceMiddleware: vi.fn(() => vi.fn()),
}));

describe("Workspace Module Setup", () => {
  const mockLogger = {
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    fatal: vi.fn(),
    trace: vi.fn(),
    level: "info",
    child: vi.fn(),
  };

  const mockContext = {
    app: { use: vi.fn() },
    api: { use: vi.fn() },
    logger: mockLogger,
    emit: vi.fn(),
    onHook: vi.fn(),
    onEvent: vi.fn(),
    trigger: vi.fn(),
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should export ModuleMeta with correct name", () => {
    expect(setup.name).toBe("@comity/workspace");
  });

  it("should have setup function", () => {
    expect(setup.setup).toBeInstanceOf(Function);
  });

  it("should configure workspace middleware on app if present", async () => {
    const mockMiddleware = vi.fn();
    vi.mocked(createWorkspaceMiddleware).mockReturnValue(mockMiddleware);

    const setupFn = await setup.setup({});

    await setupFn(mockContext);

    expect(createWorkspaceMiddleware).toHaveBeenCalledWith({}, mockContext);
    expect(mockContext.app.use).toHaveBeenCalledWith(mockMiddleware);
  });
});
