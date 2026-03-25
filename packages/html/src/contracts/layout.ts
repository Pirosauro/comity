import type { HtmlAttributes } from "./attribute.js";
import type {
  HtmlHeadBase,
  HtmlHeadLink,
  HtmlHeadMeta,
  HtmlHeadNoscript,
  HtmlHeadScript,
  HtmlHeadStyle,
  HtmlHeadTag,
} from "./head.js";

/**
 *
 */
export interface HtmlLayoutCollector {
  /** */
  readonly headTags: HtmlHeadTag[];

  /** */
  readonly bodyAttrs: HtmlAttributes;

  /** */
  readonly htmlAttrs: HtmlAttributes;

  /** */
  setTitle: (title: string) => void;

  /** */
  setBase: (attrs: HtmlHeadBase) => void;

  /** */
  setHtmlAttributes: (attrs: HtmlAttributes) => void;

  /** */
  setBodyAttributes: (attrs: HtmlAttributes) => void;

  /** */
  addMeta: (attrs: HtmlHeadMeta) => void;

  /** */
  addLink: (attrs: HtmlHeadLink) => void;

  /** */
  addScript: (attrs: HtmlHeadScript) => void;

  /** */
  addStyle: (attrs: HtmlHeadStyle) => void;

  /** */
  addNoscript: (attrs: HtmlHeadNoscript) => void;
}
