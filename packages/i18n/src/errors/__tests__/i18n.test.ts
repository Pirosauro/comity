import { describe, expect, it } from "vitest";
import { I18nError } from "../index.js";

describe("I18nError", () => {
  it("exposes reason, message and code for each reason", () => {
    const cases: Array<[Parameters<typeof I18nError>[0], string, string]> = [
      ["missing_loader", "missing_loader", "I18n loader not configured"],
      ["missing_translator_factory", "missing_translator_factory", "I18n translator factory not configured"],
      ["locale_resolution_failed", "locale_resolution_failed", "Failed to resolve locale"],
      ["locale_not_supported", "locale_not_supported", "Locale not supported"],
    ];

    for (const [reason, codeSuffix, message] of cases) {
      const error = new I18nError(reason);

      expect(error.code).toBe(`i18n:${codeSuffix}`);
      expect(error.message).toBe(message);
      expect(error.meta).toMatchObject({ reason });
    }
  });

  it("merges details into the error meta", () => {
    const error = new I18nError("locale_not_supported", {
      details: { locale: "xx", adapter: "test", violation: "missing" },
    });

    expect(error.meta).toMatchObject({
      reason: "locale_not_supported",
      details: { locale: "xx", adapter: "test", violation: "missing" },
    });
  });
});