import type { HtmlAttributes } from "./attribute.js";

/**
 * Represents metadata for the HTML head element, including attributes and specific properties for SEO.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta
 */
export interface HtmlHeadMeta extends HtmlAttributes {
  /** The name attribute for the meta tag */
  name?: string;

  /** The property attribute for the meta tag (e.g., for Open Graph or Twitter Card metadata) */
  property?: string;

  /** The content attribute for the meta tag, which holds the value of the metadata */
  content: string;
}

/**
 * Represents a link element in the HTML head, including attributes and specific properties for link tags.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#attr-as
 */
export interface HtmlHeadLink extends HtmlAttributes {
  /** The relationship between the current document and the linked resource (e.g., "stylesheet" for CSS files). */
  rel?: string;

  /** The URL of the linked resource, which can be an absolute or relative path to the resource being linked (e.g., a CSS file or an icon). */
  href?: string;
}

/**
 * Represents a script element in the HTML head, including attributes and specific properties for script tags.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script
 */
export interface HtmlHeadScript extends HtmlAttributes {
  /** The URL of the external script.  */
  src?: string;

  /** The content of the script, which can be used to include inline JavaScript code. */
  content?: string;
}

/**
 * Represents the attributes for the <base> HTML element, which specifies the base URL for all relative URLs in a document.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base
 */
export interface HtmlHeadBase extends HtmlAttributes {
  /** The URL to use as the base for all relative URLs in the document. */
  href?: string;

  /** The target attribute specifies the default browsing context for hyperlinks and forms in the document. */
  target?: string;
}

/**
 * Represents a style element in the HTML head, including attributes and specific properties for style tags.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style
 */
export interface HtmlHeadStyle extends HtmlAttributes {
  /** The content of the style, which can be used to include inline CSS code. */
  content: string;
}

/**
 * Represents a noscript element in the HTML head, including attributes and specific properties for noscript tags.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/noscript
 */
export interface HtmlHeadNoscript {
  /** The content of the noscript element, which can be used to include alternative content for users who have disabled JavaScript. */
  content: string;
}

/**
 * Represents a generic HTML head tag, which can be one of several types (title, meta, link, script, style, noscript, or base), each with its own specific properties and attributes.
 */
export type HtmlHeadTag =
  | {
      /**  */
      type: "title";

      /**  */
      value: string;
    }
  | {
      /**  */
      type: "meta";

      /**  */
      value: HtmlHeadMeta;
    }
  | {
      /**  */
      type: "link";

      /**  */
      value: HtmlHeadLink;
    }
  | {
      /**  */
      type: "script";

      /**  */
      value: HtmlHeadScript;
    }
  | {
      /**  */
      type: "style";

      /**  */
      value: HtmlHeadStyle;
    }
  | {
      /**  */
      type: "noscript";

      /**  */
      value: HtmlHeadNoscript;
    }
  | {
      /**  */
      type: "base";

      /**  */
      value: HtmlHeadBase;
    };
