import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { listSourceFiles } from "../utils/filesystem.mjs";
import {
  COMPOSITION_INFRASTRUCTURE_NAME,
  IMPORT_STATEMENT_RE,
  IMPLEMENTS_RE,
} from "../context.mjs";

const ADAPTER_SOURCE =
  "architecture-validation.md §7 / adapters.md §11 / layering-policy.md §2.3 / ADR-007 (docs/standards/)";

export function isCompositionInfrastructureName(name) {
  return COMPOSITION_INFRASTRUCTURE_NAME.test(name);
}

export function parseImportClause(clause, statementTypeOnly) {
  const names = [];
  const brace = clause.match(/\{([^}]*)\}/);

  if (brace) {
    for (const raw of brace[1].split(",")) {
      const item = raw.trim();
      if (!item) continue;
      const isType = statementTypeOnly || item.startsWith("type ");
      const name = item.replace(/^type\s+/, "").split(/\s+as\s/)[0].trim();
      if (name && name !== "*") names.push({ name, isType });
    }
  }

  const defaultPart = brace ? clause.slice(0, brace.index).trim() : clause.trim();
  if (defaultPart) {
    if (defaultPart.startsWith("*")) {
      const name = defaultPart.split(/\s+as\s/).at(-1).trim();
      if (name) names.push({ name, isType: statementTypeOnly });
    } else if (!defaultPart.includes("{")) {
      const name = defaultPart.split(/\s+as\s/)[0].trim();
      if (name) names.push({ name, isType: statementTypeOnly });
    }
  }

  return names;
}

export function extractImportReferences(source) {
  const imports = new Map();
  const implementsNames = new Set();

  for (const match of source.matchAll(IMPORT_STATEMENT_RE)) {
    const statementTypeOnly = match[1] !== undefined;
    const specifier = match[3];
    const base = specifier.match(/^@comity\/[a-z0-9-]+/)?.[0];
    if (!base) continue;

    for (const { name, isType } of parseImportClause(match[2], statementTypeOnly)) {
      if (!imports.has(base)) {
        imports.set(base, { typeNames: new Set(), valueNames: new Set() });
      }
      const entry = imports.get(base);
      (isType ? entry.typeNames : entry.valueNames).add(name);
    }
  }

  for (const match of source.matchAll(IMPLEMENTS_RE)) {
    for (const raw of match[1].split(",")) {
      const name = raw.replace(/<[\s\S]*/, "").trim().split(/\s+/)[0];
      if (name) implementsNames.add(name);
    }
  }

  return { imports, implementsNames };
}

export async function analyzeAdapterCoreReferences(packagePath, coreModules) {
  const result = new Map(
    coreModules.map(
      (module) =>
        [module, { typeNames: new Set(), valueNames: new Set(), implementedContracts: new Set() }]
    )
  );

  const srcDir = join(packagePath, "src");
  const files = await listSourceFiles(srcDir);

  const nameToModules = new Map();
  const implementsNames = new Set();
  for (const file of files) {
    const source = await readFile(file, "utf8").catch(() => "");
    const { imports, implementsNames: fileImplements } = extractImportReferences(source);

    for (const [module, entry] of imports) {
      if (!result.has(module)) continue;
      for (const name of entry.typeNames) result.get(module).typeNames.add(name);
      for (const name of entry.valueNames) result.get(module).valueNames.add(name);
      for (const name of [...entry.typeNames, ...entry.valueNames]) {
        if (!nameToModules.has(name)) nameToModules.set(name, new Set());
        nameToModules.get(name).add(module);
      }
    }

    for (const name of fileImplements) implementsNames.add(name);
  }

  for (const name of implementsNames) {
    const modules = nameToModules.get(name);
    if (!modules) continue;
    for (const module of modules) {
      if (result.has(module)) result.get(module).implementedContracts.add(name);
    }
  }

  return result;
}

export function validate(context) {
  const { graph, adapterAnalysis } = context;
  const violations = [];
  const { edges, coreLike, technologyAdapters, integrationAdapters } = graph;
  const adapters = graph.adapters;

  for (const adapter of technologyAdapters) {
    const coreDeps = edges
      .filter((edge) => edge.from === adapter && coreLike.has(edge.to))
      .map((edge) => edge.to);

    const analysis = adapterAnalysis?.get(adapter);
    if (!analysis) {
      if (coreDeps.length > 1) {
        violations.push({
          code: "ARCH-ADAPTER-001",
          message: `Technology Adapter depends on multiple Core Modules (expected exactly one): ${coreDeps.join(", ")}`,
          edge: { from: adapter, to: coreDeps.join(", ") },
          source: ADAPTER_SOURCE,
          remediation:
            "Split the adapter per Core Module or reclassify as an Integration Adapter (ADR-007).",
        });
      }
      continue;
    }

    const contracts = [];
    const realRuntime = [];
    for (const dep of coreDeps) {
      const ref = analysis.get(dep);
      if (!ref || ref.implementedContracts.size > 0) {
        contracts.push(dep);
      } else if (ref.valueNames.size === 0) {
        // type-only reference — allowed
      } else if ([...ref.valueNames].every((name) => isCompositionInfrastructureName(name))) {
        // composition/facade infrastructure — allowed
      } else {
        realRuntime.push(dep);
      }
    }

    if (contracts.length === 0 && realRuntime.length === 1) {
      contracts.push(realRuntime.pop());
    }

    if (contracts.length > 1) {
      violations.push({
        code: "ARCH-ADAPTER-001",
        message: `Technology Adapter implements multiple Core Module contracts (expected exactly one): ${contracts.join(", ")}`,
        edge: { from: adapter, to: contracts.join(", ") },
        source: ADAPTER_SOURCE,
        remediation:
          "A Technology Adapter must implement exactly one Core Module contract; split or reclassify as an Integration Adapter (ADR-007).",
      });
    }

    for (const dep of realRuntime) {
      violations.push({
        code: "ARCH-ADAPTER-001",
        message: `Technology Adapter has a real runtime dependency on Core Module ${dep} that is neither a type-only reference nor composition infrastructure`,
        edge: { from: adapter, to: dep },
        source: ADAPTER_SOURCE,
        remediation:
          "Additional Core dependencies must be type-only references or composition infrastructure (layering-policy.md §2.3).",
      });
    }
  }

  for (const edge of edges) {
    if (!adapters.has(edge.from) || !adapters.has(edge.to)) continue;
    if (integrationAdapters.has(edge.from) && technologyAdapters.has(edge.to)) continue;
    violations.push({
      code: "ARCH-ADAPTER-002",
      message: "Adapter depends on another Adapter",
      edge,
      source: ADAPTER_SOURCE,
      remediation:
        "Remove the cross-adapter dependency. Only an Integration Adapter may depend on a Technology Adapter.",
    });
  }

  for (const edge of edges) {
    if (!coreLike.has(edge.from) || !adapters.has(edge.to)) continue;
    violations.push({
      code: "ARCH-ADAPTER-004",
      message: "Core Module depends on an Adapter",
      edge,
      source: ADAPTER_SOURCE,
      remediation: "Remove the dependency; contracts must never depend on adapters.",
    });
  }

  return violations;
}

export const validateAdapters = validate;
