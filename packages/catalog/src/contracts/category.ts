import type { MediaModel } from "@comity/media";

/**
 * Category model.
 */
export interface CategoryModel {
  /** Unique identifier */
  readonly id: string;

  /** Absolute page URL */
  readonly url?: string;

  /** Display name */
  readonly name: string;

  /** Description */
  readonly description?: string;

  /** Featured image */
  readonly image?: MediaModel;
}

/**
 * Category tree node model, representing a category along with its children in a hierarchical structure.
 */
export interface CategoryTreeNodeModel {
  /** The category represented by this node. */
  readonly category: CategoryModel;

  /** Child nodes of this category. */
  readonly children?: readonly CategoryTreeNodeModel[];
}

/**
 * Category hierarchy model, representing the parent-child relationships between categories in a flat structure.
 */
export interface CategoryHierarchyModel {
  /** Unique identifier of the category. */
  readonly id: string;

  /** Identifier of the parent category, if any. */
  readonly parentId?: string;
}
