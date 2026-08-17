import { describe, expect, it, vi } from "vitest";
import { createTypesafeFactory } from "../factory.js";
import { TypesafeI18nLoader } from "../loader.js";

describe("createTypesafeFactory", () => {
  it("creates a translator delegating to the underlying i18n instance", () => {
    const createI18n = vi.fn((locale: string) => ({
      t: (key: string, params?: Record<string, unknown>) => `${locale}:${key}:${JSON.stringify(params)}`,
    }));
    const factory = createTypesafeFactory(createI18n);

    const translator = factory("it", { greeting: "Ciao" });

    expect(createI18n).toHaveBeenCalledWith("it", { greeting: "Ciao" });
    expect(translator.locale).toBe("it");
    expect(translator.t("greeting")).toBe('it:greeting:undefined');
    expect(translator.t("greeting", { name: "Anna" })).toBe('it:greeting:{"name":"Anna"}');
  });
});

describe("TypesafeI18nLoader", () => {
  it("delegates load to the provided function", async () => {
    const load = vi.fn(async () => ({ greeting: "Ciao" }));
    const loader = new TypesafeI18nLoader(load);

    const result = await loader.load("it", ["common"]);

    expect(load).toHaveBeenCalledWith("it", ["common"]);
    expect(result).toEqual({ greeting: "Ciao" });
  });

  it("forwards namespaces only when provided", async () => {
    const load = vi.fn(async () => null);
    const loader = new TypesafeI18nLoader(load);

    await loader.load("it");

    expect(load).toHaveBeenCalledWith("it", undefined);
  });
});