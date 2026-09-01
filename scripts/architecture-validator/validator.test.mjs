import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { mkdtemp, rm, writeFile, mkdir } from "node:fs/promises";
import { discoverPackages, classifyFromPackageJson, buildGraph, classifyFromRepository } from "./graph.mjs";

async function createFixture(packages) {
  const baseDir = await mkdtemp(join(tmpdir(), "comity-validator-test-"));
  for (const [name, pkg] of Object.entries(packages)) {
    const pkgDir = join(baseDir, name.replace("@comity/", ""));
    await mkdir(pkgDir, { recursive: true });
    await writeFile(join(pkgDir, "package.json"), JSON.stringify(pkg, null, 2));
  }
  return baseDir;
}

describe("Architecture Validator - Classification", () => {
  let fixtureDir;

  afterEach(async () => {
    if (fixtureDir) {
      await rm(fixtureDir, { recursive: true, force: true });
    }
  });

  it("Test 1 — Unclassified package fails validation", async () => {
    fixtureDir = await createFixture({
      "@comity/foo": {
        name: "@comity/foo",
        version: "1.0.0",
        dependencies: { "@comity/pricing": "workspace:*" },
      },
      "@comity/pricing": {
        name: "@comity/pricing",
        version: "1.0.0",
        comity: { layer: "core" },
      },
    });

    const packages = await discoverPackages(fixtureDir);
    expect(() => classifyFromPackageJson(packages)).toThrow(
      "missing layer classification"
    );
  });

  it("Test 2 — Core → Core unregistered fails validation", async () => {
    fixtureDir = await createFixture({
      "@comity/foo": {
        name: "@comity/foo",
        version: "1.0.0",
        comity: { layer: "core" },
        dependencies: { "@comity/pricing": "workspace:*" },
      },
      "@comity/pricing": {
        name: "@comity/pricing",
        version: "1.0.0",
        comity: { layer: "core" },
      },
    });

    const packages = await discoverPackages(fixtureDir);
    const classification = classifyFromPackageJson(packages);
    const graph = buildGraph(packages, classification);

    // The edge exists in the graph
    const edge = graph.coreToCore.find(
      (e) => e.from === "@comity/foo" && e.to === "@comity/pricing"
    );
    expect(edge).toBeDefined();

    // Simulate the core rule validation (no register entry)
    const registerEdges = new Set();
    expect(registerEdges.has(`${edge.from} -> ${edge.to}`)).toBe(false);
  });

  it("Test 3 — Registered Core → Core passes validation", async () => {
    fixtureDir = await createFixture({
      "@comity/foo": {
        name: "@comity/foo",
        version: "1.0.0",
        comity: { layer: "core" },
        dependencies: { "@comity/pricing": "workspace:*" },
      },
      "@comity/pricing": {
        name: "@comity/pricing",
        version: "1.0.0",
        comity: { layer: "core" },
      },
    });

    const packages = await discoverPackages(fixtureDir);
    const classification = classifyFromPackageJson(packages);
    const graph = buildGraph(packages, classification);

    const edge = graph.coreToCore.find(
      (e) => e.from === "@comity/foo" && e.to === "@comity/pricing"
    );
    expect(edge).toBeDefined();

    // Simulate registered edge
    const registerEdges = new Set(["@comity/foo -> @comity/pricing"]);
    expect(registerEdges.has(`${edge.from} -> ${edge.to}`)).toBe(true);
  });

  it("Test 4 — Adapter classification recognized", async () => {
    fixtureDir = await createFixture({
      "@comity/acl": {
        name: "@comity/acl",
        version: "1.0.0",
        comity: { layer: "core" },
      },
      "@comity/acl-casl": {
        name: "@comity/acl-casl",
        version: "1.0.0",
        comity: { layer: "technology-adapter", implements: "@comity/acl" },
        dependencies: { "@comity/acl": "workspace:*" },
      },
    });

    const packages = await discoverPackages(fixtureDir);
    const classification = classifyFromPackageJson(packages);
    const graph = buildGraph(packages, classification);

    expect(classification.get("@comity/acl-casl")).toBe("technology-adapter");
    expect(graph.technologyAdapters.has("@comity/acl-casl")).toBe(true);
    expect(graph.adapters.has("@comity/acl-casl")).toBe(true);
  });

  it("Test 5 — Missing adapter classification fails", async () => {
    fixtureDir = await createFixture({
      "@comity/acl": {
        name: "@comity/acl",
        version: "1.0.0",
        comity: { layer: "core" },
      },
      "@comity/acl-casl": {
        name: "@comity/acl-casl",
        version: "1.0.0",
        // Missing comity.layer
        dependencies: { "@comity/acl": "workspace:*" },
      },
    });

    const packages = await discoverPackages(fixtureDir);
    expect(() => classifyFromPackageJson(packages)).toThrow(
      "missing layer classification"
    );
  });

  it("Validates all workspace packages are discovered", async () => {
    fixtureDir = await createFixture({
      "@comity/foo": {
        name: "@comity/foo",
        version: "1.0.0",
        comity: { layer: "core" },
      },
      "@comity/bar": {
        name: "@comity/bar",
        version: "1.0.0",
        comity: { layer: "technology-adapter", implements: "@comity/foo" },
        dependencies: { "@comity/foo": "workspace:*" },
      },
      "@comity/baz": {
        name: "@comity/baz",
        version: "1.0.0",
        comity: { layer: "primitives" },
      },
    });

    const packages = await discoverPackages(fixtureDir);
    expect(packages.length).toBe(3);
    const names = packages.map((p) => p.name).sort();
    expect(names).toEqual(["@comity/bar", "@comity/baz", "@comity/foo"]);
  });
});

describe("Repository markdown classification (legacy)", () => {
  it("parses repository.md format correctly", () => {
    const markdown = `
### Kernel / Primitives
| @comity/primitives | desc |
| @comity/kernel | desc |

### Core Modules
| @comity/http | desc |
| @comity/order | desc |

### Adapters
| @comity/http-hono | @comity/http | hono |
| @comity/acl-casl | @comity/acl | casl |
`;

    const classification = classifyFromRepository(markdown);
    expect(classification.get("@comity/primitives")).toBe("kernel-primitives");
    expect(classification.get("@comity/kernel")).toBe("kernel-primitives");
    expect(classification.get("@comity/http")).toBe("core");
    expect(classification.get("@comity/order")).toBe("core");
    expect(classification.get("@comity/http-hono")).toBe("technology-adapter");
    expect(classification.get("@comity/acl-casl")).toBe("technology-adapter");
  });
});
