import { describe, expect, it } from "vitest";
import { redirect } from "../redirect.js";

describe("redirect", () => {
  it("should create redirect response with default status", () => {
    const result = redirect("/new-path", 302);

    expect(result).toEqual({
      intent: "redirect",
      status: 302,
      location: "/new-path",
    });
  });

  it("should create redirect response with custom location", () => {
    const result = redirect("https://example.com", 302);

    expect(result).toEqual({
      intent: "redirect",
      status: 302,
      location: "https://example.com",
    });
  });

  it("should create redirect response with relative path", () => {
    const result = redirect("../parent", 302);

    expect(result).toEqual({
      intent: "redirect",
      status: 302,
      location: "../parent",
    });
  });

  it("should create redirect response with query parameters", () => {
    const result = redirect("/search?q=test&page=1", 302);

    expect(result).toEqual({
      intent: "redirect",
      status: 302,
      location: "/search?q=test&page=1",
    });
  });
});
