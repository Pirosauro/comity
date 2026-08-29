import type { ModuleSetupContext } from "@comity/composition/setup";
import type { ProductRepository } from "@comity/catalog";
import type { TaxonomyRepository } from "@comity/taxonomy";
import type { PageRepository } from "@comity/content";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { isSuccess } from "@comity/primitives/result";
import {
  CATEGORY_PAGE_COMPOSER_TOKEN,
  CONTENT_PAGE_COMPOSER_TOKEN,
  PRODUCT_PAGE_COMPOSER_TOKEN,
  SEARCH_PAGE_COMPOSER_TOKEN,
} from "../constants.js";
import { module } from "../index.js";

describe("storefront module setup", () => {
  let define: ReturnType<typeof vi.fn>;
  let resolve: ReturnType<typeof vi.fn>;
  let ctx: ModuleSetupContext;

  beforeEach(() => {
    define = vi.fn();
    resolve = vi.fn();

    ctx = {
      services: { define, resolve },
      events: {},
      hooks: { define: vi.fn(), execute: vi.fn(), executeAll: vi.fn() },
    } as unknown as ModuleSetupContext;
  });

  function baseOptions() {
    return {
      productRepository: {} as unknown as ProductRepository,
      taxonomyRepository: {} as unknown as TaxonomyRepository,
      pageRepository: {} as unknown as PageRepository,
    };
  }

  function definedTokens(): unknown[] {
    return define.mock.calls.map((call) => call[0]);
  }

  it("should succeed and define composer services", async () => {
    const result = await module.setup(ctx, baseOptions());

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      const init = await result.value();

      expect(init.success).toBe(true);
      expect(define).toHaveBeenCalledWith(PRODUCT_PAGE_COMPOSER_TOKEN, expect.any(Function));
      expect(define).toHaveBeenCalledWith(CATEGORY_PAGE_COMPOSER_TOKEN, expect.any(Function));
      expect(define).toHaveBeenCalledWith(CONTENT_PAGE_COMPOSER_TOKEN, expect.any(Function));
      expect(define).toHaveBeenCalledWith(SEARCH_PAGE_COMPOSER_TOKEN, expect.any(Function));
    }
  });

  it("should register all four page composers when fully configured", async () => {
    const productRepository = { getById: vi.fn().mockResolvedValue({ success: true, value: null }), search: vi.fn().mockResolvedValue({ success: true, value: { items: [], total: 0 } }) };
    const taxonomyRepository = { getById: vi.fn().mockResolvedValue({ success: true, value: null }) };
    const pageRepository = { getById: vi.fn().mockResolvedValue({ success: true, value: null }) };

    const result = await module.setup(ctx, {
      productRepository: productRepository as unknown as ProductRepository,
      taxonomyRepository: taxonomyRepository as unknown as TaxonomyRepository,
      pageRepository: pageRepository as unknown as PageRepository,
    });

    expect(isSuccess(result)).toBe(true);
    if (!isSuccess(result)) return;
    const init = await result.value();
    expect(init.success).toBe(true);

    for (const token of [
      PRODUCT_PAGE_COMPOSER_TOKEN,
      CATEGORY_PAGE_COMPOSER_TOKEN,
      CONTENT_PAGE_COMPOSER_TOKEN,
      SEARCH_PAGE_COMPOSER_TOKEN,
    ]) {
      expect(define).toHaveBeenCalledWith(token, expect.any(Function));
    }

    // Composers resolve repositories lazily through their factories.
    // The factory is a function that creates a composer with the captured repositories.
    const productFactory = define.mock.calls.find(
      (call) => call[0] === PRODUCT_PAGE_COMPOSER_TOKEN
    )?.[1] as (() => unknown) | undefined;
    expect(productFactory).toBeDefined();
    expect(typeof productFactory).toBe("function");
  });

  it("should execute configuring hook to allow enricher customization", async () => {
    const result = await module.setup(ctx, baseOptions());

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      const init = await result.value();
      expect(init.success).toBe(true);
      expect(ctx.hooks.execute).toHaveBeenCalledWith("@comity/storefront:configuring", expect.any(Object));
    }
  });

  it("should execute initialized hook on teardown", async () => {
    const result = await module.setup(ctx, baseOptions());

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      await result.value();
      expect(ctx.hooks.execute).toHaveBeenCalledWith("@comity/storefront:initialized", undefined);
    }
  });
});