import { describe, it, expect, vi, beforeEach } from "vitest";
import type { CoreContextInterface } from "@comity/core";
import type { AuthModuleOptions } from "../types.js";
import { setup } from "../setup.js";
import * as middleware from "../middleware.js";
import * as utils from "../utils/index.js";

// Mock the middleware module
vi.mock("../middleware.js", () => ({
  createJWTMiddleware: vi.fn(() => vi.fn()),
}));

// Mock the utils module
vi.mock("../utils/index.js", () => ({
  handleLogin: vi.fn(),
  handleLogout: vi.fn(),
  handleTokenRefresh: vi.fn(),
  handleRefresh: vi.fn(),
  signToken: vi.fn(),
}));

describe("Auth Module Setup", () => {
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

  const mockContext: CoreContextInterface = {
    app: {
      use: vi.fn(),
    } as any,
    api: {
      use: vi.fn(),
    } as any,
    logger: mockLogger as any,
    emit: vi.fn(),
    onHook: vi.fn(),
    onEvent: vi.fn(),
    trigger: vi.fn(),
  } as any;

  const validOptions: AuthModuleOptions = {
    secret: "test-secret-key",
    lifetime: 3600,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("module metadata", () => {
    it("should export ModuleMeta with correct name", () => {
      expect(setup.name).toBe("@comity/auth");
    });

    it("should have correct version", () => {
      expect(setup.version).toBe("1.0.0");
    });

    it("should have required dependencies", () => {
      expect(setup.requires).toContain("@comity/application");
      expect(setup.requires).toContain("@comity/logger");
      expect(setup.requires).toHaveLength(2);
    });

    it("should have empty incompatibleWith array", () => {
      expect(setup.incompatibleWith).toEqual([]);
    });

    it("should have setup function", () => {
      expect(typeof setup.setup).toBe("function");
    });
  });

  describe("setup function", () => {
    it("should throw error when no secret is provided", async () => {
      await expect(setup.setup()).rejects.toThrow(
        "JWT secret is required for @comity/auth module"
      );
    });

    it("should throw error when empty options provided", async () => {
      await expect(setup.setup({} as AuthModuleOptions)).rejects.toThrow(
        "JWT secret is required for @comity/auth module"
      );
    });

    it("should return a function when called with valid options", async () => {
      const setupFn = await setup.setup(validOptions);
      expect(setupFn).toBeInstanceOf(Function);
    });

    it("should configure JWT middleware on both app and api", async () => {
      const mockMiddleware = vi.fn();
      vi.mocked(middleware.createJWTMiddleware).mockReturnValue(mockMiddleware);

      // Patch onHook to immediately invoke the callback for @comity/application:initialized
      const onHookSpy = vi
        .spyOn(mockContext, "onHook")
        .mockImplementation((hook, cb) => {
          if (hook === "@comity/application:initialized") {
            cb((mockContext as any).app);
          }
        });

      const setupFn = await setup.setup(validOptions);
      await setupFn(mockContext);

      expect(middleware.createJWTMiddleware).toHaveBeenCalledWith(
        validOptions,
        mockContext
      );
      expect((mockContext as any).app.use).toHaveBeenCalledWith(mockMiddleware);
      onHookSpy.mockRestore();
    });

    it("should emit auth:initialized event with auth service", async () => {
      const setupFn = await setup.setup(validOptions);
      await setupFn(mockContext);

      expect(mockContext.emit).toHaveBeenCalledWith(
        "@comity/auth:initialized",
        expect.objectContaining({
          login: expect.any(Function),
          logout: expect.any(Function),
          refreshToken: expect.any(Function),
          signToken: expect.any(Function),
        })
      );
    });

    it("should handle options with all JWT configuration", async () => {
      const fullOptions: AuthModuleOptions = {
        secret: "test-secret",
        lifetime: 7200,
        issuer: "test-issuer",
        audience: "test-audience",
        cookie: {
          name: "jwt-token",
          domain: "example.com",
          secure: true,
          httpOnly: true,
          sameSite: "strict",
        },
      };

      // Patch onHook to immediately invoke the callback for @comity/application:initialized
      const onHookSpy = vi
        .spyOn(mockContext, "onHook")
        .mockImplementation((hook, cb) => {
          if (hook === "@comity/application:initialized") {
            cb((mockContext as any).app);
          }
        });

      const setupFn = await setup.setup(fullOptions);
      await setupFn(mockContext);

      expect(middleware.createJWTMiddleware).toHaveBeenCalledWith(
        fullOptions,
        mockContext
      );
      onHookSpy.mockRestore();
    });
  });

  describe("auth service", () => {
    let authService: any;

    beforeEach(async () => {
      const setupFn = await setup.setup(validOptions);
      await setupFn(mockContext);

      // Get the auth service from the emit call
      const emitCall = vi
        .mocked(mockContext.emit)
        .mock.calls.find((call) => call[0] === "@comity/auth:initialized");
      authService = emitCall?.[1];
    });

    it("should provide login method", () => {
      expect(authService).toHaveProperty("login");
      expect(typeof authService.login).toBe("function");
    });

    it("should provide logout method", () => {
      expect(authService).toHaveProperty("logout");
      expect(typeof authService.logout).toBe("function");
    });

    it("should provide refreshToken method", () => {
      expect(authService).toHaveProperty("refreshToken");
      expect(typeof authService.refreshToken).toBe("function");
    });

    it("should provide signToken method", () => {
      expect(authService).toHaveProperty("signToken");
      expect(typeof authService.signToken).toBe("function");
    });

    describe("login method", () => {
      it("should call handleLogin and emit user-logged-in event", async () => {
        const mockUser = { id: "user-1", roles: { admin: ["read"] } };
        const mockHonoContext = { req: { header: vi.fn() } };
        const mockToken = "jwt-token";

        vi.mocked(utils.handleLogin).mockResolvedValue(mockToken);

        const result = await authService.login(mockUser, mockHonoContext);

        expect(utils.handleLogin).toHaveBeenCalledWith(
          mockUser,
          mockHonoContext,
          validOptions
        );
        expect(mockContext.emit).toHaveBeenCalledWith(
          "@comity/auth:user-logged-in",
          { user: mockUser, token: mockToken }
        );
        expect(result).toBe(mockToken);
      });
    });

    describe("logout method", () => {
      it("should call handleLogout and emit user-logged-out event", () => {
        const mockUser = { id: "user-1", roles: { admin: ["read"] } };
        const mockHonoContext = {
          get: vi.fn().mockReturnValue(mockUser),
          req: { header: vi.fn() },
        };

        authService.logout(mockHonoContext);

        expect(utils.handleLogout).toHaveBeenCalledWith(
          mockHonoContext,
          validOptions
        );
        expect(mockContext.emit).toHaveBeenCalledWith(
          "@comity/auth:user-logged-out",
          { user: mockUser }
        );
      });

      it("should handle logout when no user in context", () => {
        const mockHonoContext = {
          get: vi.fn().mockReturnValue(undefined),
          req: { header: vi.fn() },
        };

        authService.logout(mockHonoContext);

        expect(utils.handleLogout).toHaveBeenCalledWith(
          mockHonoContext,
          validOptions
        );
        expect(mockContext.emit).toHaveBeenCalledWith(
          "@comity/auth:user-logged-out",
          { user: undefined }
        );
      });
    });

    describe("refreshToken method", () => {
      it("should call handleRefresh and emit token-refreshed event", async () => {
        const mockHonoContext = {
          req: {
            header: vi.fn().mockReturnValue("Bearer old-token"),
          },
        };
        vi.mocked(utils.handleRefresh).mockResolvedValue({
          outdated: "old-token",
          current: "new-jwt-token",
        });

        const result = await authService.refreshToken(mockHonoContext);

        expect(utils.handleRefresh).toHaveBeenCalledWith(
          mockHonoContext,
          validOptions
        );
        const emitCalls = vi.mocked(mockContext.emit).mock.calls;
        const tokenRefreshedCall = emitCalls.find(
          (call) => call[0] === "@comity/auth:token-refreshed"
        );
        expect(tokenRefreshedCall).toBeDefined();
        expect(tokenRefreshedCall && tokenRefreshedCall[1]).toEqual({
          outdated: "old-token",
          current: "new-jwt-token",
          timestamp: expect.any(Number),
        });
        expect(result).toBe("new-jwt-token");
      });

      it("should handle missing authorization header", async () => {
        const mockHonoContext = {
          req: {
            header: vi.fn().mockReturnValue(undefined),
          },
        };
        vi.mocked(utils.handleRefresh).mockResolvedValue({
          outdated: "",
          current: "new-jwt-token",
        });

        const result = await authService.refreshToken(mockHonoContext);

        expect(utils.handleRefresh).toHaveBeenCalledWith(
          mockHonoContext,
          validOptions
        );
        const emitCalls = vi.mocked(mockContext.emit).mock.calls;
        const tokenRefreshedCall = emitCalls.find(
          (call) => call[0] === "@comity/auth:token-refreshed"
        );
        expect(tokenRefreshedCall).toBeDefined();
        expect(tokenRefreshedCall && tokenRefreshedCall[1]).toEqual({
          outdated: "",
          current: "new-jwt-token",
          timestamp: expect.any(Number),
        });
        expect(result).toBe("new-jwt-token");
      });
    });

    describe("signToken method", () => {
      it("should call signToken utility", async () => {
        const mockUser = { id: "user-1", roles: { admin: ["read"] } };
        const mockToken = "signed-token";

        vi.mocked(utils.signToken).mockResolvedValue(mockToken);

        const result = await authService.signToken(mockUser);

        expect(utils.signToken).toHaveBeenCalledWith(mockUser, validOptions);
        expect(result).toBe(mockToken);
      });
    });
  });

  describe("module integration", () => {
    it("should be importable as named export", () => {
      expect(setup).toBeDefined();
      expect(typeof setup).toBe("object");
    });

    it("should have all required properties for ModuleMeta", () => {
      expect(setup).toHaveProperty("name");
      expect(setup).toHaveProperty("version");
      expect(setup).toHaveProperty("setup");
      expect(setup).toHaveProperty("requires");
      expect(setup).toHaveProperty("incompatibleWith");

      expect(typeof setup.name).toBe("string");
      expect(typeof setup.version).toBe("string");
      expect(Array.isArray(setup.requires)).toBe(true);
      expect(Array.isArray(setup.incompatibleWith)).toBe(true);
      expect(typeof setup.setup).toBe("function");
    });

    it("should follow comity module pattern", () => {
      // Name should follow package convention
      expect(setup.name).toBe("@comity/auth");

      // Dependencies should be strings
      setup.requires?.forEach((dep: string) => {
        expect(typeof dep).toBe("string");
      });

      // Version should be valid semver format
      expect(setup.version).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it("should have setup function that returns async function", async () => {
      const setupFn = await setup.setup(validOptions);

      expect(setupFn).toBeInstanceOf(Function);

      // The returned function should be async (returns Promise)
      const result = setupFn(mockContext);

      expect(result).toBeInstanceOf(Promise);

      await result; // Should not throw
    });
  });
});
