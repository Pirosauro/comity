import { describe, expect, it } from "vitest";
import { NotFoundError } from "../not-found.js";

describe("NotFoundError", () => {
  it("should create error with entity name", () => {
    const error = new NotFoundError("user");

    expect(error.message).toBe("user not found");
    expect(error.code).toBe("NOT_FOUND");
    expect(error.name).toBe("NotFoundError");
    expect(error.meta.httpStatus).toBe(404);
  });

  it("should create error with entity name and custom message via meta", () => {
    const error = new NotFoundError("file", { path: "/tmp/test.txt" });

    expect(error.message).toBe("file not found");
    expect(error.code).toBe("NOT_FOUND");
    expect(error.meta.httpStatus).toBe(404);
    expect(error.meta.path).toBe("/tmp/test.txt");
  });

  it("should include additional metadata", () => {
    const error = new NotFoundError("record", {
      id: "123",
      table: "users",
    });

    expect(error.message).toBe("record not found");
    expect(error.meta.id).toBe("123");
    expect(error.meta.table).toBe("users");
    expect(error.meta.httpStatus).toBe(404);
  });

  it("should be instanceof Error", () => {
    const error = new NotFoundError("item");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(NotFoundError);
  });

  it("should have correct stack trace", () => {
    const error = new NotFoundError("resource");

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain("NotFoundError");
  });
});
