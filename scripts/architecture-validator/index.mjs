import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { createContext } from "./context.mjs";
import { buildGraph, classifyFromRepository, discoverPackages } from "./graph.mjs";
import { formatReport } from "./report.mjs";
import { validate as validateAdapterPeers } from "./rules/adapter-peers.mjs";
import {
  analyzeAdapterCoreReferences,
  extractImportReferences,
  isCompositionInfrastructureName,
  parseImportClause,
  validate as validateAdapters,
} from "./rules/adapters.mjs";
import { validate as validateCore } from "./rules/core.mjs";
import { validate as validateErrors } from "./rules/errors.mjs";
import { validate as validateImports } from "./rules/imports.mjs";
import { validate as validateKernel } from "./rules/kernel.mjs";
import {
  collectExportTargets,
  enginesNodeSatisfies,
  exportTargetExists,
  validate as validateMetadata,
} from "./rules/metadata.mjs";
import { validate as validateReadmeExports } from "./rules/readme-exports.mjs";
import { validate as validateReadme } from "./rules/readme.mjs";
import {
  parseRegisterEdges,
  parseRejectedEdges,
  validate as validateRegister,
  validateRegisterSchema,
} from "./rules/register.mjs";

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
    ...(await validateErrors(context)),
    ...(await validateAdapterPeers(context)),
    ...(await validateImports(context)),
    ...(await validateReadmeExports(context)),
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
  analyzeAdapterCoreReferences,
  buildGraph,
  classifyFromRepository,
  collectExportTargets,
  discoverPackages,
  enginesNodeSatisfies,
  exportTargetExists,
  extractImportReferences,
  formatReport,
  isCompositionInfrastructureName,
  parseImportClause,
  parseRegisterEdges,
  parseRejectedEdges,
  validateAdapterPeers,
  validateAdapters,
  validateCore,
  validateErrors,
  validateImports,
  validateKernel,
  validateMetadata,
  validateReadme,
  validateReadmeExports,
  validateRegister,
  validateRegisterSchema,
};
