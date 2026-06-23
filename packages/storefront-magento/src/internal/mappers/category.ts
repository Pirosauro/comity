import type { CategoryModel } from "@comity/catalog";
import type { GraphqlFieldsSelector } from "@comity/graphql-builder";
import type { MediaModel } from "@comity/media";
import type { SeoModel } from "@comity/seo";
import type { MagentoCategory } from "../graphql/category.js";

import { FieldMapper, ValueMapper } from "../mapper.js";

/**
 * Extended category model that includes SEO metadata, used for mapping Magento category data to a format suitable for the storefront presentation layer. This model extends the base `CategoryModel` by adding an optional `seo` property, which contains SEO-related information such as title, description, keywords, canonical URL, and robots directives. The `MagentoCategoryModel` is designed to encapsulate all relevant data for a category, including both its core attributes and its SEO metadata, providing a comprehensive representation of a category for use in the storefront context.
 */
export interface MagentoCategoryModel extends CategoryModel {
  /** SEO metadata for the category. */
  seo?: SeoModel;
}

/**
 * Converts the raw category tree data retrieved from the GraphQL API into a common `CategoryViewModel` format that can be used by other parts of the application. This method takes the `CategoryTree` as input and maps its properties to the corresponding fields in the `CategoryViewModel`, ensuring that the data is structured in a way that is consistent with the application's view layer. The method handles any necessary transformations, such as normalizing numeric values or constructing URLs, to ensure that the resulting `CategoryViewModel` is ready for use in the presentation layer.
 *
 * @param data - The raw category tree data retrieved from the GraphQL API, represented as a `MagentoCategory` object. This data includes various properties of the category, such as its name, description, URL components, and counts of products and child categories.
 *
 * @returns A `MagentoCategoryModel` object that contains the mapped and normalized category data, ready for use in the presentation layer of the application. The view model includes properties such as `name`, `description`, `Modelrl`, `slug`, `productCount`, and `childrenCount`, which are derived from the corresponding fields in the input data.
 */
export function toCategoryModel(data: MagentoCategory): MagentoCategoryModel {
  return (
    new ValueMapper<MagentoCategory, MagentoCategoryModel>()
      .copy("uid", "id")
      .copy("name", "name")
      .copy("description", "description")

      // URL: combine url_path + url_suffix
      .add("url", (data) => {
        if (!data.url_path) return undefined;

        return `${data.url_path}${data.url_suffix ?? ""}`;
      })

      // Image
      .copy("image", "image")

      // SEO con merge
      .add("seo", (data) => ({
        title: data.meta_title ?? data.name!,
        ...(data.meta_description && { description: data.meta_description }),
        ...(data.meta_keywords && { keywords: data.meta_keywords }),
        ...(data.canonical_url && { canonical: data.canonical_url }),
        ...{
          robots: [
            ...(data.no_index ? ["noindex"] : ["index"]),
            ...(data.no_follow ? ["nofollow"] : ["follow"]),
          ].join(","),
        },
      }))

      .map(data)
  );
}

/**
 * Converts the current `CategoryModel` instance into a `MagentoCategory` object, optionally selecting specific fields to include in the output. This method is useful for transforming the view model into a format that can be used by other parts of the application or sent to external systems.
 *
 * @param fields - Optional fields selector that specifies which fields should be included in the resulting `MagentoCategory` object. This allows for selective inclusion of properties, optimizing data transfer and processing by including only the necessary fields.
 *
 * @returns A `MagentoCategory` object that represents the category data in a structured format, with properties corresponding to the fields defined in the `MagentoCategoryModel`. The output is tailored based on the provided fields selector, ensuring that only the specified fields are included in the resulting object.
 */
export function toCategoryTree(
  fields: GraphqlFieldsSelector<MagentoCategoryModel>
): GraphqlFieldsSelector<MagentoCategory> {
  return (
    new FieldMapper<
      GraphqlFieldsSelector<MagentoCategoryModel>,
      GraphqlFieldsSelector<MagentoCategory>
    >()
      .copy("id", "uid")
      .same("name")
      .same("description")
      .add("url_path", (f) => f.url === true)
      .add("url_suffix", (f) => f.url === true)

      // Image
      .sub("image", "image", (img) => (img as GraphqlFieldsSelector<MediaModel>).url === true)

      // SEO mapping
      .sub("seo", "meta_title", (seo) => (seo as GraphqlFieldsSelector<SeoModel>).title === true)
      .sub(
        "seo",
        "meta_description",
        (seo) => (seo as GraphqlFieldsSelector<SeoModel>).description === true
      )
      .sub(
        "seo",
        "meta_keywords",
        (seo) => (seo as GraphqlFieldsSelector<SeoModel>).keywords === true
      )
      .sub(
        "seo",
        "canonical_url",
        (seo) => (seo as GraphqlFieldsSelector<SeoModel>).canonical === true
      )
      .map(fields)
  );
}
