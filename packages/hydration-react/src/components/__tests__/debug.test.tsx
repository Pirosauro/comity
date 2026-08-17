import { writeFileSync } from "node:fs";
import { describe, it } from "vitest";
import { Island } from "../island.js";
describe("debug", () => {
  it("shows tree", () => {
    const tree = Island({ id: "hero", component: "Hero", data: {}, strategy: { kind: "immediate" }, children: "static content" });
    writeFileSync("/tmp/react-tree.json", JSON.stringify(tree, (k,v) => typeof v === "function" ? "[fn]" : v, 2));
  });
});
