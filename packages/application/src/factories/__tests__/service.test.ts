import { describe, it, expect, vi, beforeEach } from "vitest";
import { Hono } from "hono";
import { createService } from "../service.js";

describe("createService", () => {
  let app: Hono;
  let service: ReturnType<typeof createService>;

  beforeEach(() => {
    app = new Hono();
  });

  describe("service creation", () => {
    it("should return an object with all required methods", () => {
      service = createService(app);
      expect(service).toBeDefined();
      expect(typeof service.get).toBe("function");
      expect(typeof service.post).toBe("function");
      expect(typeof service.put).toBe("function");
      expect(typeof service.delete).toBe("function");
      expect(typeof service.options).toBe("function");
      expect(typeof service.patch).toBe("function");
      expect(typeof service.all).toBe("function");
      expect(typeof service.use).toBe("function");
      expect(typeof service.on).toBe("function");
      expect(typeof service.route).toBe("function");
      expect(typeof service.mount).toBe("function");
      expect(typeof service.fetch).toBe("function");
      expect(typeof service.request).toBe("function");
      expect(typeof service.notFound).toBe("function");
      expect(typeof service.onError).toBe("function");
      expect(typeof service.lazy).toBe("function");
    });

    it("should bind methods to the original app instance", () => {
      const mockGet = vi.fn();
      app.get = mockGet;
      service = createService(app);

      service.get("/test", (c) => c.text("test"));

      expect(mockGet).toHaveBeenCalledWith("/test", expect.any(Function));
    });
  });

  describe("HTTP methods", () => {
    it("should delegate get method to app", () => {
      const mockGet = vi.fn();
      app.get = mockGet;
      service = createService(app);

      const handler = (c: any) => c.text("get");
      service.get("/test", handler);

      expect(mockGet).toHaveBeenCalledWith("/test", handler);
    });

    it("should delegate post method to app", () => {
      const mockPost = vi.fn();
      app.post = mockPost;
      service = createService(app);

      const handler = (c: any) => c.text("post");
      service.post("/test", handler);

      expect(mockPost).toHaveBeenCalledWith("/test", handler);
    });

    it("should delegate put method to app", () => {
      const mockPut = vi.fn();
      app.put = mockPut;
      service = createService(app);

      const handler = (c: any) => c.text("put");
      service.put("/test", handler);

      expect(mockPut).toHaveBeenCalledWith("/test", handler);
    });

    it("should delegate delete method to app", () => {
      const mockDelete = vi.fn();
      app.delete = mockDelete;
      service = createService(app);

      const handler = (c: any) => c.text("delete");
      service.delete("/test", handler);

      expect(mockDelete).toHaveBeenCalledWith("/test", handler);
    });

    it("should delegate patch method to app", () => {
      const mockPatch = vi.fn();
      app.patch = mockPatch;
      service = createService(app);

      const handler = (c: any) => c.text("patch");
      service.patch("/test", handler);

      expect(mockPatch).toHaveBeenCalledWith("/test", handler);
    });

    it("should delegate options method to app", () => {
      const mockOptions = vi.fn();
      app.options = mockOptions;
      service = createService(app);

      const handler = (c: any) => c.text("options");
      service.options("/test", handler);

      expect(mockOptions).toHaveBeenCalledWith("/test", handler);
    });

    it("should delegate all method to app", () => {
      const mockAll = vi.fn();
      app.all = mockAll;
      service = createService(app);

      const handler = (c: any) => c.text("all");
      service.all("/test", handler);

      expect(mockAll).toHaveBeenCalledWith("/test", handler);
    });
  });

  describe("middleware methods", () => {
    it("should delegate use method to app", () => {
      const mockUse = vi.fn();
      app.use = mockUse;
      service = createService(app);

      const middleware = (c: any, next: any) => next();
      service.use("/test/*", middleware);

      expect(mockUse).toHaveBeenCalledWith("/test/*", middleware);
    });

    it("should delegate on method to app", () => {
      const mockOn = vi.fn();
      app.on = mockOn;
      service = createService(app);

      const handler = (c: any) => c.text("on");
      service.on("GET", "/test", handler);

      expect(mockOn).toHaveBeenCalledWith("GET", "/test", handler);
    });

    it("should delegate route method to app", () => {
      const mockRoute = vi.fn();
      app.route = mockRoute;
      service = createService(app);

      const subApp = new Hono();
      service.route("/api", subApp);

      expect(mockRoute).toHaveBeenCalledWith("/api", subApp);
    });

    it("should delegate mount method to app", () => {
      const mockMount = vi.fn();
      app.mount = mockMount;
      service = createService(app);

      const subApp = new Hono();
      service.mount("/api", subApp);

      expect(mockMount).toHaveBeenCalledWith("/api", subApp);
    });
  });

  describe("utility methods", () => {
    it("should delegate fetch method to app", async () => {
      const mockFetch = vi.fn().mockResolvedValue(new Response());
      app.fetch = mockFetch;
      service = createService(app);

      const request = new Request("http://test.com");
      await service.fetch(request);

      expect(mockFetch).toHaveBeenCalledWith(request);
    });

    it("should delegate request method to app", async () => {
      const mockRequest = vi.fn().mockResolvedValue(new Response());
      app.request = mockRequest;
      service = createService(app);

      await service.request("http://test.com");

      expect(mockRequest).toHaveBeenCalledWith("http://test.com");
    });

    it("should delegate notFound method to app", () => {
      const mockNotFound = vi.fn();
      app.notFound = mockNotFound;
      service = createService(app);

      const handler = (c: any) => c.text("404");
      service.notFound(handler);

      expect(mockNotFound).toHaveBeenCalledWith(handler);
    });

    it("should delegate onError method to app", () => {
      const mockOnError = vi.fn();
      app.onError = mockOnError;
      service = createService(app);

      const handler = (c: any, err: any) => c.text("error");
      service.onError(handler);

      expect(mockOnError).toHaveBeenCalledWith(handler);
    });
  });

  describe("lazy method", () => {
    it("should register a lazy-loaded handler", async () => {
      const mockOn = vi.fn();
      app.on = mockOn;
      service = createService(app);

      const loader = vi.fn().mockResolvedValue({
        default: (c: any, next: any) => c.text("lazy"),
      });

      service.lazy("GET", "/lazy", loader);

      expect(mockOn).toHaveBeenCalledWith("GET", "/lazy", expect.any(Function));

      // Test that the lazy handler works
      const registeredHandler = mockOn.mock.calls[0][2];
      const mockContext = { text: vi.fn().mockReturnValue("response") };
      const mockNext = vi.fn();

      await registeredHandler(mockContext, mockNext);

      expect(loader).toHaveBeenCalled();
      expect(mockContext.text).toHaveBeenCalledWith("lazy");
    });

    it("should handle loader errors", async () => {
      const mockOn = vi.fn();
      app.on = mockOn;
      service = createService(app);

      const loader = vi.fn().mockRejectedValue(new Error("Load failed"));

      service.lazy("GET", "/lazy", loader);

      const registeredHandler = mockOn.mock.calls[0][2];
      const mockContext = {};
      const mockNext = vi.fn();

      await expect(registeredHandler(mockContext, mockNext)).rejects.toThrow(
        "Load failed"
      );
    });

    it("should support different HTTP methods", () => {
      const mockOn = vi.fn();
      app.on = mockOn;
      service = createService(app);

      const loader = vi.fn().mockResolvedValue({
        default: (c: any) => c.text("ok"),
      });

      service.lazy("POST", "/api", loader);

      expect(mockOn).toHaveBeenCalledWith("POST", "/api", expect.any(Function));
    });
  });

  describe("type safety", () => {
    it("should support generic type parameters", () => {
      const typedApp = new Hono<{ Bindings: { userId: string } }>();
      const typedService = createService(typedApp);

      expect(typedService).toBeDefined();
      expect(typeof typedService.get).toBe("function");
    });
  });
});
