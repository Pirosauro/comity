export type { BrandProjection } from "./contracts/brand.js";
export type { BrandRepository } from "./contracts/brand-repository.js";
export type {
  ProductAttribute,
  ProductCreate,
  ProductOption,
  ProductOptionSelection,
  ProductProjection,
  ProductStatus,
  ProductType,
  ProductVariant,
} from "./contracts/product.js";
export type { ProductRepository } from "./contracts/product-repository.js";
export type { CatalogRepositoryContext } from "./contracts/repository-context.js";
export { createProduct } from "./domain/create-product.js";
export { transitionProductStatus } from "./domain/product-status.js";