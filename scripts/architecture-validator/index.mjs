import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { createContext } from "./context.mjs";
import { formatReport } from "./report.mjs";
import { buildGraph, classifyFromRepository, discoverPackages } from "./graph.mjs";
import {
  parseRejectedEdges,
  validateRegisterSchema,
  parseRegisterEdges,
  validate as validateRegister,
} from "./rules/register.mjs";
import { validate as validateCore } from "./rules/core.mjs";
import { validate as validateKernel } from "./rules/kernel.mjs";
import {
  validate as validateAdapters,
  analyzeAdapterCoreReferences,
  isCompositionInfrastructureName,
  parseImportClause,
  extractImportReferences,
} from "./rules/adapters.mjs";
import {
  validate as validateMetadata,
  collectExportTargets,
  exportTargetExists,
  enginesNodeSatisfies,
} from "./rules/metadata.mjs";
import { validate as validateReadme } from "./rules/readme.mjs";

async function buildAdapterAnalysis(context) {
  const { packages, classification, graph } = context;
  const analysis = new Map();
  for (const pkg of packages) {
    if (classification.get(pkg.name) !== "technology-adapter") continue;
    const coreModules = pkg.deps.filter((dep) => graph.coreLike.has(dep));
    if (coreModules.length === 0) continue;
    const adapterAnalysis = await analyzeAdapterCoreReferences(pkg.path, coreModules);
    analysis.set(pkg.name, adapterAnalysis);
  }
  return analysis;
}

export async function runValidation() {
  const context = await createContext();
  context.adapterAnalysis = await buildAdapterAnalysis(context);

  const violations = [
    ...validateRegister(context),
    ...validateCore(context),
    ...validateKernel(context),
    ...validateAdapters(context),
    ...(await validateMetadata(context)),
    ...(await validateReadme(context)),
  ];

  return { violations };
}

async function main() {
  const { violations } = await runValidation();
  console.log(formatReport(violations));
  process.exitCode = violations.length > 0 ? 1 : 0;
}

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] && resolve(process.argv[1]) === __filename) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export {
  classifyFromRepository,
  discoverPackages,
  buildGraph,
  parseRejectedEdges,
  validateRegisterSchema,
  parseRegisterEdges,
  validateCore,
  validateRegister,
  validateKernel,
  validateAdapters,
  validateMetadata,
  validateReadme,
  analyzeAdapterCoreReferences,
  isCompositionInfrastructureName,
  parseImportClause,
  extractImportReferences,
  collectExportTargets,
  exportTargetExists,
  enginesNodeSatisfies,
  formatReport,
};
