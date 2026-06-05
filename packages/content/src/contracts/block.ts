import type { MediaModel } from "@comity/media";

/**
 * Content block model.
 */
export interface BlockModel {
  /** Unique block identifier. */
  readonly id: string;

  /** Block type. */
  readonly type: string;
}

/**
 * Rich text content block model.
 */
export interface RichTextBlockModel extends BlockModel {
  /** HTML or markdown content. */
  readonly content: string;

  /** Content format. */
  readonly format: "html" | "markdown";
}

/**
 * Banner content block model.
 */
export interface BannerBlockModel extends BlockModel {
  /** Banner image. */
  readonly image: MediaModel;

  /** Optional URL for banner link. */
  readonly url?: string;
}
