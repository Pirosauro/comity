import { describe, it, expect, vi, beforeEach } from "vitest";
import * as vite from "vite";

vi.mock("vite", () => ({
  createServer: vi.fn(),
}));

const mockCreate = vi.mocked(vite.createServer);

describe("devCommand", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("starts dev server and calls utility methods", async () => {
    const server = {
      listen: vi.fn().mockResolvedValue(undefined),
      printUrls: vi.fn(),
      bindCLIShortcuts: vi.fn(),
    } as any;

    mockCreate.mockResolvedValue(server as any);

    const mod = await import("../dev.js");

    await mod.devCommand("vite.config.dev.js");

    expect(mockCreate).toHaveBeenCalledWith({
      configFile: "vite.config.dev.js",
    });
    expect(server.listen).toHaveBeenCalled();
    expect(server.printUrls).toHaveBeenCalled();
    expect(server.bindCLIShortcuts).toHaveBeenCalledWith({ print: true });
  });
});
