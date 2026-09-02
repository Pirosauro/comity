const IMPLEMENTS_SOURCE = "ADR-026 (docs/standards/decisions/ADR-026-technology-adapter-contracts.md) / ADR-007 (docs/standards/decisions/ADR-007-adapter-categories.md)";

export function validateImplements(context) {
  const { packages, classification, graph } = context;
  const violations = [];
  const { technologyAdapters, coreLike } = graph;

  for (const adapter of technologyAdapters) {
    const pkg = packages.find((p) => p.name === adapter);
    if (!pkg) continue;

    const manifest = pkg.manifest;
    const implementsMeta = manifest?.comity?.implements;

    // Rule 1: Must have comity.implements
    if (implementsMeta === undefined || implementsMeta === null) {
      violations.push({
        code: "ARCH-IMPLEMENTS-001",
        message: `Technology Adapter "${adapter}" is missing required "comity.implements" metadata`,
        edge: { from: adapter, to: "comity.implements" },
        source: IMPLEMENTS_SOURCE,
        remediation: 'Add "comity.implements" to package.json with the Core Module package name (e.g., "@comity/http").',
      });
      continue;
    }

    // Rule 2: Must be a string
    if (typeof implementsMeta !== "string") {
      violations.push({
        code: "ARCH-IMPLEMENTS-002",
        message: `Technology Adapter "${adapter}" has invalid "comity.implements" (expected string, got ${typeof implementsMeta})`,
        edge: { from: adapter, to: "comity.implements" },
        source: IMPLEMENTS_SOURCE,
        remediation: 'Set "comity.implements" to a string containing the Core Module package name.',
      });
      continue;
    }

    const target = implementsMeta.trim();

    // Rule 3: Referenced package must exist
    const targetPkg = packages.find((p) => p.name === target);
    if (!targetPkg) {
      violations.push({
        code: "ARCH-IMPLEMENTS-003",
        message: `Technology Adapter "${adapter}" implements "${target}" which does not exist in the workspace`,
        edge: { from: adapter, to: target },
        source: IMPLEMENTS_SOURCE,
        remediation: `Ensure "comity.implements" references an existing @comity/* package.`,
      });
      continue;
    }

    // Rule 4: Referenced package must be classified as core
    const targetLayer = classification.get(target);
    if (targetLayer !== "core") {
      violations.push({
        code: "ARCH-IMPLEMENTS-004",
        message: `Technology Adapter "${adapter}" implements "${target}" which is classified as "${targetLayer || "unknown"}" (expected "core")`,
        edge: { from: adapter, to: target },
        source: IMPLEMENTS_SOURCE,
        remediation: `"comity.implements" must reference a Core Module. Check the target package's comity.layer.`,
      });
      continue;
    }

    // Rule 5: Adapter must have actual dependency relationship with the implemented Core Module
    const hasDep = pkg.deps.includes(target);
    if (!hasDep) {
      violations.push({
        code: "ARCH-IMPLEMENTS-005",
        message: `Technology Adapter "${adapter}" implements "${target}" but does not depend on it`,
        edge: { from: adapter, to: target },
        source: IMPLEMENTS_SOURCE,
        remediation: `Add "${target}" to dependencies and peerDependencies in package.json.`,
      });
      continue;
    }

    // Rule 6: Metadata is internally consistent - the adapter should only implement one core module
    // This is already validated by ARCH-ADAPTER-001 in adapters.mjs, but we double-check here
    const coreDeps = pkg.deps.filter((dep) => coreLike.has(dep));
    if (coreDeps.length > 1 && !coreDeps.includes(target)) {
      violations.push({
        code: "ARCH-IMPLEMENTS-006",
        message: `Technology Adapter "${adapter}" implements "${target}" but has other Core Module dependencies: ${coreDeps.filter((d) => d !== target).join(", ")}`,
        edge: { from: adapter, to: coreDeps.filter((d) => d !== target).join(", ") },
        source: IMPLEMENTS_SOURCE,
        remediation: `A Technology Adapter must implement exactly one Core Module. Remove extra Core dependencies or reclassify as Integration Adapter (ADR-007).`,
      });
    }
  }

  return violations;
}

export const validate = validateImplements;