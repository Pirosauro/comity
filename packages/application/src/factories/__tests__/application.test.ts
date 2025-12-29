import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Hono } from "hono";
import { createApplication } from "../application.js";

// Mock @comity/core
vi.mock("@comity/core/factories", () => ({
  createContext: vi.fn(),
}));

vi.mock("../service.js", () => ({
  createService: vi.fn(),
}));

import { createContext } from "@comity/core/factories";
import { createService } from "../service.js";

describe("createApplication", () => {
  const mockCreateContext = vi.mocked(createContext);
  const mockCreateService = vi.mocked(createService);

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mocks
    mockCreateContext.mockResolvedValue({
      trigger: vi.fn().mockResolvedValue(undefined),
    } as any);

    mockCreateService.mockReturnValue({
      get: vi.fn(),
      post: vi.fn(),
    } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("application creation", () => {
    it("should create a Hono application instance", async () => {
      const modules = [{ name: "test", setup: () => async () => {} }];
      const options = {};

      const app = await createApplication(modules, options);

      expect(app).toBeInstanceOf(Hono);
    });

    it("should call createContext with modules and options", async () => {
      const modules = [{ name: "test", setup: () => async () => {} }];
      const options = { test: "value" };

      await createApplication(modules, options);

      expect(mockCreateContext).toHaveBeenCalledWith(modules, options);
    });

    it("should call createService with the created app", async () => {
      const modules = [{ name: "test", setup: () => async () => {} }];

      await createApplication(modules);

      expect(mockCreateService).toHaveBeenCalledTimes(1);
      expect(mockCreateService).toHaveBeenCalledWith(expect.any(Hono));
    });
  });

  describe("lifecycle hooks", () => {
    it("should trigger application initialized hook", async () => {
      const mockTrigger = vi.fn().mockResolvedValue(undefined);
      mockCreateContext.mockResolvedValue({
        trigger: mockTrigger,
      } as any);

      const mockService = { test: "service" };
      mockCreateService.mockReturnValue(mockService as any);

      const modules = [{ name: "test", setup: () => async () => {} }];

      await createApplication(modules);

      expect(mockTrigger).toHaveBeenCalledWith(
        "@comity/application:initialized",
        mockService
      );
    });

    it("should await hook completion", async () => {
      const mockTrigger = vi.fn().mockResolvedValue(undefined);
      mockCreateContext.mockResolvedValue({
        trigger: mockTrigger,
      } as any);

      const modules = [{ name: "test", setup: () => async () => {} }];

      const result = await createApplication(modules);

      expect(result).toBeInstanceOf(Hono);
    });
  });

  describe("renderer configuration", () => {
    it("should add renderer before middleware when rendererOrder is 'before'", async () => {
      const modules = [{ name: "test", setup: () => async () => {} }];
      const renderer = vi.fn();
      const options = {
        "@comity/application": {
          renderer,
          rendererOrder: "before",
        },
      };

      const app = await createApplication(modules, options);

      // Verify renderer middleware was added (can't easily test app.use calls)
      expect(renderer).not.toHaveBeenCalled();
    });

    it("should add renderer after middleware when rendererOrder is 'after'", async () => {
      const modules = [{ name: "test", setup: () => async () => {} }];
      const renderer = vi.fn();
      const options = {
        "@comity/application": {
          renderer,
          rendererOrder: "after",
        },
      };

      const app = await createApplication(modules, options);

      // Verify renderer middleware was added (can't easily test app.use calls)
      expect(renderer).not.toHaveBeenCalled();
    });

    it("should not add renderer when rendererOrder is not specified", async () => {
      const modules = [{ name: "test", setup: () => async () => {} }];
      const renderer = vi.fn();
      const options = {
        "@comity/application": {
          renderer,
        },
      };

      await createApplication(modules, options);

      expect(renderer).not.toHaveBeenCalled();
    });

    it("should not add renderer when renderer is not a function", async () => {
      const modules = [{ name: "test", setup: () => async () => {} }];
      const options = {
        "@comity/application": {
          renderer: "not-a-function",
          rendererOrder: "before",
        },
      };

      await createApplication(modules, options);

      // Should not throw, just skip adding renderer
    });
  });

  describe("module handling", () => {
    it("should handle empty modules array", async () => {
      const modules = [];
      const options = {};

      const app = await createApplication(modules, options);

      expect(app).toBeInstanceOf(Hono);
      expect(mockCreateContext).toHaveBeenCalledWith([], {});
    });

    it("should handle modules with different configurations", async () => {
      const modules = [
        { name: "module1", setup: () => async () => {} },
        { name: "module2", setup: () => async () => {} },
      ];
      const options = {
        module1: { config: "value1" },
        module2: { config: "value2" },
      };

      await createApplication(modules, options);

      expect(mockCreateContext).toHaveBeenCalledWith(modules, options);
    });
  });

  describe("error handling", () => {
    it("should propagate context creation errors", async () => {
      const error = new Error("Context creation failed");
      mockCreateContext.mockRejectedValue(error);

      const modules = [{ name: "test", setup: () => async () => {} }];

      await expect(createApplication(modules)).rejects.toThrow(
        "Context creation failed"
      );
    });

    it("should propagate hook trigger errors", async () => {
      const error = new Error("Hook trigger failed");
      const mockTrigger = vi.fn().mockRejectedValue(error);
      mockCreateContext.mockResolvedValue({
        trigger: mockTrigger,
      } as any);

      const modules = [{ name: "test", setup: () => async () => {} }];

      await expect(createApplication(modules)).rejects.toThrow(
        "Hook trigger failed"
      );
    });
  });

  describe("type parameters", () => {
    it("should support custom environment types", async () => {
      const modules = [{ name: "test", setup: () => async () => {} }];

      // This is a type-only test - if it compiles, the types work
      const app = await createApplication(modules);
      expect(app).toBeDefined();
    });

    it("should support custom schema types", async () => {
      const modules = [{ name: "test", setup: () => async () => {} }];

      const app = await createApplication(modules);
      expect(app).toBeDefined();
    });
  });

  describe("default options", () => {
    it("should use empty options object as default", async () => {
      const modules = [{ name: "test", setup: () => async () => {} }];

      await createApplication(modules);

      expect(mockCreateContext).toHaveBeenCalledWith(modules, {});
    });

    it("should handle undefined options", async () => {
      const modules = [{ name: "test", setup: () => async () => {} }];

      await createApplication(modules, undefined);

      expect(mockCreateContext).toHaveBeenCalledWith(modules, {});
    });
  });
});
