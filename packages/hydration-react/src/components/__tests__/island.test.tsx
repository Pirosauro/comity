import type { ReactElement } from "react";

import { describe, expect, it } from "vitest";
import { Island } from "../island.js";

describe("Island", () => {
  it("renders the island element with the serialized contract", () => {
    const props = {
      id: "hero",
      component: "Hero",
      data: { title: "Hello" },
      strategy: { kind: "visible" },
    };

    const tree = Island(props) as ReactElement;

    expect(tree.type).toBe("comity-island");

    const children = tree.props.children as ReactElement[];

    expect(children).toHaveLength(2);
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

    const tree = Island(props) as ReactElement;
    const children = tree.props.children as ReactElement[];

    expect(children[0]).toBe("static content");
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

    const tree = Island(props) as ReactElement;
    const children = tree.props.children as ReactElement[];

    expect(children[0]).toBeNull();
  });
});