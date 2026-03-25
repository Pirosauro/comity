import type { HtmlAttributes } from "./contracts/attribute.js";
import type { HtmlDocumentState, HtmlDocumentWriter } from "./contracts/document.js";
import type { HtmlHeadTag } from "./contracts/head.js";

/**
 * Options for creating a default HTML document writer, including a function to serialize attributes.
 */
export interface HtmlWriterOptions {
  /** Function to validate HTML attribute names. */
  validateAttributeName?: (name: string) => boolean;

  /** Function to normalize HTML attribute names, allowing for custom transformations (e.g., converting camelCase to kebab-case). */
  normalizeAttributeName?: (name: string) => string;

  /** Function to escape HTML attribute values. */
  escapeAttributeValue?: (str: string) => string;

  /** Policy for customizing the order of HTML head elements. */
  orderTags?: (tags: HtmlHeadTag[]) => HtmlHeadTag[];
}

/**
 * Default implementation of the HtmlDocumentWriter interface.
 *
 * @param name - The name of the attribute to validate.
 *
 * @returns A boolean indicating whether the attribute name is valid according to HTML specifications.
 */
function defaultValidateAttributeName(name: string) {
  if (/^on/i.test(name)) return false;

  return /^[a-zA-Z_:][a-zA-Z0-9:._-]*$/.test(name);
}

/**
 * Escapes a string value to ensure it is safe for use in HTML attributes and content.
 *
 * @param str - The string value to escape
 *
 * @returns The escaped string, which is safe to use in HTML
 */
function defaultEscapeValue(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Creates a default HTML document writer with optional customization.
 *
 * @param state - The current state of the HTML document, including attributes, title, and other elements.
 * @param options - Optional configuration for the HTML writer, such as a custom attribute serialization function.
 *
 * @returns An object implementing the HtmlDocumentWriter interface, capable of generating HTML output based on the provided state and options.
 */
export function createDefaultHtmlDocumentWriter(
  state: HtmlDocumentState,
  options?: HtmlWriterOptions
): HtmlDocumentWriter {
  const {
    validateAttributeName = defaultValidateAttributeName,
    escapeAttributeValue = defaultEscapeValue,
    normalizeAttributeName = (name: string) => name,
    orderTags = (tags: HtmlHeadTag[]) => tags,
  } = options ?? {};

  /**
   * Serializes HTML attributes into a string format suitable for inclusion in HTML elements. This function takes an object representing HTML attributes and their values, filters out any attributes with null, undefined, or false values, and constructs a string where each attribute is formatted as key="value". Boolean attributes (with a value of true) are included as just the key without a value.
   *
   * @param attrs - An object representing HTML attributes, where the keys are attribute names and the values are the corresponding attribute values. The values can be of any type, but only those that are not null, undefined, or false will be included in the output string.
   *
   * @returns A string representation of the HTML attributes, formatted for inclusion in an HTML element. For example, an input of { id: "main", disabled: true, hidden: false } would return 'id="main" disabled'.
   */
  function serializeAttrs(attrs?: HtmlAttributes) {
    if (!attrs) return "";

    return Object.entries(attrs)
      .filter(([k, v]) => v !== null && v !== undefined && v !== false && validateAttributeName(k))
      .map(([k, v]) =>
        v === true
          ? normalizeAttributeName(k)
          : `${normalizeAttributeName(k)}="${escapeAttributeValue(String(v))}"`
      )
      .join(" ");
  }

  /**
   * Serializes an HTML head tag into a string format suitable for inclusion in the HTML document's head section. This function handles different types of head tags, including title, meta, link, script, style, noscript, and base, each with its own specific serialization logic.
   *
   * @param tag - The HTML head tag to serialize, which can be of various types (title, meta, link, script, style, noscript, or base), each with its own specific properties and attributes.
   *
   * @returns A string representation of the HTML head tag, formatted according to its type and properties. For example, a title tag with value "My Page" would return '<title>My Page</title>', while a meta tag with name "description" and content "A sample page" would return '<meta name="description" content="A sample page">'.
   */
  function serializeTag(tag: HtmlHeadTag): string {
    switch (tag.type) {
      case "title":
        return `<title>${defaultEscapeValue(tag.value)}</title>`;

      case "meta":
        return `<meta ${serializeAttrs(tag.value)}>`;

      case "link":
        return `<link ${serializeAttrs(tag.value)}>`;

      case "base":
        return `<base ${serializeAttrs(tag.value)}>`;

      case "script": {
        const { content, ...attrs } = tag.value;

        return `<script ${serializeAttrs(attrs)}>${content ?? ""}</script>`;
      }

      case "style": {
        const { content, ...attrs } = tag.value;

        return `<style ${serializeAttrs(attrs)}>${content}</style>`;
      }

      case "noscript":
        return `<noscript>${tag.value.content}</noscript>`;
    }
  }

  const writer: HtmlDocumentWriter = {
    /**
     * @inheritdoc
     */
    writeLayoutOpen(): string {
      const htmlAttrs = serializeAttrs(state.htmlAttrs);
      const bodyAttrs = serializeAttrs(state.bodyAttrs);
      const headContent = orderTags(state.headTags).map(serializeTag);

      return (
        "<!DOCTYPE html>" +
        (htmlAttrs ? `<html ${htmlAttrs}>` : "<html>") +
        "<head>" +
        headContent.join("") +
        "</head>" +
        (bodyAttrs ? `<body ${bodyAttrs}>` : "<body>")
      );
    },

    /**
     * @inheritdoc
     */
    writeLayoutClose(): string {
      return "</body></html>";
    },
  };

  return writer;
}
