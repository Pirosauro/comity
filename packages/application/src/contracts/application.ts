import type {
  HtmlAttributes,
  HtmlHeadLink,
  HtmlHeadMeta,
  HtmlHeadNoscript,
  HtmlHeadScript,
  HtmlHeadStyle,
} from "@comity/html";
import type { HttpStatus } from "@comity/http";

/**
 *
 */
export interface ApplicationContract<
  Data = unknown,
  Ctx extends Record<string, unknown> = Record<string, unknown>,
> {
  /** Data for the view */
  readonly data?: Data;

  /** HTTP info */
  readonly http?: {
    /** HTTP status code */
    readonly status?: HttpStatus;

    /** HTTP headers */
    readonly headers?: Record<string, string>;
  };

  /** View override (optional) */
  readonly view?: unknown;

  /** Head elements for the HTML document */
  readonly document?: Readonly<{
    /** Document title */
    title?: string;

    /** Meta tags */
    meta?: readonly HtmlHeadMeta[];

    /** Link tags */
    link?: readonly HtmlHeadLink[];

    /** Inline styles (critical CSS) */
    style?: readonly HtmlHeadStyle[];

    /** Scripts (head only, rare) */
    script?: readonly HtmlHeadScript[];

    /** Noscript fallback */
    noscript?: readonly HtmlHeadNoscript[];

    /** <html> attributes (lang, dir, etc.) */
    htmlAttrs?: HtmlAttributes;

    /** <body> attributes (class, data-*) */
    bodyAttrs?: HtmlAttributes;
  }>;

  /** Context data */
  readonly context?: Ctx;
}
