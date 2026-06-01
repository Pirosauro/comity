import type { GraphqlFieldsSelector } from "@comity/graphql-builder";
import type { GraphqlClient } from "@comity/graphql-client";
import type { Result } from "@comity/primitives/result";
import type { Product, ProductsQuery } from "typed-magento-graphql";
import type { ProductsQueryInput } from "typed-magento-graphql/schemas";
import type {
  ProductListModel,
  ProductModel,
  ProductRepository,
  ProductRepositoryFilter,
  ProductRepositoryOptions,
} from "../../features/catalog/repositories/product.js";
import type { Image, Inventory, Price, Seo } from "../../features/catalog/repositories/types.js";

import { buildQuery, graphqlVar } from "@comity/graphql-builder";
import { GraphqlClientError } from "@comity/graphql-client/error";
import { failure, success } from "@comity/primitives/result";
import { ProductsQueryInputSchema } from "typed-magento-graphql/schemas";
import { FieldMapper, ValueMapper } from "../internal/mapper.js";
import { normalizeToFloat } from "../internal/normalize.js";

/**
 * The `GraphqlProductRepository` class is an implementation of the `ProductRepository` interface that uses a GraphQL client to fetch product data from a GraphQL API.
 */
type UrlRewrite = {
  /**  */
  url?: string;

  /**  */
  parameters?: {
    /**  */
    name?: string;

    /**  */
    value?: string;
  }[];
};

/**
 * Optional query options for fetching category data, allowing callers to specify additional parameters such as store view or fields selection when retrieving category information from the repository. These options can be used to customize the behavior of the repository methods and tailor the data retrieval to specific use cases or requirements.
 */
export interface GraphqlProductRepositoryOptions {
  /** Optional store ID to fetch category data for a specific store view. */
  store?: string;

  /** Optional user token for authentication or authorization purposes. */
  token?: string;

  /** Optional function to generate a URL for the product. */
  generateUrl?: (urlRewrites: UrlRewrite[]) => string | undefined;
}

/**
 * Generate URL
 *
 * @param urlRewrites - An array of URL rewrite objects that may contain a URL and associated parameters.
 *
 * @returns The URL of the first URL rewrite in the sorted list, or undefined if there are no URL rewrites or if none of them contain a URL.
 */
function defaultGenerateUrl(urlRewrites: UrlRewrite[]): string | undefined {
  // 1. sort url rewrites by level
  const sorted = urlRewrites.sort((a, b) => {
    const al = a.url?.split("/").length ?? 0;
    const bl = b.url?.split("/").length ?? 0;

    return al - bl;
  });

  // 2. return the first url
  return sorted[0]?.url;
}

/**
 * The `GraphqlProductRepository` class is an implementation of the `ProductRepository` interface that uses a GraphQL client to fetch product data from a GraphQL API. This repository provides methods to retrieve product information based on unique identifiers, allowing other parts of the application to access and manipulate product data as needed. The class encapsulates the logic for constructing and sending GraphQL queries, handling responses, and returning structured product data to the caller.
 */
export class GraphqlProductRepository implements ProductRepository {
  /** */
  #graphql: GraphqlClient;

  /** Optional repository options for customizing the behavior of the GraphqlProductRepository instance. */
  #options: GraphqlProductRepositoryOptions;

  /**
   * @param graphql - An instance of the `GraphqlClient` that will be used to execute GraphQL queries and mutations related to products. This client provides methods for sending requests to a GraphQL server and handling responses, allowing the repository to interact with the backend API to fetch and manipulate product data.
   * @param options - Optional parameters for configuring the behavior of the repository, such as store view and fields selection. These options allow the caller to customize the queries sent to the GraphQL API and specify which fields should be included in the response, as well as any additional headers that may be needed for the requests.
   */
  constructor(graphql: GraphqlClient, options?: GraphqlProductRepositoryOptions) {
    this.#graphql = graphql;
    this.#options = options ?? {};
  }

  /**
   * Gets the store ID from the repository options, which can be used to specify the store view for fetching product data.
   *
   * @returns The store ID from the repository options.
   */
  get store() {
    return this.#options.store;
  }

