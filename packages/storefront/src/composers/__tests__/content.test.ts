import type { PageModel } from "@comity/content";
import type { ContentPageEnricher } from "../contracts/content-page.js";

import { describe, expect, it, vi } from "vitest";
import { success } from "@comity/primitives/result";
import { DefaultContentPageComposer } from "../content.js";

const ctx = { locale: "en-US" };

const page: PageModel = {
  id: "page-1",
  url: "/about",
  title: "About us",
};

describe("DefaultContentPageComposer", () => {
  it("should compose a content page from the repository result", async () => {
    const repository = { getById: vi.fn().mockResolvedValue(success(page)) };
    const composer = new DefaultContentPageComposer(repository as any);

    const result = await composer.compose("page-1", ctx);

    expect(repository.getById).toHaveBeenCalledWith("page-1", ctx);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toMatchObject({
        type: "content",
        id: "page-1",
        url: "/about",
        title: "About us",
      });
    }
  });

  it("should propagate a repository failure", async () => {
    const error = new Error("repo error");
    const repository = { getById: vi.fn().mockResolvedValue({ success: false, error }) };
    const composer = new DefaultContentPageComposer(repository as any);

    const result = await composer.compose("page-1", ctx);

    expect(result.success).toBe(false);
    expect(result.error).toBe(error);
  });

  it("should use fallbacks when the page has no id, url or title", async () => {
    const repository = {
      getById: vi
        .fn()
        .mockResolvedValue(success({ ...page, id: undefined, url: undefined, title: undefined })),
    };
    const composer = new DefaultContentPageComposer(repository as any);

    const result = await composer.compose("page-1", ctx);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toMatchObject({ id: "", url: "", title: "" });
    }
  });

  it("should apply enrichers and keep their result", async () => {
    const repository = { getById: vi.fn().mockResolvedValue(success(page)) };
    const enrichers: ContentPageEnricher[] = [
      {
        enrich: vi.fn().mockImplementation(async (composed) =>
          success({ ...composed, breadcrumbs: [{ label: "Home", url: "/" }] })
        ),
      },
    ];
    const composer = new DefaultContentPageComposer(repository as any, enrichers);

    const result = await composer.compose("page-1", ctx);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value.breadcrumbs).toEqual([{ label: "Home", url: "/" }]);
    }
  });

  it("should ignore enrichers that return a failure", async () => {
    const repository = { getById: vi.fn().mockResolvedValue(success(page)) };
    const failingEnricher: ContentPageEnricher = {
      enrich: vi.fn().mockResolvedValue({ success: false, error: new Error("enrich") }),
    };
    const composer = new DefaultContentPageComposer(repository as any, [failingEnricher]);

    const result = await composer.compose("page-1", ctx);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.value).toMatchObject({ id: "page-1", title: "About us" });
    }
  });
});