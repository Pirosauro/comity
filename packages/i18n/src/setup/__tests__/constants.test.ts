import { describe, expect, it } from "vitest";
import { I18N_TOKEN } from "../constants.js";

describe("i18n setup constants", () => {
  it("should expose the i18n token", () => {
    expect(I18N_TOKEN).toBe(Symbol.for("@comity/i18n"));
  });
});