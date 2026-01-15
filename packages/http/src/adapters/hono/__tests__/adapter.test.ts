import { beforeEach, describe, expect, it, vi } from "vitest";
import { html } from "../../response/html.js";
import { json } from "../../response/json.js";
import { redirect } from "../../response/redirect.js";
import { text } from "../../response/text.js";
import { HonoHttpAdapter } from "../adapter.js";

describe("HonoHttpAdapter", () => {
  let adapter: HonoHttpAdapter;
  let mockContext: any;

  beforeEach(() => {
    adapter = new HonoHttpAdapter();
    mockContext = {
      redirect: vi.fn(),
      body: vi.fn(),
      json: vi.fn(),
      text: vi.fn(),
      req: {
        raw: {
          signal: new AbortController().signal,
        },
      },
    };
  });

  describe("send", () => {
    it("should handle HTML response", async () => {
      const response = html("<h1>Hello</h1>", 200, {
        "custom-header": "value",
      });

      await adapter.send(response, mockContext);

      expect(mockContext.body).toHaveBeenCalledWith("<h1>Hello</h1>", 200, {
        "content-type": "text/html; charset=utf-8",
        "custom-header": "value",
      });
    });

    it("should handle JSON response", async () => {
      const response = json({ message: "Hello" }, 200, {
        "custom-header": "value",
      });

      await adapter.send(response, mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ message: "Hello" }, 200, {
        "content-type": "application/json; charset=utf-8",
        "custom-header": "value",
      });
    });

    it("should handle text response", async () => {
      const response = text("Hello World", 200, { "custom-header": "value" });

      await adapter.send(response, mockContext);

      expect(mockContext.body).toHaveBeenCalledWith("Hello World", 200, {
        "content-type": "text/plain; charset=utf-8",
        "custom-header": "value",
      });
    });

    it("should handle redirect response", async () => {
      const response = redirect("/new-location", 302);

      await adapter.send(response, mockContext);

      expect(mockContext.redirect).toHaveBeenCalledWith("/new-location", 302);
    });

    it("should handle streaming response", async () => {
      const mockStream = new ReadableStream();
      const response = {
        intent: "html" as const,
        status: 200,
        stream: mockStream,
        abort: vi.fn(),
        headers: { "custom-header": "value" },
      };

      await adapter.send(response, mockContext);

      expect(mockContext.body).toHaveBeenCalledWith(mockStream, 200, {
        "content-type": "text/html; charset=utf-8",
        "custom-header": "value",
      });
    });

    it("should propagate abort signal to streaming response", async () => {
      const mockAbort = vi.fn();
      const mockStream = new ReadableStream();
      const response = {
        intent: "html" as const,
        status: 200,
        stream: mockStream,
        abort: mockAbort,
      };

      const abortController = new AbortController();
      mockContext.req.raw.signal = abortController.signal;

      await adapter.send(response, mockContext);

      // Simulate abort
      abortController.abort();

      expect(mockAbort).toHaveBeenCalled();
    });

    it("should handle response with default status", async () => {
      const response = text("Hello");

      await adapter.send(response, mockContext);

      expect(mockContext.body).toHaveBeenCalledWith("Hello", 200, {
        "content-type": "text/plain; charset=utf-8",
      });
    });

    it("should handle response with no headers", async () => {
      const response = text("Hello", 200);

      await adapter.send(response, mockContext);

      expect(mockContext.body).toHaveBeenCalledWith("Hello", 200, {
        "content-type": "text/plain; charset=utf-8",
      });
    });

    it("should convert non-string body to string", async () => {
      const response = {
        intent: "text" as const,
        status: 200,
        body: 123,
      };

      await adapter.send(response, mockContext);

      expect(mockContext.body).toHaveBeenCalledWith("123", 200, {
        "content-type": "text/plain; charset=utf-8",
      });
    });
  });
});