  /**
   * @inheritdoc
   */
  async getList(
    input: ProductRepositoryFilter,
    options: ProductRepositoryOptions
  ): Promise<Result<ProductListModel, GraphqlClientError>> {
    try {
      const filters = input.id
        ? { sku: Array.isArray(input.id) ? { in: input.id } : { eq: input.id } }
        : input.categoryId
          ? {
              category_uid: Array.isArray(input.categoryId)
                ? { in: input.categoryId }
                : { eq: input.categoryId },
            }
          : input.slug
            ? { url_key: Array.isArray(input.slug) ? { in: input.slug } : { eq: input.slug } }
            : input.price
              ? {
                  price: {
                    ...(input.price.from ? { from: input.price.from.toString() } : {}),
                    ...(input.price.to ? { to: input.price.to.toString() } : {}),
                  },
                }
              : undefined;
      const result = await this.#query(
        "ListProducts",
        {
          filter: filters,
          currentPage: input.currentPage ?? 1,
          pageSize: input.pageSize ?? 20,
        },
        options
      );

      return success({
        items: result.data?.products?.items?.map(this.#toModel) ?? [],
        total: result.data?.products?.total_count ?? 0,
        currentPage: result.data?.products?.page_info?.current_page ?? 1,
        pageSize: result.data?.products?.page_info?.page_size ?? 20,
      });
    } catch (cause) {
      if (cause instanceof GraphqlClientError) {
        return failure(cause);
      }

      return failure(
        new GraphqlClientError("protocol_error", {
          details: {
            operationName: "ListProducts",
          },
          cause,
          context: {
            input,
          },
        })
      );
    }
  }

  /**
   * @inheritdoc
   */
  async getById(
    id: string,
    options: ProductRepositoryOptions
  ): Promise<Result<ProductModel | null, GraphqlClientError>> {
    try {
      const input: ProductsQueryInput = {
        filter: {
          sku: {
            eq: id,
          },
        },
        pageSize: 1,
        currentPage: 1,
      };

      const result = await this.#query("GetProductById", input, options);
      const node = result.data?.products?.items?.[0];

      if (!node) {
        return success(null);
      }

      return success(this.#toModel(node));
    } catch (cause) {
      if (cause instanceof GraphqlClientError) {
        return failure(cause);
      }

      return failure(
        new GraphqlClientError("protocol_error", {
          details: {
            operationName: "GetProductById",
          },
          cause,
          context: {
            id,
          },
        })
      );
    }
  }

  /**
   * @inheritdoc
   */
  async getBySlug(
    slug: string,
    options: ProductRepositoryOptions
  ): Promise<Result<ProductModel | null, GraphqlClientError>> {
    try {
      const input: ProductsQueryInput = {
        filter: {
          url_key: {
            eq: slug,
          },
        },
        pageSize: 1,
        currentPage: 1,
      };

      const result = await this.#query("GetProductBySlug", input, options);
      const node = result.data?.products?.items?.[0];

      if (!node) {
        return success(null);
      }

      return success(this.#toModel(node));
    } catch (cause) {
      if (cause instanceof GraphqlClientError) {
        return failure(cause);
      }

      return failure(
        new GraphqlClientError("protocol_error", {
          details: {
            operationName: "GetProductBySlug",
          },
          cause,
          context: {
            slug,
          },
        })
      );
    }
  }

  /**
   * Fetches a category tree by its unique identifier (ID). This method sends a GraphQL query to the server, requesting the category tree data associated with the provided ID. The response is expected to include details about the category, such as its name, description, URL, and any child categories it may have. The method returns the category tree data in a structured format that can be used by other parts of the application to display or manipulate the category information.
   *
   * @param name - The name of the GraphQL query operation to be executed. This name is used for logging, debugging, and error handling purposes, allowing developers to identify which specific query is being executed when analyzing logs or handling errors.
   * @param input - The input parameters for fetching the category tree, including filters and pagination options. This input is validated against the `CategoriesQueryInputSchema` to ensure that it meets the expected structure and constraints before being used in the GraphQL query.
   * @param options - Optional query options such as store view or fields selection, allowing callers to customize the behavior of the query and specify which fields should be included in the response. These options can be used to optimize the query for specific use cases or to retrieve additional data as needed.
   *
   * @returns A promise that resolves to the category tree data associated with the provided ID. The data includes various properties of the category, such as its name, description, URL, and relationships to other categories. If the category tree is not found or if there is an error during the fetch operation, the promise may reject with an appropriate error message.
   */
  async #query(name: string, input: ProductsQueryInput, options: ProductRepositoryOptions) {
    const store = this.#options.store;
    const validated = ProductsQueryInputSchema.parse(input);
    const fields = this.#toProduct(options.fields ?? {});
    const query = buildQuery<ProductsQuery>(
      {
        $type: "query",
        $name: name,
        $vars: {
          $filter: "ProductAttributeFilterInput",
          $currentPage: "Int",
          $pageSize: "Int",
        },
        products: {
          $args: {
            filter: graphqlVar("filter"),
            currentPage: graphqlVar("currentPage"),
            pageSize: graphqlVar("pageSize"),
          },
          items: {
            ...(fields ?? {}),
            uid: true,
            name: true,
          },
          page_info: {
            current_page: true,
            page_size: true,
            total_pages: true,
          },
          total_count: true,
        },
      },
      { indent: false }
    );

    // Execute the GraphQL query using the client and handle the response, including error handling and data transformation to fit the `ProductModel` structure expected by the application.
    const result = await this.#graphql.query<ProductsQuery>({
      query,
      variables: validated as Record<string, unknown>,
      operationName: name,
      headers: store ? { store } : {},
    });

