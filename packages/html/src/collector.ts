import type { HtmlAttributes } from "./contracts/attribute.js";
import type {
  HtmlHeadBase,
  HtmlHeadLink,
  HtmlHeadMeta,
  HtmlHeadNoscript,
  HtmlHeadScript,
  HtmlHeadStyle,
  HtmlHeadTag,
} from "./contracts/head.js";
import type { HtmlLayoutCollector } from "./contracts/layout.js";

/**
 *
 */
export class DefaultHtmlLayoutCollector implements HtmlLayoutCollector {
  /** */
  #headTags: HtmlHeadTag[] = [];

  /** */
  #bodyAttrs: HtmlAttributes = {};

  /** */
  #htmlAttrs: HtmlAttributes = {};

  /** */
  #index = new Map<string, number>();

  /** @inheritdoc */
  get bodyAttrs() {
    return { ...this.#bodyAttrs };
  }

  /** @inheritdoc */
  get htmlAttrs() {
    return { ...this.#htmlAttrs };
  }

  /** @inheritdoc */
  get headTags() {
    return this.#headTags.map((t) => ({
      ...t,
      value: typeof t.value === "object" ? { ...t.value } : t.value,
    })) as HtmlHeadTag[];
  }

  /**
   * Upserts a head tag in the internal state based on a unique key. If a tag with the same key already exists, it will be updated; otherwise, a new tag will be added to the collection.
   *
   * @param key - A unique identifier for the head tag, used to determine if the tag should be updated or added.
   * @param tag - The head tag to be upserted, which can be of various types (title, meta, link, script, style, noscript, or base).
   * @param merge - An optional boolean flag indicating whether to merge the new tag with the existing one if a tag with the same key already exists. If true, the new tag's properties will be merged with the existing tag's properties; if false or omitted, the existing tag will be replaced entirely by the new tag.
   */
  #upsertHeadTag(key: string, tag: HtmlHeadTag, merge?: boolean) {
    const i = this.#index.get(key);

    if (i !== undefined) {
      if (merge) {
        this.#headTags[i] = { ...this.#headTags[i], ...tag };
      } else {
        this.#headTags[i] = tag;
      }
    } else {
      this.#headTags.push(tag);
      this.#index.set(key, this.#headTags.length - 1);
    }
  }

  /** @inheritdoc */
  setTitle(title: string) {
    const key = "title";
    const tag: HtmlHeadTag = { type: key, value: title };

    this.#upsertHeadTag(key, tag, false);
  }

  /** @inheritdoc */
  setBase(attrs: HtmlHeadBase) {
    const key = "base";
    const tag: HtmlHeadTag = { type: key, value: attrs };

    this.#upsertHeadTag(key, tag, false);
  }

  /** @inheritdoc */
  setHtmlAttributes(attrs: HtmlAttributes) {
    this.#htmlAttrs = {
      ...(this.#htmlAttrs ?? {}),
      ...attrs,
    };
  }

  /** @inheritdoc */
  setBodyAttributes(attrs: HtmlAttributes) {
    this.#bodyAttrs = {
      ...(this.#bodyAttrs ?? {}),
      ...attrs,
    };
  }

  /** @inheritdoc */
  addMeta(attrs: HtmlHeadMeta) {
    const key = attrs["charset"]
      ? "meta:charset"
      : attrs.name
        ? `meta:name:${attrs.name}`
        : attrs.property
          ? `meta:prop:${attrs.property}`
          : attrs["id"]
            ? `meta:id:${attrs["id"]}`
            : undefined;
    const tag: HtmlHeadTag = { type: "meta", value: attrs };

    if (key) {
      this.#upsertHeadTag(key, tag, true);
    } else {
      this.#headTags.push(tag);
    }
  }

  /** @inheritdoc */
  addLink(attrs: HtmlHeadLink) {
    const key = attrs.href
      ? attrs.rel
        ? `link:rel:${attrs.rel}:href:${attrs.href}`
        : `link:href:${attrs.href}`
      : attrs["id"]
        ? `link:id:${attrs["id"]}`
        : undefined;
    const tag: HtmlHeadTag = { type: "link", value: attrs };

    if (key) {
      this.#upsertHeadTag(key, tag, true);
    } else {
      this.#headTags.push(tag);
    }
  }

  /** @inheritdoc */
  addScript(attrs: HtmlHeadScript) {
    const key = attrs.src
      ? `script:src:${attrs.src}`
      : attrs["id"]
        ? `script:id:${attrs["id"]}`
        : undefined;
    const tag: HtmlHeadTag = { type: "script", value: attrs };

    if (key) {
      this.#upsertHeadTag(key, tag, true);
    } else {
      this.#headTags.push(tag);
    }
  }

  /** @inheritdoc */
  addStyle(attrs: HtmlHeadStyle) {
    const key = attrs["id"] ? `style:id:${attrs["id"]}` : undefined;
    const tag: HtmlHeadTag = { type: "style", value: attrs };

    if (key) {
      this.#upsertHeadTag(key, tag, true);
    } else {
      this.#headTags.push(tag);
    }
  }

  /** @inheritdoc */
  addNoscript(attrs: HtmlHeadNoscript) {
    const tag: HtmlHeadTag = { type: "noscript", value: attrs };

    this.#headTags.push(tag);
  }
}
