import type { CategoryViewModel } from "./category.js";

/**
 *
 */
export interface CategoryListViewModel {
  /**  */
  items: CategoryViewModel[];

  /**  */
  totalCount: number;

  /**  */
  pageInfo: {
    /**  */
    currentPage: number;

    /**  */
    pageSize: number;

    /**  */
    totalPages: number;
  };
}
