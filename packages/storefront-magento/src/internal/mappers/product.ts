import type { ProductModel } from "@comity/catalog";
import type { MagentoProduct } from "../graphql/product.js";

import { toMedia } from "./media.js";

/**
 * Magento URL rewrite entry.
 */
export type UrlRewrite = {
  /** Resolved relative URL. */
  url?: string;
};

/**
 * Price range data structure for Magento products, representing the minimum price information for a product, including both regular and final prices along with their respective currencies. This structure is used to capture the pricing details of a product, allowing for accurate representation of the product's price range in the storefront presentation layer.
 */
export interface MagentoProductModel extends ProductModel {}

/**
 * Selects the shortest URL rewrite as canonical URL.
 *
 * @param urlRewrites - Magento URL rewrite list.
 *
 * @returns Canonical relative URL when available.
 */
export function defaultGenerateUrl(urlRewrites: UrlRewrite[]): string | undefined {
  const sorted = urlRewrites.sort((a, b) => {
    const al = a.url?.split("/").length ?? 0;
    const bl = b.url?.split("/").length ?? 0;

    return al - bl;
  });

  return sorted[0]?.url;
}

/**
 * Maps Magento product node to canonical product model.
 *
 * @param data - Magento product node.
 * @param generateUrl - Optional strategy for selecting canonical product URL.
 *
 * @returns Canonical product model.
 */
export function toProductModel(
  data: MagentoProduct,
  generateUrl?: (urlRewrites: UrlRewrite[]) => string | undefined
): MagentoProductModel {
  const variant = toVariant(data);
  const url = (generateUrl ?? defaultGenerateUrl)([...(data.url_rewrites ?? [])]);
  const description = data.description?.html ?? undefined;
  const images = toMedia(data);
  const seo = {
    title: data.meta_title ?? data.name ?? "",
    ...(data.meta_description ? { description: data.meta_description } : {}),
    ...(data.meta_keyword ? { keywords: data.meta_keyword } : {}),
    ...(data.canonical_url ? { canonical: data.canonical_url } : {}),
  };

  return {
    id: data.uid!,
    ...(data.sku ? { sku: data.sku } : {}),
    ...(url ? { url } : {}),
    name: data.name!,
    ...(description ? { description } : {}),
    ...(images ? { images } : {}),
    variants: [variant],
    ...(seo.title ? { seo } : {}),
  };
}

/**
 * Maps Magento product node to default canonical variant.
 *
 * @param data - Magento product node.
 *
 * @returns Canonical product variant.
 */
export function toVariant(data: MagentoProduct): ProductModel["variants"][number] {
  const minimum = data.price_range?.minimum_price;
  const regular = minimum?.regular_price?.value;
  const final = minimum?.final_price?.value;
  const currency = minimum?.regular_price?.currency ?? minimum?.final_price?.currency;
  const images = toMedia(data);

  return {
    id: data.uid!,
    ...(data.sku ? { sku: data.sku } : {}),
    options: [],
    ...(regular !== undefined && final !== undefined && currency
      ? {
          price: {
            currency,
            subtotal: regular,
            total: final,
          },
        }
      : {}),
    ...(data.stock_status
      ? {
          inventory: {
            status: data.stock_status === "IN_STOCK" ? "in_stock" : "out_of_stock",
            ...(data.quantity !== undefined ? { quantity: Number(data.quantity) } : {}),
            ...(data.only_x_left_in_stock !== undefined
              ? { lowStockThreshold: Number(data.only_x_left_in_stock) }
              : {}),
          },
        }
      : {}),
    ...(images ? { images } : {}),
  };
}
