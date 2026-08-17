import { describe, expect, it } from "vitest";
import { DefaultHtmlLayoutCollector } from "../collector.js";

describe("DefaultHtmlLayoutCollector", () => {
  it("returns a copy of head tags", () => {
    const collector = new DefaultHtmlLayoutCollector();

    collector.setTitle("My Page");

    const tags = collector.headTags;

    tags.push({ type: "title", value: "Tampered" });

    expect(collector.headTags).toHaveLength(1);
    expect(collector.headTags[0]).toEqual({ type: "title", value: "My Page" });
  });

  it("returns a copy of object values in head tags", () => {
    const collector = new DefaultHtmlLayoutCollector();

    collector.addMeta({ name: "description", content: "hello" });

    const tag = collector.headTags[0];

    (tag.value as { content: string }).content = "tampered";

    expect(collector.headTags[0].value).toEqual({ name: "description", content: "hello" });
  });

  it("returns a copy of html attributes", () => {
    const collector = new DefaultHtmlLayoutCollector();

    collector.setHtmlAttributes({ lang: "en" });

    const attrs = collector.htmlAttrs;

    attrs.lang = "it";

    expect(collector.htmlAttrs).toEqual({ lang: "en" });
  });

  it("returns a copy of body attributes", () => {
    const collector = new DefaultHtmlLayoutCollector();

    collector.setBodyAttributes({ class: "app" });

    const attrs = collector.bodyAttrs;

    attrs.class = "tampered";

    expect(collector.bodyAttrs).toEqual({ class: "app" });
  });

  it("merges html attributes across calls", () => {
    const collector = new DefaultHtmlLayoutCollector();

    collector.setHtmlAttributes({ lang: "en" });
    collector.setHtmlAttributes({ "data-theme": "dark" });

    expect(collector.htmlAttrs).toEqual({ lang: "en", "data-theme": "dark" });
  });

  it("merges body attributes across calls", () => {
    const collector = new DefaultHtmlLayoutCollector();

    collector.setBodyAttributes({ class: "app" });
    collector.setBodyAttributes({ "data-page": "home" });

    expect(collector.bodyAttrs).toEqual({ class: "app", "data-page": "home" });
  });

  it("upserts title by key", () => {
    const collector = new DefaultHtmlLayoutCollector();

    collector.setTitle("First");
    collector.setTitle("Second");

    expect(collector.headTags).toEqual([{ type: "title", value: "Second" }]);
  });

  it("upserts base by key", () => {
    const collector = new DefaultHtmlLayoutCollector();

    collector.setBase({ href: "/first/" });
    collector.setBase({ href: "/second/", target: "_blank" });

    expect(collector.headTags).toEqual([
      { type: "base", value: { href: "/second/", target: "_blank" } },
    ]);
  });

  it("merges meta tags with the same key", () => {
    const collector = new DefaultHtmlLayoutCollector();

    collector.addMeta({ name: "description", content: "first" });
    collector.addMeta({ name: "description", content: "second", "data-extra": "yes" });

    expect(collector.headTags).toEqual([
      { type: "meta", value: { name: "description", content: "second", "data-extra": "yes" } },
    ]);
  });

  it("keys meta by charset", () => {
    const collector = new DefaultHtmlLayoutCollector();

    collector.addMeta({ charset: "utf-8" });
    collector.addMeta({ charset: "utf-16" });

    expect(collector.headTags).toEqual([{ type: "meta", value: { charset: "utf-16" } }]);
  });

  it("keys meta by property", () => {
    const collector = new DefaultHtmlLayoutCollector();

    collector.addMeta({ property: "og:title", content: "A" });
    collector.addMeta({ property: "og:title", content: "B" });

    expect(collector.headTags).toEqual([{ type: "meta", value: { property: "og:title", content: "B" } }]);
  });

  it("keys meta by id", () => {
    const collector = new DefaultHtmlLayoutCollector();

    collector.addMeta({ id: "m1", content: "A" });
    collector.addMeta({ id: "m1", content: "B" });

    expect(collector.headTags).toEqual([{ type: "meta", value: { id: "m1", content: "B" } }]);
  });

  it("appends meta tags without a key", () => {
    const collector = new DefaultHtmlLayoutCollector();

    collector.addMeta({ content: "A" });
    collector.addMeta({ content: "B" });

    expect(collector.headTags).toEqual([
      { type: "meta", value: { content: "A" } },
      { type: "meta", value: { content: "B" } },
    ]);
  });

  it("merges link tags with rel and href", () => {
    const collector = new DefaultHtmlLayoutCollector();

    collector.addLink({ rel: "stylesheet", href: "/a.css" });
    collector.addLink({ rel: "stylesheet", href: "/a.css", media: "print" });

    expect(collector.headTags).toEqual([
      { type: "link", value: { rel: "stylesheet", href: "/a.css", media: "print" } },
    ]);
  });

  it("keys link by href alone", () => {
    const collector = new DefaultHtmlLayoutCollector();

    collector.addLink({ href: "/a.css" });
    collector.addLink({ href: "/a.css" });

    expect(collector.headTags).toHaveLength(1);
  });

  it("keys link by id when href is absent", () => {
    const collector = new DefaultHtmlLayoutCollector();

    collector.addLink({ id: "l1", rel: "stylesheet" });
    collector.addLink({ id: "l1", rel: "stylesheet", media: "print" });

    expect(collector.headTags).toEqual([
      { type: "link", value: { id: "l1", rel: "stylesheet", media: "print" } },
    ]);
  });

  it("keys link by href even when an id is present", () => {
    const collector = new DefaultHtmlLayoutCollector();

    collector.addLink({ id: "l1", href: "/a.css" });
    collector.addLink({ id: "l1", href: "/b.css" });

    expect(collector.headTags).toEqual([
      { type: "link", value: { id: "l1", href: "/a.css" } },
      { type: "link", value: { id: "l1", href: "/b.css" } },
    ]);
  });

  it("appends link tags without a key", () => {
    const collector = new DefaultHtmlLayoutCollector();

    collector.addLink({ rel: "stylesheet" });

    expect(collector.headTags).toEqual([{ type: "link", value: { rel: "stylesheet" } }]);
  });

  it("merges script tags by src", () => {
    const collector = new DefaultHtmlLayoutCollector();

    collector.addScript({ src: "/a.js", async: true });
    collector.addScript({ src: "/a.js", defer: true });

    expect(collector.headTags).toEqual([{ type: "script", value: { src: "/a.js", defer: true } }]);
  });

  it("keys script by id when src is absent", () => {
    const collector = new DefaultHtmlLayoutCollector();

    collector.addScript({ id: "s1", content: "var a = 1;" });
    collector.addScript({ id: "s1", content: "var b = 2;" });

    expect(collector.headTags).toEqual([{ type: "script", value: { id: "s1", content: "var b = 2;" } }]);
  });

  it("keys script by src even when an id is present", () => {
    const collector = new DefaultHtmlLayoutCollector();

    collector.addScript({ id: "s1", src: "/a.js" });
    collector.addScript({ id: "s1", src: "/b.js" });

    expect(collector.headTags).toEqual([
      { type: "script", value: { id: "s1", src: "/a.js" } },
      { type: "script", value: { id: "s1", src: "/b.js" } },
    ]);
  });

  it("appends script tags without a key", () => {
    const collector = new DefaultHtmlLayoutCollector();

    collector.addScript({ content: "var a = 1;" });

    expect(collector.headTags).toEqual([{ type: "script", value: { content: "var a = 1;" } }]);
  });

  it("merges style tags by id", () => {
    const collector = new DefaultHtmlLayoutCollector();

    collector.addStyle({ id: "st1", content: "body {}" });
    collector.addStyle({ id: "st1", content: "html {}" });

    expect(collector.headTags).toEqual([{ type: "style", value: { id: "st1", content: "html {}" } }]);
  });

  it("appends style tags without an id", () => {
    const collector = new DefaultHtmlLayoutCollector();

    collector.addStyle({ content: "body {}" });
    collector.addStyle({ content: "html {}" });

    expect(collector.headTags).toEqual([
      { type: "style", value: { content: "body {}" } },
      { type: "style", value: { content: "html {}" } },
    ]);
  });

  it("appends noscript tags", () => {
    const collector = new DefaultHtmlLayoutCollector();

    collector.addNoscript({ content: "JS required" });
    collector.addNoscript({ content: "Also fallback" });

    expect(collector.headTags).toEqual([
      { type: "noscript", value: { content: "JS required" } },
      { type: "noscript", value: { content: "Also fallback" } },
    ]);
  });
});
