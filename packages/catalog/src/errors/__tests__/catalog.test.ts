import { describe, expect, it } from "vitest";
import { CatalogError } from "../catalog.js";

describe("CatalogError", () => {
  it("should expose reason-based code, message, and http status", () => {
    const error = new CatalogError("invalid_product", {
      details: { field: "name" },
    });

    expect(error.code).toBe("catalog:invalid_product");
    expect(error.message).toBe("Invalid product");
    expect(error.meta.httpStatus).toBe(400);
    expect(error.meta.details).toEqual({ field: "name" });
  });

  it("should expose transition details", () => {
    const error = new CatalogError("invalid_status_transition", {
      details: { from: "draft", to: "archived" },
    });

    expect(error.code).toBe("catalog:invalid_status_transition");
    expect(error.meta.httpStatus).toBe(409);
    expect(error.meta.details).toEqual({ from: "draft", to: "archived" });
  });

  it("should be an instance of BaseError", () => {
    const error = new CatalogError("invalid_product");
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("CatalogError");
  });
});