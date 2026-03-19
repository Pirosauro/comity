import type { HttpStatus } from "@comity/http";

/**
 * HTML metadata type, representing the structure of metadata information for an HTML page.
 */
export interface HtmlMeta extends Record<string, unknown> {
  /** Page title */
  readonly title: string;

  /** Page description */
  readonly description?: string;

  /** Page keywords */
  readonly keywords?: readonly string[];
}

/**
 * HTML contract type, representing the structure of data returned by presenters to be rendered as HTML.
 */
export interface HtmlContract<T extends {}, Meta extends HtmlMeta = HtmlMeta> {
  /** Page data */
  readonly data: T;

  /** Page metadata */
  readonly meta?: Meta;

  /** HTTP information */
  readonly http: Readonly<{
    /** HTTP status code */
    status: HttpStatus;
  }>;

  /** Locale information */
  readonly locale: Readonly<{
    /** Locale identifier */
    locale: string;

    /** Text direction, either left-to-right (ltr) or right-to-left (rtl) */
    direction: "ltr" | "rtl";
  }>;
}
