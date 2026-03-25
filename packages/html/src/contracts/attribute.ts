/**
 * HTML attribute value type
 */
export type HtmlAttributeValue = string | number | boolean | null | undefined;

/**
 * Represents a collection of HTML attributes, where the keys are attribute names and the values are of type HtmlAttributeValue.
 */
export type HtmlAttributes = Record<string, HtmlAttributeValue>;
