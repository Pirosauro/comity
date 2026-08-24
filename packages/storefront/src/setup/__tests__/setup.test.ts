import type { ModuleSetupContext } from "@comity/composition/setup";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { PRODUCT_REPOSITORY_TOKEN } from "@comity/catalog/setup";
import { TAXONOMY_REPOSITORY_TOKEN } from "@comity/taxonomy/setup";
import { DefaultHookBus } from "@comity/primitives/lifecycle";
import { isSuccess } from "@comity/primitives/result";
import { CATEGORY_PAGE_COMPOSER_TOKEN, PRODUCT_PAGE_COMPOSER_TOKEN } from "../constants.js";
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
      hooks: new DefaultHookBus<any>(),
    } as unknown as ModuleSetupContext;
  });

  it("should succeed and define composer services", async () => {
    const result = await module.setup(ctx, undefined);

    expect(result.success).toBe(true);
    if (isSuccess(result)) {
      const init = await result.value();

      expect(init.success).toBe(true);
      expect(define).toHaveBeenCalledWith(PRODUCT_PAGE_COMPOSER_TOKEN, expect.any(Function));
      expect(define).toHaveBeenCalledWith(CATEGORY_PAGE_COMPOSER_TOKEN, expect.any(Function));
    }
  });

  it("should resolve repository tokens when building composers", async () => {
    const result = await module.setup(ctx, undefined);

    if (isSuccess(result)) {
      await result.value();

      const productFactory = define.mock.calls.find(
        (c) => c[0] === PRODUCT_PAGE_COMPOSER_TOKEN
      )?.[1];
      const categoryFactory = define.mock.calls.find(
        (c) => c[0] === CATEGORY_PAGE_COMPOSER_TOKEN
      )?.[1];

      productFactory?.();
      categoryFactory?.();

      expect(resolve).toHaveBeenCalledWith(PRODUCT_REPOSITORY_TOKEN);
      expect(resolve).toHaveBeenCalledWith(TAXONOMY_REPOSITORY_TOKEN);
    }
  });

  it("should build composers with the configured enrichers", async () => {
    const productEnricher = { enrich: vi.fn() };
    const categoryEnricher = { enrich: vi.fn() };
    const hooks = new DefaultHookBus<any>();

    hooks.define("@comity/storefront:configuring", (cfg) => ({
      ...cfg,
      product: [productEnricher],
      category: [categoryEnricher],
    }));

    const configuredCtx = {
      services: { define, resolve },
      events: {},
      hooks,
    } as unknown as ModuleSetupContext;

    const result = await module.setup(configuredCtx, undefined);

    if (isSuccess(result)) {
      await result.value();

      expect(define).toHaveBeenCalledWith(PRODUCT_PAGE_COMPOSER_TOKEN, expect.any(Function));
      expect(define).toHaveBeenCalledWith(CATEGORY_PAGE_COMPOSER_TOKEN, expect.any(Function));
    }
  });
});