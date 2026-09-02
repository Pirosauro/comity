#!/usr/bin/env node

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const ROOT = dirname(__filename);

export {
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
  runValidation,
} from "./architecture-validator/index.mjs";

async function main() {
  const { runValidation, formatReport } = await import(
    "./architecture-validator/index.mjs"
  );
  const { violations } = await runValidation();
  console.log(formatReport(violations));
  process.exitCode = violations.length > 0 ? 1 : 0;
}

if (process.argv[1] && resolve(process.argv[1]) === __filename) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}