import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { buildCommand } from "../build.js";
import { devCommand } from "../dev.js";

// Mock vite
vi.mock("vite", () => ({
  build: vi.fn(),
  createServer: vi.fn(),
}));

import { build, createServer } from "vite";

describe("CLI Commands", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock process.exit to prevent tests from exiting
    vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
    // Mock console methods
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("buildCommand", () => {
    it("should call vite build twice for SSR and client builds", async () => {
      const mockBuild = vi.mocked(build);
      mockBuild.mockResolvedValue({} as any);

      await buildCommand();

      expect(mockBuild).toHaveBeenCalledTimes(2);
      expect(mockBuild).toHaveBeenNthCalledWith(1, {});
      expect(mockBuild).toHaveBeenNthCalledWith(2, {});
    });

    it("should pass configFile to both build calls", async () => {
      const mockBuild = vi.mocked(build);
      mockBuild.mockResolvedValue({} as any);
      const configFile = "vite.config.ts";

      await buildCommand(configFile);

      expect(mockBuild).toHaveBeenCalledTimes(2);
      expect(mockBuild).toHaveBeenNthCalledWith(1, { configFile });
      expect(mockBuild).toHaveBeenNthCalledWith(2, { configFile });
    });

    it("should log build progress messages", async () => {
      const mockBuild = vi.mocked(build);
      const mockConsoleLog = vi.mocked(console.log);
      mockBuild.mockResolvedValue({} as any);

      await buildCommand();

      expect(mockConsoleLog).toHaveBeenCalledWith("📦 Running SSR Build...");
      expect(mockConsoleLog).toHaveBeenCalledWith("📦 Running Client Build...");
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "✅ Builds completed successfully."
      );
    });

    it("should handle build errors gracefully", async () => {
      const mockBuild = vi.mocked(build);
      const mockConsoleError = vi.mocked(console.error);
      const mockExit = vi.mocked(process.exit);
      const testError = new Error("Build failed");

      mockBuild.mockRejectedValue(testError);

      await buildCommand();

      expect(mockConsoleError).toHaveBeenCalledWith(
        "❌ Error during build:",
        testError
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it("should handle SSR build failure", async () => {
      const mockBuild = vi.mocked(build);
      const mockConsoleError = vi.mocked(console.error);
      const mockExit = vi.mocked(process.exit);
      const testError = new Error("SSR build failed");

      mockBuild.mockImplementationOnce(() => Promise.reject(testError));

      await buildCommand();

      expect(mockConsoleError).toHaveBeenCalledWith(
        "❌ Error during build:",
        testError
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it("should handle client build failure", async () => {
      const mockBuild = vi.mocked(build);
      const mockConsoleError = vi.mocked(console.error);
      const mockExit = vi.mocked(process.exit);
      const testError = new Error("Client build failed");

      mockBuild.mockImplementationOnce(() => Promise.resolve({} as any));
      mockBuild.mockImplementationOnce(() => Promise.reject(testError));

      await buildCommand();

      expect(mockConsoleError).toHaveBeenCalledWith(
        "❌ Error during build:",
        testError
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe("devCommand", () => {
    it("should create and start a vite dev server", async () => {
      const mockServer = {
        listen: vi.fn().mockResolvedValue(undefined),
        printUrls: vi.fn(),
        bindCLIShortcuts: vi.fn(),
      };
      const mockCreateServer = vi.mocked(createServer);
      mockCreateServer.mockResolvedValue(mockServer as any);

      await devCommand();

      expect(mockCreateServer).toHaveBeenCalledWith({});
      expect(mockServer.listen).toHaveBeenCalled();
      expect(mockServer.printUrls).toHaveBeenCalled();
      expect(mockServer.bindCLIShortcuts).toHaveBeenCalledWith({ print: true });
    });

    it("should pass configFile to createServer", async () => {
      const mockServer = {
        listen: vi.fn().mockResolvedValue(undefined),
        printUrls: vi.fn(),
        bindCLIShortcuts: vi.fn(),
      };
      const mockCreateServer = vi.mocked(createServer);
      mockCreateServer.mockResolvedValue(mockServer as any);
      const configFile = "vite.config.dev.ts";

      await devCommand(configFile);

      expect(mockCreateServer).toHaveBeenCalledWith({ configFile });
    });

    it("should handle server creation errors", async () => {
      const mockCreateServer = vi.mocked(createServer);
      const testError = new Error("Server creation failed");

      mockCreateServer.mockRejectedValue(testError);

      await expect(devCommand()).rejects.toThrow(testError);
    });

    it("should handle server listen errors", async () => {
      const mockServer = {
        listen: vi.fn().mockRejectedValue(new Error("Listen failed")),
        printUrls: vi.fn(),
        bindCLIShortcuts: vi.fn(),
      };
      const mockCreateServer = vi.mocked(createServer);
      mockCreateServer.mockResolvedValue(mockServer as any);

      await expect(devCommand()).rejects.toThrow("Listen failed");
    });
  });
});
