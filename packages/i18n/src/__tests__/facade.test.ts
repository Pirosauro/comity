import { describe, expect, it, vi } from "vitest";
import { DefaultI18n } from "../facade.js";

const makeTranslator = (locale: string) => ({
  locale,
  t: (key: string) => `${locale}:${key}`,
});

describe("DefaultI18n", () => {
  it("resolves the first non-null resolver result", async () => {
    const resolverA = vi.fn(async () => null);
    const resolverB = vi.fn(async () => ({ code: "it", direction: "ltr" as const }));
    const i18n = new DefaultI18n({
      loader: { load: vi.fn() },
      factory: vi.fn(),
      resolvers: [resolverA, resolverB],
    });

    const locale = await i18n.resolveLocale("it-IT");

    expect(locale).toEqual({ code: "it", direction: "ltr" });
    expect(resolverA).toHaveBeenCalledWith({ input: "it-IT" });
    expect(resolverB).toHaveBeenCalledWith({ input: "it-IT" });
  });

  it("falls back to the default locale when no resolver matches", async () => {
    const i18n = new DefaultI18n({
      loader: { load: vi.fn() },
      factory: vi.fn(),
      defaultLocale: { code: "en", direction: "ltr" },
      resolvers: [vi.fn(async () => null)],
    });

    await expect(i18n.resolveLocale("fr-FR")).resolves.toEqual({
      code: "en",
      direction: "ltr",
    });
  });

  it("uses the built-in default locale when none is provided", async () => {
    const i18n = new DefaultI18n({
      loader: { load: vi.fn() },
      factory: vi.fn(),
    });

    await expect(i18n.resolveLocale("unknown")).resolves.toEqual({
      code: "en",
      direction: "ltr",
    });
  });

  it("creates a translator with the requested locale and messages", async () => {
    const load = vi.fn(async () => ({ greeting: "Hello" }));
    const factory = vi.fn(makeTranslator);
    const i18n = new DefaultI18n({ loader: { load }, factory });

    const translator = await i18n.getTranslator("en", { namespaces: ["common"] });

    expect(load).toHaveBeenCalledWith("en", ["common"]);
    expect(factory).toHaveBeenCalledWith("en", { greeting: "Hello" });
    expect(translator.locale).toBe("en");
  });

  it("falls back to the default locale when loading fails", async () => {
    const load = vi.fn(async (locale: string) => {
      if (locale === "it") throw new Error("load failed");
      return { greeting: "Hello" };
    });
    const factory = vi.fn(makeTranslator);
    const i18n = new DefaultI18n({
      loader: { load },
      factory,
      defaultLocale: { code: "en", direction: "ltr" },
    });

    const translator = await i18n.getTranslator("it");

    expect(load).toHaveBeenNthCalledWith(1, "it", undefined);
    expect(load).toHaveBeenNthCalledWith(2, "en", undefined);
    expect(factory).toHaveBeenLastCalledWith("en", { greeting: "Hello" });
    expect(translator.locale).toBe("en");
  });

  it("falls back to the default locale when the factory throws", async () => {
    const load = vi.fn(async () => ({ greeting: "Hello" }));
    const factory = vi.fn((locale: string) => {
      if (locale === "it") throw new Error("factory failed");
      return makeTranslator(locale);
    });
    const i18n = new DefaultI18n({
      loader: { load },
      factory,
      defaultLocale: { code: "en", direction: "ltr" },
    });

    const translator = await i18n.getTranslator("it");

    expect(translator.locale).toBe("en");
  });
});