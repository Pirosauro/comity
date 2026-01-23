import { beforeEach, describe, expect, it, vi } from "vitest";
import { ReactStaticHtmlRenderer } from "../static.js";

describe("ReactStaticHtmlRenderer", () => {
  const mockTemplates = {
    default: vi.fn((data) => `<div>${data.message}</div>`),
    error: vi.fn((data) => `<div>Error: ${data.error}</div>`),
  };

  const options: any = {
    templates: mockTemplates,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render successful contract with default template", async () => {
    const renderer = new ReactStaticHtmlRenderer(options);
    const contract = {
      success: true,
      data: { message: "Hello World" },
      locale: { locale: "en", direction: "ltr" as const },
      http: { status: 200, headers: { "custom-header": "value" } },
    };

    const result = await renderer.render(contract);

    expect(result).toEqual({
      intent: "html",
      status: 200,
      body: "<!DOCTYPE html>&lt;div&gt;Hello World&lt;/div&gt;",
      headers: { "custom-header": "value" },
    });
    expect(mockTemplates.default).toHaveBeenCalledWith({
      message: "Hello World",
    });
    expect(mockTemplates.error).not.toHaveBeenCalled();
  });

  it("should render failed contract with error template", async () => {
    const renderer = new ReactStaticHtmlRenderer(options);
    const contract = {
      success: false,
      data: { error: "Something went wrong" },
      locale: { locale: "en", direction: "ltr" as const },
      http: { status: 500 },
    };

    const result = await renderer.render(contract);

    expect(result).toEqual({
      intent: "html",
      status: 500,
      body: "<!DOCTYPE html>&lt;div&gt;Error: Something went wrong&lt;/div&gt;",
    });
    expect(mockTemplates.error).toHaveBeenCalledWith({
      error: "Something went wrong",
    });
    expect(mockTemplates.default).not.toHaveBeenCalled();
  });

  it("should use default status 200 for successful contract", async () => {
    const renderer = new ReactStaticHtmlRenderer(options);
    const contract = {
      success: true,
      data: { message: "test" },
      locale: { locale: "en", direction: "ltr" as const },
    };

    const result = await renderer.render(contract);

    expect(result.status).toBe(200);
  });

  it("should use default status 500 for failed contract", async () => {
    const renderer = new ReactStaticHtmlRenderer(options);
    const contract = {
      success: false,
      data: { error: "test" },
      locale: { locale: "en", direction: "ltr" as const },
    };

    const result = await renderer.render(contract);

    expect(result.status).toBe(500);
  });

  it("should include contract headers", async () => {
    const renderer = new ReactStaticHtmlRenderer(options);
    const contract = {
      success: true,
      data: { message: "test" },
      locale: { locale: "en", direction: "ltr" as const },
      http: { headers: { "x-custom": "header" } },
    };

    const result: any = await renderer.render(contract);

    expect(result.headers).toEqual({ "x-custom": "header" });
  });

  it("should handle template throwing error", async () => {
    const errorTemplates = {
      default: vi.fn(() => {
        throw new Error("Template error");
      }),
      error: vi.fn(),
    };

    const renderer = new ReactStaticHtmlRenderer({
      templates: errorTemplates,
    });
    const contract = {
      success: true,
      data: { message: "test" },
      locale: { locale: "en", direction: "ltr" as const },
    };

    await expect(renderer.render(contract)).rejects.toThrow("Template error");
  });
});
