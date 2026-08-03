import { ValidationError } from "@comity/validation/errors";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { mapZodError } from "../zod-error-mapper.js";

describe("mapZodError", () => {
  it("maps a ZodError to a ValidationError", () => {
    const schema = z.string();
    const result = schema.safeParse(42);

    expect(result.success).toBe(false);

    const error = mapZodError(result.error!);

    expect(error).toBeInstanceOf(ValidationError);
    expect(error.code).toBe("validation:failed");
    expect(error.meta.reason).toBe("failed");
  });

  it("maps field-level errors for object schemas", () => {
    const schema = z.object({
      email: z.email(),
      age: z.number().min(18),
    });
    const result = schema.safeParse({ email: "bad", age: 10 });

    expect(result.success).toBe(false);

    const error = mapZodError(result.error!);

    expect(error.meta.details?.fields).toBeDefined();
    expect(error.meta.details?.fields?.email).toBeDefined();
    expect(error.meta.details?.fields?.age).toBeDefined();
  });

  it("uses code from each Zod issue", () => {
    const schema = z.object({
      email: z.email(),
    });
    const result = schema.safeParse({ email: "invalid" });

    expect(result.success).toBe(false);

    const error = mapZodError(result.error!);
    const fields = error.meta.details?.fields;

    expect(fields).toBeDefined();
    expect(fields!.email[0].code).toBe("invalid_format");
  });

  it("maps nested object paths to dot-separated keys", () => {
    const schema = z.object({
      user: z.object({
        profile: z.object({
          name: z.string().min(1),
        }),
      }),
    });
    const result = schema.safeParse({ user: { profile: { name: "" } } });

    expect(result.success).toBe(false);

    const error = mapZodError(result.error!);
    const fields = error.meta.details?.fields;

    expect(fields).toBeDefined();
    expect(fields!["user.profile.name"]).toBeDefined();
  });

  it("maps array index paths with bracket notation", () => {
    const schema = z.object({
      items: z.array(z.string().email()),
    });
    const result = schema.safeParse({ items: ["not-an-email"] });

    expect(result.success).toBe(false);

    const error = mapZodError(result.error!);
    const fields = error.meta.details?.fields;

    expect(fields).toBeDefined();
    expect(fields!["items[0]"]).toBeDefined();
  });

  it("uses '$' as the root path when path array is empty", () => {
    const schema = z.string().email();
    const result = schema.safeParse("plain-string");

    expect(result.success).toBe(false);

    const error = mapZodError(result.error!);
    const fields = error.meta.details?.fields;

    expect(fields).toBeDefined();
    expect(fields!["$"]).toBeDefined();
  });

  it("preserves issue code for a field with a single error", () => {
    const schema = z.object({
      name: z.string().min(3),
    });
    const result = schema.safeParse({ name: "xy" });

    expect(result.success).toBe(false);

    const error = mapZodError(result.error!);
    const fields = error.meta.details?.fields;

    expect(fields).toBeDefined();

    const issues = fields!["name"];
    expect(issues.length).toBe(1);
    expect(issues[0].code).toBe("too_small");
  });

  it("groups issues by path", () => {
    const schema = z.object({
      a: z.string().email(),
      b: z.string().min(1),
    });
    const result = schema.safeParse({ a: "bad", b: "" });

    expect(result.success).toBe(false);

    const error = mapZodError(result.error!);
    const fields = error.meta.details?.fields;

    expect(fields).toBeDefined();
    expect(Object.keys(fields!).length).toBe(2);
    expect(fields!["a"]).toBeDefined();
    expect(fields!["b"]).toBeDefined();
  });

  it("preserves issue codes for each error", () => {
    const schema = z.string().email();
    const result = schema.safeParse("not-an-email");

    expect(result.success).toBe(false);

    const error = mapZodError(result.error!);
    const fields = error.meta.details?.fields;

    expect(fields).toBeDefined();
    expect(fields!["$"][0].code).toBeDefined();
    expect(typeof fields!["$"][0].code).toBe("string");
  });
});
