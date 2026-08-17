import type { VNode } from "preact";

import { describe, expect, it } from "vitest";
import { Island } from "../island.js";

describe("Island", () => {
  it("renders the island element with the data root and serialized contract", () => {
    const props = {
      id: "hero",
      component: "Hero",
      data: { title: "Hello" },
      strategy: { kind: "visible" },
    };

    const tree = Island(props) as VNode;

    expect(tree.type).toBe("comity-island");

    const children = tree.props.children as VNode[];

    expect(children).toHaveLength(2);
    expect((children[0].props as { "data-comity-root": boolean })["data-comity-root"]).toBe(true);
    expect(children[1].type).toBe("script");

    const script = children[1].props as {
      type: string;
      dangerouslySetInnerHTML: { __html: string };
    };

    expect(script.type).toBe("application/json");
    expect(JSON.parse(script.dangerouslySetInnerHTML.__html)).toEqual({
      id: "hero",
      component: "Hero",
      data: { title: "Hello" },
      strategy: { kind: "visible" },
    });
  });

  it("renders children for SSR islands", () => {
    const props = {
      id: "hero",
      component: "Hero",
      data: {},
      strategy: { kind: "immediate" },
      children: "static content",
    };

    const tree = Island(props) as VNode;
    const children = tree.props.children as VNode[];
    const root = children[0].props as { children: unknown };

    expect(root.children).toBe("static content");
  });

  it("omits children for client-only islands", () => {
    const props = {
      id: "hero",
      component: "Hero",
      data: {},
      strategy: { kind: "immediate" },
      mode: "client-only",
      children: "static content",
    };

    const tree = Island(props) as VNode;
    const children = tree.props.children as VNode[];
    const root = children[0].props as { children: unknown };

    expect(root.children).toBeNull();
  });
});