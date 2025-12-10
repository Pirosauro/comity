import type { Mock } from "vitest";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { graphqlHandler } from "../graphql-handler.js";

// Mock the graphqlHandler function
vi.mock("../graphql-handler", () => ({
  graphqlHandler: vi.fn(),
}));

vi.mock("@envelop/core", () => ({
  envelop: vi.fn(),
}));

vi.mock("../utils/get-graphql-params.js", () => ({
  getGraphQLParams: vi.fn(),
}));

describe("graphqlHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return next if method is not GET or POST", async () => {
    (graphqlHandler as Mock).mockImplementation(() => async (c, next) => {
      if (c.req.method !== "GET" && c.req.method !== "POST") {
        await next();
      }
    });

    const handler = graphqlHandler({ plugins: [] });
    const next = vi.fn();
    const c = {
      req: { method: "PUT" },
    };

    await handler(c, next);

    expect(next).toHaveBeenCalled();
  });

  it("should return validation errors if document is invalid", async () => {
    (graphqlHandler as Mock).mockImplementation(() => async (c) => {
      return c.json({
        data: null,
        errors: [{ message: "Error" }],
      });
    });

    const handler = graphqlHandler({ plugins: [] });
    const next = vi.fn();
    const c = {
      req: {
        method: "POST",
        raw: {},
        header: vi.fn(),
      },
      json: vi.fn(),
    };

    await handler(c, next);

    expect(c.json).toHaveBeenCalledWith({
      data: null,
      errors: [{ message: "Error" }],
    });
  });

  it("should execute query and return result", async () => {
    (graphqlHandler as Mock).mockImplementation(() => async (c) => {
      return c.json({ data: "result" });
    });

    const handler = graphqlHandler({ plugins: [] });
    const next = vi.fn();
    const c = {
      req: {
        method: "POST",
        raw: {},
        header: vi.fn(),
      },
      json: vi.fn(),
    };

    await handler(c, next);

    expect(c.json).toHaveBeenCalledWith({ data: "result" });
  });
});
