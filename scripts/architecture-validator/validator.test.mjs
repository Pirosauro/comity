import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { mkdtemp, rm, writeFile, mkdir } from "node:fs/promises";
import { discoverPackages, classifyFromPackageJson, buildGraph } from "./graph.mjs";
import { validateCore } from "./rules/core.mjs";
import { validateImplements } from "./rules/implements.mjs";
import {
  validateRegisterSchema,
  parseRegisterEdges,
  parseRejectedEdges,
} from "./rules/register.mjs";
import { readJson, readText } from "./utils/filesystem.mjs";
import { runValidation } from "./index.mjs";

async function createFixture(packages) {
  const baseDir = await mkdtemp(join(tmpdir(), "comity-validator-test-"));
  for (const [name, pkg] of Object.entries(packages)) {
    const pkgDir = join(baseDir, name.replace("@comity/", ""));
    await mkdir(pkgDir, { recursive: true });
    await writeFile(join(pkgDir, "package.json"), JSON.stringify(pkg, null, 2));
  }
  return baseDir;
}

async function createTestContext(fixtureDir) {
  const packages = await discoverPackages(fixtureDir);
  const classification = classifyFromPackageJson(packages);
  const graph = buildGraph(packages, classification);

  const register = { edges: [] };
  const schema = { type: "object", properties: { edges: { type: "array" } } };
  const rejectedEdges = [];
  const registerEdges = parseRegisterEdges(register);
  const registerSchemaErrors = validateRegisterSchema(register, schema);

  return {
    packages,
    classification,
    graph,
    register,
    schema,
    rejectedEdges,
    registerEdges,
    registerSchemaErrors,
  };
}