    if (result.errors?.length) {
      throw new GraphqlClientError("protocol_error", {
        details: {
          operationName: name,
          errors: result.errors,
        },
        context: {
          input,
        },
      });
    }

    return result;
  }

  /**
   * Converts the raw category tree data retrieved from the GraphQL API into a common `CategoryViewModel` format that can be used by other parts of the application. This method takes the `Product` as input and maps its properties to the corresponding fields in the `CategoryViewModel`, ensuring that the data is structured in a way that is consistent with the application's view layer. The method handles any necessary transformations, such as normalizing numeric values or constructing URLs, to ensure that the resulting `CategoryViewModel` is ready for use in the presentation layer.
   *
   * @param data - The raw category tree data retrieved from the GraphQL API, represented as a `Product` object. This data includes various properties of the category, such as its name, description, URL components, and counts of products and child categories.
   *
   * @returns A `CategoryModel` object that contains the mapped and normalized category data, ready for use in the presentation layer of the application. The view model includes properties such as `name`, `description`, `image`, `url`, `slug`, `productCount`, and `childrenCount`, which are derived from the corresponding fields in the input data.
   */
  #toModel(data: Product): ProductModel {
    const generateUrl = defaultGenerateUrl; // this.#options.generateUrl ?? defaultGenerateUrl;

    return (
      new ValueMapper<Product, ProductModel>()
        .copy("uid", "id")
        .copy("sku", "sku")
        .copy("name", "name")
        .copy("url_key", "slug")
        .transform("description", "description", (desc) => desc?.html)

        // Media gallery
        .transform("media_gallery", "images", (gallery) =>
          gallery
            ?.filter((img) => img.url)
            .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
            .map((img) => ({
              url: img.url!,
              ...(img.label ? { alt: img.label } : {}),
            }))
        )

        // Inventory
        .combine(
          "inventory",
          (data) =>
            data.stock_status
              ? { status: data.stock_status === "IN_STOCK" ? "in_stock" : "out_of_stock" }
              : {},
          (data) => (data.quantity ? { quantity: normalizeToFloat(data.quantity) } : {}),
          (data) =>
            data.only_x_left_in_stock
              ? { low_stock_threshold: normalizeToFloat(data.only_x_left_in_stock) }
              : {}
        )

        // Price
        .add("price", (data) => {
          const minPrice = data.price_range?.minimum_price;
          const maxPrice = data.price_range?.maximum_price;
          const currency =
            minPrice?.regular_price?.currency ??
            minPrice?.final_price?.currency ??
            maxPrice?.regular_price?.currency ??
            maxPrice?.final_price?.currency;

          return {
            ...(minPrice && {
              minimum: {
                ...(minPrice.regular_price?.value && { regular: minPrice.regular_price.value }),
                ...(minPrice.final_price?.value && { final: minPrice.final_price.value }),
                ...(minPrice.discount?.percent_off && { discount: minPrice.discount.percent_off }),
              },
            }),
            ...(maxPrice && {
              maximum: {
                ...(maxPrice.regular_price?.value && { regular: maxPrice.regular_price.value }),
                ...(maxPrice.final_price?.value && { final: maxPrice.final_price.value }),
                ...(maxPrice.discount?.percent_off && { discount: maxPrice.discount.percent_off }),
              },
            }),
            ...(currency && { currency }),
          };
        })

        // SEO
        .add("seo", (data) => ({
          title: data.meta_title ?? data.name!,
          ...(data.meta_description && { description: data.meta_description }),
          ...(data.meta_keyword && { keywords: data.meta_keyword }),
          ...(data.canonical_url && { canonical: data.canonical_url }),
        }))

        .add("url", (data) => {
          return generateUrl(data.url_rewrites ?? []);
        })

        .map(data)
    );
  }

  /**
   * Converts the current `CategoryModel` instance into a `CategoryTree` object, optionally selecting specific fields to include in the output. This method is useful for transforming the view model into a format that can be used by other parts of the application or sent to external systems.
   *
   * @param fields - Optional fields selector that specifies which fields should be included in the resulting `ProductModel` object. This allows for selective inclusion of properties, optimizing data transfer and processing by including only the necessary fields.
   *
   * @returns A `ProductModel` object that represents the product data in a structured format, with properties corresponding to the fields defined in the `ProductModel`. The output is tailored based on the provided fields selector, ensuring that only the specified fields are included in the resulting object.
   */
  #toProduct(fields: GraphqlFieldsSelector<ProductModel>): GraphqlFieldsSelector<Product> {
    /**
     * Maps a price point (either minimum or maximum) to the corresponding GraphQL fields based on the provided `Price` object. This function checks which properties of the `Price` object are set to true and constructs a corresponding GraphQL fields selector that includes the appropriate fields for regular price, final price, and discount.
     *
     * @param point - A boolean or `Price` object that indicates which price fields should be included in the GraphQL query. If the input is true, all price fields are included; if it's an object, only the fields that are set to true in the object are included; if it's false or undefined, no price fields are included.
     *
     * @returns An object representing the GraphQL fields selector for the price point, including fields for regular price, final price, and discount based on the properties of the input `Price` object. If the input is true, all fields are included; if it's an object, only the specified fields are included; if it's false or undefined, no fields are included.
     */
    const mapPricePoint = (
      point:
        | boolean
        | GraphqlFieldsSelector<Price>["maximum"]
        | GraphqlFieldsSelector<Price>["minimum"]
    ) => {
      if (point === true) {
        return {
          regular_price: { value: true, currency: true },
          final_price: { value: true, currency: true },
          discount: { percent_off: true },
        };
      }

      if (point && typeof point === "object") {
        return {
          regular_price: point.regular ? { value: true, currency: true } : false,
          final_price: point.final ? { value: true, currency: true } : false,
          discount: point.discount ? { percent_off: true } : false,
        };
      }

      return false;
    };

    return (
      new FieldMapper<GraphqlFieldsSelector<ProductModel>, GraphqlFieldsSelector<Product>>()
        .copy("id", "uid")
        .same("name")
        .same("description")
        .copy("slug", "url_key")

        // URL rewrites
        .add("url_rewrites", (f) => (f.url === true ? { url: true } : false))

        // SEO mapping
        .sub("seo", "meta_title", (seo) => (seo as GraphqlFieldsSelector<Seo>).title === true)
        .sub(
          "seo",
          "meta_description",
          (seo) => (seo as GraphqlFieldsSelector<Seo>).description === true
        )
        .sub("seo", "meta_keyword", (seo) => (seo as GraphqlFieldsSelector<Seo>).keywords === true)
        .sub(
          "seo",
          "canonical_url",
          (seo) => (seo as GraphqlFieldsSelector<Seo>).canonical === true
        )

        // Inventory mapping
        .sub(
          "inventory",
          "stock_status",
          (inv) => (inv as GraphqlFieldsSelector<Inventory>).status === true
        )
        .sub(
          "inventory",
          "quantity",
          (inv) => (inv as GraphqlFieldsSelector<Inventory>).quantity === true
        )
        .sub(
          "inventory",
          "only_x_left_in_stock",
          (inv) => (inv as GraphqlFieldsSelector<Inventory>).low_stock_threshold === true
        )

        // Media gallery
        .sub("images", "media_gallery", (img) => ({
          url: (img as GraphqlFieldsSelector<Image>).url === true,
          label: (img as GraphqlFieldsSelector<Image>).alt === true,
          position: true,
        }))

        // Price mapping + transform
        .transform(
          "price",
          "price_range",
          () => ({
            minimum_price: mapPricePoint(true),
            maximum_price: mapPricePoint(true),
          }),
          (price) => ({
            minimum_price: mapPricePoint((price as GraphqlFieldsSelector<Price>).minimum),
            maximum_price: mapPricePoint((price as GraphqlFieldsSelector<Price>).maximum),
          })
        )

        .map(fields) as GraphqlFieldsSelector<Product>
    );
  }
}
