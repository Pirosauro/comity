import { describe, expect, it } from "vitest";
import { createDefaultHtmlDocumentWriter } from "../writer.js";

describe("createDefaultHtmlDocumentWriter", () => {
  it("escapes closing script tags in inline head scripts", () => {
    const writer = createDefaultHtmlDocumentWriter({
      headTags: [
        {
          type: "script",
          value: {
            content: 'window.__STATE__ = {"html":"</script><script>alert(1)</script>"};',
          },
        },
      ],
      htmlAttrs: undefined,
      bodyAttrs: undefined,
    });

    const html = writer.writeLayoutOpen();

    expect(html).not.toContain("</script><script>alert(1)</script>");
    expect(html).toContain("<\\/script><script>alert(1)<\\/script>");
  });

  it("writes the doctype, html, head, and body opening tags", () => {
    const writer = createDefaultHtmlDocumentWriter({
      headTags: [],
      htmlAttrs: undefined,
      bodyAttrs: undefined,
    });

    const html = writer.writeLayoutOpen();

    expect(html).toBe("<!DOCTYPE html><html><head></head><body>");
  });

  it("includes html and body attributes when present", () => {
    const writer = createDefaultHtmlDocumentWriter({
      headTags: [],
      htmlAttrs: { lang: "en", "data-theme": "dark" },
      bodyAttrs: { class: "app" },
    });

    const html = writer.writeLayoutOpen();

    expect(html).toContain('<html lang="en" data-theme="dark">');
    expect(html).toContain('<body class="app">');
  });

  it("closes the document", () => {
    const writer = createDefaultHtmlDocumentWriter({
      headTags: [],
      htmlAttrs: undefined,
      bodyAttrs: undefined,
    });

    expect(writer.writeLayoutClose()).toBe("</body></html>");
  });

  it("serializes a title tag with escaped content", () => {
    const writer = createDefaultHtmlDocumentWriter({
      headTags: [{ type: "title", value: "Hello & <World>" }],
      htmlAttrs: undefined,
      bodyAttrs: undefined,
    });

    const html = writer.writeLayoutOpen();

    expect(html).toContain("<title>Hello &amp; &lt;World&gt;</title>");
  });

  it("serializes meta, link, and base tags with attributes", () => {
    const writer = createDefaultHtmlDocumentWriter({
      headTags: [
        { type: "meta", value: { name: "description", content: "A & B" } },
        { type: "link", value: { rel: "stylesheet", href: "/a.css" } },
        { type: "base", value: { href: "/base/" } },
      ],
      htmlAttrs: undefined,
      bodyAttrs: undefined,
    });

    const html = writer.writeLayoutOpen();

    expect(html).toContain('<meta name="description" content="A &amp; B">');
    expect(html).toContain('<link rel="stylesheet" href="/a.css">');
    expect(html).toContain('<base href="/base/">');
  });

  it("filters null, undefined, and false attribute values", () => {
    const writer = createDefaultHtmlDocumentWriter({
      headTags: [
        {
          type: "link",
          value: { rel: "icon", href: undefined as unknown as string, disabled: false },
        },
      ],
      htmlAttrs: undefined,
      bodyAttrs: undefined,
    });

    const html = writer.writeLayoutOpen();

    expect(html).toContain('<link rel="icon">');
    expect(html).not.toContain("disabled");
  });

  it("renders boolean attributes as bare names", () => {
    const writer = createDefaultHtmlDocumentWriter({
      headTags: [],
      htmlAttrs: undefined,
      bodyAttrs: { "data-bool": true },
    });

    const html = writer.writeLayoutOpen();

    expect(html).toContain('<body data-bool>');
  });

  it("filters attributes with names rejected by the default validator", () => {
    const writer = createDefaultHtmlDocumentWriter({
      headTags: [],
      htmlAttrs: undefined,
      bodyAttrs: { "onclick": "alert(1)", "onload": "evil()" },
    });

    const html = writer.writeLayoutOpen();

    expect(html).not.toContain("onclick");
    expect(html).not.toContain("onload");
  });

  it("serializes a script tag with attributes and inline content", () => {
    const writer = createDefaultHtmlDocumentWriter({
      headTags: [
        {
          type: "script",
          value: { src: "/a.js", defer: true, content: "var a = 1;" },
        },
      ],
      htmlAttrs: undefined,
      bodyAttrs: undefined,
    });

    const html = writer.writeLayoutOpen();

    expect(html).toContain('<script src="/a.js" defer>var a = 1;</script>');
  });

  it("serializes a style tag with content", () => {
    const writer = createDefaultHtmlDocumentWriter({
      headTags: [
        { type: "style", value: { id: "st", content: "body { color: red; }" } },
      ],
      htmlAttrs: undefined,
      bodyAttrs: undefined,
    });

    const html = writer.writeLayoutOpen();

    expect(html).toContain('<style id="st">body { color: red; }</style>');
  });

  it("serializes a noscript tag with content", () => {
    const writer = createDefaultHtmlDocumentWriter({
      headTags: [{ type: "noscript", value: { content: "Please enable JS" } }],
      htmlAttrs: undefined,
      bodyAttrs: undefined,
    });

    const html = writer.writeLayoutOpen();

    expect(html).toContain("<noscript>Please enable JS</noscript>");
  });

  it("handles a script tag without content", () => {
    const writer = createDefaultHtmlDocumentWriter({
      headTags: [{ type: "script", value: { src: "/a.js" } }],
      htmlAttrs: undefined,
      bodyAttrs: undefined,
    });

    const html = writer.writeLayoutOpen();

    expect(html).toContain('<script src="/a.js"></script>');
  });

  it("applies the custom attribute validator", () => {
    const writer = createDefaultHtmlDocumentWriter(
      {
        headTags: [],
        htmlAttrs: undefined,
        bodyAttrs: { "data-ok": "yes", "bad name": "no" },
      },
      { validateAttributeName: (name) => /^[a-z-]+$/.test(name) }
    );

    const html = writer.writeLayoutOpen();

    expect(html).toContain('data-ok="yes"');
    expect(html).not.toContain("bad");
  });

  it("normalizes attribute names", () => {
    const writer = createDefaultHtmlDocumentWriter(
      {
        headTags: [],
        htmlAttrs: undefined,
        bodyAttrs: { "dataTestId": "x" },
      },
      { normalizeAttributeName: (name) => name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`) }
    );

    const html = writer.writeLayoutOpen();

    expect(html).toContain('data-test-id="x"');
  });

  it("escapes attribute values using a custom escape function", () => {
    const writer = createDefaultHtmlDocumentWriter(
      {
        headTags: [],
        htmlAttrs: undefined,
        bodyAttrs: { title: "a\"b" },
      },
      { escapeAttributeValue: (str) => str.replace(/"/g, "&quot;") }
    );

    const html = writer.writeLayoutOpen();

    expect(html).toContain('title="a&quot;b"');
  });

  it("orders head tags using a custom order function", () => {
    const writer = createDefaultHtmlDocumentWriter(
      {
        headTags: [
          { type: "meta", value: { name: "description", content: "x" } },
          { type: "title", value: "My Page" },
        ],
        htmlAttrs: undefined,
        bodyAttrs: undefined,
      },
      { orderTags: (tags) => [...tags].reverse() }
    );

    const html = writer.writeLayoutOpen();

    expect(html.indexOf("<title>")).toBeLessThan(html.indexOf("<meta"));
  });

  it("does not include an attribute that has an empty string value", () => {
    const writer = createDefaultHtmlDocumentWriter({
      headTags: [],
      htmlAttrs: undefined,
      bodyAttrs: { "data-empty": "" },
    });

    const html = writer.writeLayoutOpen();

    expect(html).toContain('data-empty=""');
  });
});
