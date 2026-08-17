import { DefaultHtmlLayoutCollector } from "@comity/html";
import { h } from "preact";
import { render } from "preact-render-to-string";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LayoutProvider } from "../layout.js";
import { useLayout } from "../use-layout.js";

describe("useLayout", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the collector when used inside a LayoutProvider", () => {
    const collector = new DefaultHtmlLayoutCollector();
    const Probe = () => {
      const layout = useLayout();

      return <span data-available={layout !== null}>probe</span>;
    };

    const html = render(
      <LayoutProvider collector={collector}>
        <Probe />
      </LayoutProvider>
    );

    expect(html).toContain('data-available="true"');
  });

  it("returns null and warns when used outside a LayoutProvider", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const Probe = () => {
      const layout = useLayout();

      return <span data-available={layout !== null}>probe</span>;
    };

    const html = render(<Probe />);

    expect(html).toContain('data-available="false"');
    expect(warn).toHaveBeenCalledWith("useLayout must be used inside LayoutProvider");
  });
});
