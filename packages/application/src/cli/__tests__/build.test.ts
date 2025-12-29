import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as vite from "vite";

vi.mock("vite", () => ({
  build: vi.fn(),
}));

const mockBuild = vi.mocked(vite.build);

describe("buildCommand", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("runs SSR and client builds successfully", async () => {
    mockBuild.mockResolvedValueOnce(undefined as any);
    mockBuild.mockResolvedValueOnce(undefined as any);

    const mod = await import("../build.js");
    await expect(mod.buildCommand("vite.config.js")).resolves.toBeUndefined();

    expect(mockBuild).toHaveBeenCalledTimes(2);
    expect(mockBuild.mock.calls[0][0]).toMatchObject({
      configFile: "vite.config.js",
    });
  });

  it("calls process.exit on build failure", async () => {
    const err = new Error("build failed");
    mockBuild.mockRejectedValueOnce(err);

    const mod = await import("../build.js");

    const origExit = process.exit;
    const exitMock = vi.fn() as any;
    (process as any).exit = exitMock;

    await mod.buildCommand();

    expect(exitMock).toHaveBeenCalledWith(1);

    process.exit = origExit;
  });
});
