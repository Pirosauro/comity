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
});
