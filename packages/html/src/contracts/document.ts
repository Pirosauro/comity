import type { HtmlAttributes } from "./attribute.js";
import type { HtmlHeadTag } from "./head.js";

/**
 * Represents the state of the HTML document, including the head and body elements.
 */
export interface HtmlDocumentState {
  /** */
  readonly headTags: HtmlHeadTag[];

  /** Attributes for the <html> HTML element. */
  readonly htmlAttrs?: HtmlAttributes;

  /** Attributes for the <body> HTML element. */
  readonly bodyAttrs?: HtmlAttributes;
}

/**
 * Represents a writer for the HTML document, responsible for serializing the head and body sections based on the provided document state.
 */
export interface HtmlDocumentWriter {
  /** Serializes the body section of the HTML document based on the provided document state. */
  writeLayoutOpen: () => string;

  /** Serializes the closing tags for the body and html elements. */
  writeLayoutClose: () => string;
}
