import type { MediaModel } from "@comity/media";
import type { MagentoProduct } from "../graphql/product.js";

/**
 * Maps Magento media gallery to canonical media models.
 *
 * @param data - Magento product node.
 *
 * @returns Canonical media list when present.
 */
export function toMedia(data: MagentoProduct): ReadonlyArray<MediaModel> | undefined {
  const images = data.media_gallery
    ?.filter((img) => !!img.url)
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((img, index) => ({
      id: `${data.uid ?? data.sku ?? "product"}:${index}`,
      url: img.url!,
      ...(img.label ? { alt: img.label } : {}),
    }));

  if (!images || images.length === 0) {
    return undefined;
  }

  return images;
}
