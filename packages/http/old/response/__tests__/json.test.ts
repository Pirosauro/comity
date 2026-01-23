import { describe, expect, it } from "vitest";
import { json } from "../json.js";

describe("json", () => {
  it("should create JSON response with default status", () => {
    const result = json({ message: "Hello World" });

    expect(result).toEqual({
      intent: "json",
      status: 200,
      body: { message: "Hello World" },
    });
  });

  it("should create JSON response with custom status", () => {
    const result = json({ error: "Not found" }, 404);

    expect(result).toEqual({
      intent: "json",
      status: 404,
      body: { error: "Not found" },
    });
  });

  it("should create JSON response with headers", () => {
    const result = json({ data: "test" }, 200, {
      "content-type": "application/json",
      "custom-header": "value",
    });

    expect(result).toEqual({
      intent: "json",
      status: 200,
      body: { data: "test" },
      headers: {
        "content-type": "application/json",
        "custom-header": "value",
      },
    });
  });

  it("should create JSON response with null body", () => {
    const result = json(null, 204);

    expect(result).toEqual({
      intent: "json",
      status: 204,
      body: null,
    });
  });

  it("should create JSON response with array body", () => {
    const result = json([1, 2, 3]);

    expect(result).toEqual({
      intent: "json",
      status: 200,
      body: [1, 2, 3],
    });
  });

  it("should create JSON response with empty headers", () => {
    const result = json({ data: "test" }, 200, {});

    expect(result).toEqual({
      intent: "json",
      status: 200,
      body: { data: "test" },
      headers: {},
    });
  });
});
