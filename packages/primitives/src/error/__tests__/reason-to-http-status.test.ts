import { describe, expect, it } from "vitest";
import { reasonToHttpStatus } from "../reason-to-http-status.js";

describe("reasonToHttpStatus", () => {
  it("should return 400 for bad_request", () => {
    expect(reasonToHttpStatus("bad_request")).toBe(400);
  });

  it("should return 401 for unauthorized", () => {
    expect(reasonToHttpStatus("unauthorized")).toBe(401);
  });

  it("should return 403 for forbidden", () => {
    expect(reasonToHttpStatus("forbidden")).toBe(403);
  });

  it("should return 404 for not_found", () => {
    expect(reasonToHttpStatus("not_found")).toBe(404);
  });

  it("should return 409 for conflict", () => {
    expect(reasonToHttpStatus("conflict")).toBe(409);
  });

  it("should return 422 for unprocessable_entity", () => {
    expect(reasonToHttpStatus("unprocessable_entity")).toBe(422);
  });

  it("should return 429 for too_many_requests", () => {
    expect(reasonToHttpStatus("too_many_requests")).toBe(429);
  });

  it("should return 500 for internal_server_error", () => {
    expect(reasonToHttpStatus("internal_server_error")).toBe(500);
  });

  it("should return 501 for not_implemented", () => {
    expect(reasonToHttpStatus("not_implemented")).toBe(501);
  });

  it("should return 503 for service_unavailable", () => {
    expect(reasonToHttpStatus("service_unavailable")).toBe(503);
  });

  it("should be case-insensitive", () => {
    expect(reasonToHttpStatus("BAD_REQUEST")).toBe(400);
    expect(reasonToHttpStatus("Unauthorized")).toBe(401);
    expect(reasonToHttpStatus("FORBIDDEN")).toBe(403);
  });

  it("should return 500 for unrecognized reasons", () => {
    expect(reasonToHttpStatus("unknown_reason")).toBe(500);
    expect(reasonToHttpStatus("invalid")).toBe(500);
  });

  it("should override default mappings with additional reasons", () => {
    expect(reasonToHttpStatus("bad_request", { bad_request: 418 })).toBe(418);
  });

  it("should add new custom reasons via additional parameter", () => {
    expect(reasonToHttpStatus("custom_status", { custom_status: 444 })).toBe(444);
  });

  it("should return 500 for empty string", () => {
    expect(reasonToHttpStatus("")).toBe(500);
  });
});
