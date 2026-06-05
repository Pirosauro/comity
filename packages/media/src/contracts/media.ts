/**
 * Lightweight media metadata (image, video, document reference).
 */
export interface MediaModel {
  /** Unique media identifier. */
  readonly id: string;

  /** Absolute or relative URL to media resource. */
  readonly url: string;

  /** Alt text for accessibility. */
  readonly alt?: string;

  /** Display title or caption. */
  readonly title?: string;

  /** Media width in pixels. */
  readonly width?: number;

  /** Media height in pixels. */
  readonly height?: number;

  /** Media MIME type. */
  readonly mimeType?: string;

  /** File size in bytes. */
  readonly size?: number;
}
