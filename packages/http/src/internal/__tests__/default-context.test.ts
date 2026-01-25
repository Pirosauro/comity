import { beforeEach, describe, expect, it } from "vitest";
import { DefaultHttpContext } from "../default-context.js";

describe("DefaultHttpContext", () => {
  let mockRequest: any;
  let mockSignal: AbortSignal;

  beforeEach(() => {
    mockRequest = {
      id: "req-123",
      method: "GET",
      url: new URL("http://localhost/api/users"),
      headers: { "content-type": "application/json" },
      query: { page: "1" },
      params: { id: "123" },
    };

    mockSignal = new AbortController().signal;
  });

  describe("constructor", () => {
    it("should create a context with request and signal", () => {
      const ctx = new DefaultHttpContext(mockRequest, mockSignal);

      expect(ctx).toBeDefined();
      expect(ctx.request).toBe(mockRequest);
      expect(ctx.signal).toBe(mockSignal);
    });

    it("should initialize response as undefined", () => {
      const ctx = new DefaultHttpContext(mockRequest, mockSignal);

      expect(ctx.response).toBeUndefined();
    });

    it("should initialize state", () => {
      const ctx = new DefaultHttpContext(mockRequest, mockSignal);

      expect(ctx.state).toBeDefined();
      expect(typeof ctx.state.get).toBe("function");
      expect(typeof ctx.state.set).toBe("function");
    });
  });

  describe("request getter", () => {
    it("should return the request", () => {
      const ctx = new DefaultHttpContext(mockRequest, mockSignal);

      expect(ctx.request).toBe(mockRequest);
      expect(ctx.request.id).toBe("req-123");
      expect(ctx.request.method).toBe("GET");
    });
  });

  describe("signal getter", () => {
    it("should return the abort signal", () => {
      const ctx = new DefaultHttpContext(mockRequest, mockSignal);

      expect(ctx.signal).toBe(mockSignal);
    });

    it("should work with aborted signal", () => {
      const controller = new AbortController();
      controller.abort();

      const ctx = new DefaultHttpContext(mockRequest, controller.signal);

      expect(ctx.signal.aborted).toBe(true);
    });
  });

  describe("state getter", () => {
    it("should return state object", () => {
      const ctx = new DefaultHttpContext(mockRequest, mockSignal);

      expect(ctx.state).toBeDefined();
      expect(ctx.state.get).toBeDefined();
      expect(ctx.state.set).toBeDefined();
      expect(ctx.state.has).toBeDefined();
    });

    it("should allow storing and retrieving values in state", () => {
      const ctx = new DefaultHttpContext(mockRequest, mockSignal);

      ctx.state.set("userId", 123);
      expect(ctx.state.get("userId")).toBe(123);
    });

    it("should check key existence in state", () => {
      const ctx = new DefaultHttpContext(mockRequest, mockSignal);

      expect(ctx.state.has("userId")).toBe(false);

      ctx.state.set("userId", 123);

      expect(ctx.state.has("userId")).toBe(true);
    });
  });

  describe("response getter", () => {
    it("should return undefined initially", () => {
      const ctx = new DefaultHttpContext(mockRequest, mockSignal);

      expect(ctx.response).toBeUndefined();
    });

    it("should return response after setResponse is called", () => {
      const ctx = new DefaultHttpContext(mockRequest, mockSignal);
      const result = { ok: true, response: { status: 200 } };

      ctx.setResponse(result);

      expect(ctx.response).toBe(result);
    });
  });

  describe("setResponse", () => {
    it("should set response on first call", () => {
      const ctx = new DefaultHttpContext(mockRequest, mockSignal);
      const result = { ok: true, response: { status: 200 } };

      ctx.setResponse(result);

      expect(ctx.response).toBe(result);
    });

    it("should throw on second call", () => {
      const ctx = new DefaultHttpContext(mockRequest, mockSignal);
      const result = { ok: true, response: { status: 200 } };

      ctx.setResponse(result);

      expect(() => {
        ctx.setResponse(result);
      }).toThrow("Response already set");
    });

    it("should handle error results", () => {
      const ctx = new DefaultHttpContext(mockRequest, mockSignal);
      const errorResult = {
        ok: false,
        error: { code: "ERROR", status: 500 },
      };

      ctx.setResponse(errorResult);

      expect(ctx.response).toBe(errorResult);
      expect(ctx.response?.ok).toBe(false);
    });

    it("should handle successful results with headers and body", () => {
      const ctx = new DefaultHttpContext(mockRequest, mockSignal);
      const result = {
        ok: true,
        response: {
          status: 201,
          headers: { "content-type": "application/json" },
          body: { id: 1, name: "Created" },
        },
      };

      ctx.setResponse(result);

      expect(ctx.response).toBe(result);
      expect(ctx.response?.ok).toBe(true);
    });
  });

  describe("multiple contexts", () => {
    it("should have isolated state between contexts", () => {
      const ctx1 = new DefaultHttpContext(mockRequest, mockSignal);
      const ctx2 = new DefaultHttpContext(mockRequest, mockSignal);

      ctx1.state.set("key", "value1");
      ctx2.state.set("key", "value2");

      expect(ctx1.state.get("key")).toBe("value1");
      expect(ctx2.state.get("key")).toBe("value2");
    });

    it("should have different response states", () => {
      const ctx1 = new DefaultHttpContext(mockRequest, mockSignal);
      const ctx2 = new DefaultHttpContext(mockRequest, mockSignal);

      const result1 = { ok: true, response: { status: 200 } };
      ctx1.setResponse(result1);

      expect(ctx1.response).toBe(result1);
      expect(ctx2.response).toBeUndefined();
    });
  });
});
