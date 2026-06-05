import type { BlockModel } from "./block.js";

/**
 * Menu item in a hierarchical navigation menu.
 */
export interface NavigationItemModel {
  /** Item display label. */
  readonly label: string;

  /** URL or path. */
  readonly url: string;

  /** Child menu items. */
  readonly children?: NavigationItemModel[];

  /** Item is active in current context. */
  readonly active?: boolean;
}

/**
 * Navigation model.
 */
export interface NavigationModel extends BlockModel {
  /** Top-level menu items. */
  readonly items: NavigationItemModel[];
}
