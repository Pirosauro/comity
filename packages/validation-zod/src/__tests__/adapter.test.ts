import { describe, expect, it } from "vitest";
import { z } from "zod";
import { ZodValidator } from "../adapter.js";

describe("ZodValidator", () => {
  it("returns success for valid input", async () => {
    const schema = z.string();
    const validator = new ZodValidator(schema);
    const result = await validator.validate("hello");

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.value).toBe("hello");
    }
  });

  it("returns failure for invalid input", async () => {
    const schema = z.string();
    const validator = new ZodValidator(schema);
    const result = await validator.validate(42 as unknown as string);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.code).toBe("validation:failed");
    }
  });

  it("returns failure with field-level errors for object schemas", async () => {
    const schema = z.object({
      name: z.string(),
      age: z.number().min(18),
    });
    const validator = new ZodValidator(schema);
    const result = await validator.validate({ name: 123, age: 10 } as unknown as {
      name: string;
      age: number;
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe("validation:failed");
      expect(result.error.meta.reason).toBe("failed");
      expect(result.error.meta.details?.fields).toBeDefined();
    }
  });

  it("returns failure with root-level issues when no path is present", async () => {
    const schema = z.string().email();
    const validator = new ZodValidator(schema);
    const result = await validator.validate("not-an-email");

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.code).toBe("validation:failed");
      expect(result.error.meta.details?.fields).toBeDefined();
    }
  });

  it("returns success for valid object with multiple fields", async () => {
    const schema = z.object({
      email: z.string().email(),
      age: z.number().min(1),
    });
    const validator = new ZodValidator(schema);
    const result = await validator.validate({ email: "a@b.com", age: 25 });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.value).toEqual({ email: "a@b.com", age: 25 });
    }
  });

  it("returns success for input matching transformation schema", async () => {
    const schema = z.string().trim().toLowerCase();
    const validator = new ZodValidator(schema);
    const result = await validator.validate(" hello ");

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.value).toBe(" hello ");
    }
  });

  it("returns failure with multiple field errors", async () => {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
    });
    const validator = new ZodValidator(schema);
    const result = await validator.validate({
      email: "invalid",
      password: "short",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const fields = result.error.meta.details?.fields;

      expect(fields).toBeDefined();
      expect(fields!.email).toBeDefined();
      expect(fields!.password).toBeDefined();
    }
  });

  it("works with optional fields", async () => {
    const schema = z.object({
      name: z.string().optional(),
    });
    const validator = new ZodValidator(schema);
    const result = await validator.validate({});

    expect(result.success).toBe(true);
  });

  it("works with nullable fields", async () => {
    const schema = z.string().nullable();
    const validator = new ZodValidator(schema);
    const result = await validator.validate(null as unknown as string);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.value).toBeNull();
    }
  });

  it("validates arrays", async () => {
    const schema = z.array(z.string());
    const validator = new ZodValidator(schema);
    const result = await validator.validate(["a", "b"]);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.value).toEqual(["a", "b"]);
    }
  });

  it("returns failure for invalid array element", async () => {
    const schema = z.array(z.string());
    const validator = new ZodValidator(schema);
    const result = await validator.validate([1, 2] as unknown as string[]);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.code).toBe("validation:failed");
    }
  });
});