describe("Architecture Validator - Classification", () => {
  let fixtureDir;

  afterEach(async () => {
    if (fixtureDir) {
      await rm(fixtureDir, { recursive: true, force: true });
    }
  });

  it("Test A — Missing layer fails validation", async () => {
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

  it("Test B — Invalid layer fails validation", async () => {
    fixtureDir = await createFixture({
      "@comity/foo": {
        name: "@comity/foo",
        version: "1.0.0",
        comity: { layer: "invalid-layer" },
      },
      "@comity/pricing": {
        name: "@comity/pricing",
        version: "1.0.0",
        comity: { layer: "core" },
      },
    });

    const packages = await discoverPackages(fixtureDir);
    expect(() => classifyFromPackageJson(packages)).toThrow(
      'Invalid layer "invalid-layer"'
    );
  });

  it("Test C — Unregistered Core → Core fails with ARCH-CORE-001", async () => {
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

    const context = await createTestContext(fixtureDir);
    const violations = validateCore(context);

    expect(violations.length).toBe(1);
    expect(violations[0].code).toBe("ARCH-CORE-001");
    expect(violations[0].edge.from).toBe("@comity/foo");
    expect(violations[0].edge.to).toBe("@comity/pricing");
  });

  it("Test D — Registered Core → Core passes validation", async () => {
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

    const context = await createTestContext(fixtureDir);
    context.registerEdges = [{ from: "@comity/foo", to: "@comity/pricing" }];

    const violations = validateCore(context);
    expect(violations.length).toBe(0);
  });

  it("Test E — Technology adapter classification recognized", async () => {
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

  it("Test F — Missing adapter classification fails", async () => {
    fixtureDir = await createFixture({
      "@comity/acl": {
        name: "@comity/acl",
        version: "1.0.0",
        comity: { layer: "core" },
      },
      "@comity/acl-casl": {
        name: "@comity/acl-casl",
        version: "1.0.0",
        dependencies: { "@comity/acl": "workspace:*" },
      },
    });

    const packages = await discoverPackages(fixtureDir);
    expect(() => classifyFromPackageJson(packages)).toThrow(
      "missing layer classification"
    );
  });

  it("Test G — Missing implements fails validation", async () => {
    fixtureDir = await createFixture({
      "@comity/acl": {
        name: "@comity/acl",
        version: "1.0.0",
        comity: { layer: "core" },
      },
      "@comity/acl-casl": {
        name: "@comity/acl-casl",
        version: "1.0.0",
        comity: { layer: "technology-adapter" },
        dependencies: { "@comity/acl": "workspace:*" },
      },
    });

    const context = await createTestContext(fixtureDir);
    const violations = validateImplements(context);

    expect(violations.length).toBe(1);
    expect(violations[0].code).toBe("ARCH-IMPLEMENTS-001");
    expect(violations[0].message).toContain("missing required");
    expect(violations[0].message).toContain("@comity/acl-casl");
  });

  it("Test H — Invalid implements target fails validation", async () => {
    const testCases = [
      {
        name: "nonexistent package",
        implements: "@comity/nonexistent",
        expectedCode: "ARCH-IMPLEMENTS-003",
      },
      {
        name: "kernel package",
        implements: "@comity/kernel",
        expectedCode: "ARCH-IMPLEMENTS-004",
      },
      {
        name: "another adapter",
        implements: "@comity/http-hono",
        expectedCode: "ARCH-IMPLEMENTS-004",
      },
    ];

    for (const tc of testCases) {
      fixtureDir = await createFixture({
        "@comity/acl": {
          name: "@comity/acl",
          version: "1.0.0",
          comity: { layer: "core" },
        },
        "@comity/kernel": {
          name: "@comity/kernel",
          version: "1.0.0",
          comity: { layer: "kernel" },
        },
        "@comity/http-hono": {
          name: "@comity/http-hono",
          version: "1.0.0",
          comity: { layer: "technology-adapter", implements: "@comity/http" },
          dependencies: { "@comity/http": "workspace:*", "@comity/kernel": "workspace:*" },
        },
        "@comity/http": {
          name: "@comity/http",
          version: "1.0.0",
          comity: { layer: "core" },
        },
        "@comity/acl-casl": {
          name: "@comity/acl-casl",
          version: "1.0.0",
          comity: { layer: "technology-adapter", implements: tc.implements },
          dependencies: { [tc.implements]: "workspace:*" },
        },
      });

      const context = await createTestContext(fixtureDir);
      const violations = validateImplements(context);

      const relevant = violations.filter((v) => v.edge.from === "@comity/acl-casl");
      expect(relevant.length).toBeGreaterThan(0);
      expect(relevant[0].code).toBe(tc.expectedCode);
      expect(relevant[0].message).toContain("@comity/acl-casl");

      await rm(fixtureDir, { recursive: true, force: true });
      fixtureDir = null;
    }
  });

  it("Test I — Valid implements passes validation", async () => {
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

    const context = await createTestContext(fixtureDir);
    const violations = validateImplements(context);

    const relevant = violations.filter((v) => v.edge.from === "@comity/acl-casl");
    expect(relevant.length).toBe(0);
  });

  it("Test K — Non-string implements fails with ARCH-IMPLEMENTS-002", async () => {
    fixtureDir = await createFixture({
      "@comity/acl": {
        name: "@comity/acl",
        version: "1.0.0",
        comity: { layer: "core" },
      },
      "@comity/acl-casl": {
        name: "@comity/acl-casl",
        version: "1.0.0",
        comity: { layer: "technology-adapter", implements: 123 },
        dependencies: { "@comity/acl": "workspace:*" },
      },
    });

    const context = await createTestContext(fixtureDir);
    const violations = validateImplements(context);

    const relevant = violations.filter((v) => v.edge.from === "@comity/acl-casl" && v.code === "ARCH-IMPLEMENTS-002");
    expect(relevant.length).toBe(1);
    expect(relevant[0].message).toContain("expected string, got number");
    expect(relevant[0].message).toContain("@comity/acl-casl");
  });

  it("Test J — Full workspace discovery", async () => {
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
      "@comity/qux": {
        name: "@comity/qux",
        version: "1.0.0",
        comity: { layer: "kernel" },
        dependencies: { "@comity/primitives": "workspace:*" },
      },
      "@comity/primitives": {
        name: "@comity/primitives",
        version: "1.0.0",
        comity: { layer: "primitives" },
      },
    });

    const packages = await discoverPackages(fixtureDir);
    expect(packages.length).toBe(5);
    const names = packages.map((p) => p.name).sort();
    expect(names).toEqual([
      "@comity/bar",
      "@comity/baz",
      "@comity/foo",
      "@comity/primitives",
      "@comity/qux",
    ]);

    const classification = classifyFromPackageJson(packages);
    expect(classification.size).toBe(5);
  });
});

describe("Architecture Validator - Integration (full validation path)", () => {
  let fixtureDir;

  afterEach(async () => {
    if (fixtureDir) {
      await rm(fixtureDir, { recursive: true, force: true });
    }
  });

  it("Full validation catches unregistered Core → Core", async () => {
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

    const testContext = await createTestContext(fixtureDir);
    const { violations } = await runValidation(testContext);

    const coreViolations = violations.filter((v) => v.code === "ARCH-CORE-001");
    expect(coreViolations.length).toBe(1);
    expect(coreViolations[0].edge.from).toBe("@comity/foo");
    expect(coreViolations[0].edge.to).toBe("@comity/pricing");
  });

  it("Full validation catches missing implements", async () => {
    fixtureDir = await createFixture({
      "@comity/acl": {
        name: "@comity/acl",
        version: "1.0.0",
        comity: { layer: "core" },
      },
      "@comity/acl-casl": {
        name: "@comity/acl-casl",
        version: "1.0.0",
        comity: { layer: "technology-adapter" },
        dependencies: { "@comity/acl": "workspace:*" },
      },
    });

    const testContext = await createTestContext(fixtureDir);
    const { violations } = await runValidation(testContext);

    const implementsViolations = violations.filter((v) => v.code === "ARCH-IMPLEMENTS-001");
    expect(implementsViolations.length).toBe(1);
    expect(implementsViolations[0].message).toContain("@comity/acl-casl");
  });

  it("Full validation catches invalid implements target (kernel)", async () => {
    fixtureDir = await createFixture({
      "@comity/kernel": {
        name: "@comity/kernel",
        version: "1.0.0",
        comity: { layer: "kernel" },
      },
      "@comity/acl-casl": {
        name: "@comity/acl-casl",
        version: "1.0.0",
        comity: { layer: "technology-adapter", implements: "@comity/kernel" },
        dependencies: { "@comity/kernel": "workspace:*" },
      },
    });

    const testContext = await createTestContext(fixtureDir);
    const { violations } = await runValidation(testContext);

    const implementsViolations = violations.filter(
      (v) => v.code === "ARCH-IMPLEMENTS-004" && v.edge.from === "@comity/acl-casl"
    );
    expect(implementsViolations.length).toBe(1);
    expect(implementsViolations[0].message).toContain("classified as \"kernel\"");
  });

  it("Full validation catches duplicate ADR-008 edge with ARCH-REGISTER-001", async () => {
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

    const testContext = await createTestContext(fixtureDir);
    // Use the actual ADR-008 schema which has uniqueItems: true on edges array
    const adr008Schema = {
      type: "object",
      properties: {
        edges: {
          type: "array",
          uniqueItems: true,
          items: {
            type: "object",
            required: ["from", "to", "layer", "categories", "importKind", "lifecycle", "justification", "adrReference"],
            properties: {
              from: { type: "string", pattern: "^@comity/[a-z0-9-]+$" },
              to: { type: "string", pattern: "^@comity/[a-z0-9-]+$" },
              layer: { const: "core-to-core" },
              categories: { type: "array", minItems: 1, uniqueItems: true, items: { type: "string", enum: ["capability", "infrastructure-contract", "value-import", "candidate-for-removal"] } },
              importKind: { type: "string", enum: ["type-only", "value", "mixed"] },
              lifecycle: { type: "string", enum: ["approved", "deprecated", "migration-candidate"] },
              justification: { type: "string", minLength: 1 },
              adrReference: { type: "string", minLength: 1 }
            }
          }
        }
      },
      required: ["edges"]
    };
    // Add duplicate edges to the register
    testContext.register = {
      edges: [
        { from: "@comity/foo", to: "@comity/pricing", layer: "core-to-core", categories: ["capability"], importKind: "type-only", lifecycle: "approved", justification: "test", adrReference: "test" },
        { from: "@comity/foo", to: "@comity/pricing", layer: "core-to-core", categories: ["capability"], importKind: "type-only", lifecycle: "approved", justification: "test", adrReference: "test" }
      ]
    };
    testContext.schema = adr008Schema;
    testContext.registerEdges = parseRegisterEdges(testContext.register);
    testContext.registerSchemaErrors = validateRegisterSchema(testContext.register, testContext.schema);

    const { violations } = await runValidation(testContext);

    const registerViolations = violations.filter((v) => v.code === "ARCH-REGISTER-001");
    expect(registerViolations.length).toBeGreaterThan(0);
    expect(registerViolations[0].message).toContain("not unique");
  });
});