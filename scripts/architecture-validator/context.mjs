import {
  REPO_ROOT,
  PACKAGES_DIR,
  REGISTER_PATH,
  SCHEMA_PATH,
  ADR008_PATH,
  REPOSITORY_PATH,
} from "./utils/paths.mjs";
import { readJson, readText } from "./utils/filesystem.mjs";
import { classifyFromRepository, discoverPackages } from "./graph.mjs";
import { buildGraph } from "./graph.mjs";
import { parseRejectedEdges, validateRegisterSchema, parseRegisterEdges } from "./rules/register.mjs";

export const KERNEL_PACKAGES = {
  "@comity/primitives": {
    code: "ARCH-KERNEL-001",
    message: "Primitive package has internal dependency",
    allowed: [],
  },
  "@comity/kernel": {
    code: "ARCH-KERNEL-002",
    message: "Kernel depends on forbidden package",
    allowed: ["@comity/primitives"],
  },
  "@comity/composition": {
    code: "ARCH-KERNEL-003",
    message: "Composition depends on forbidden package",
    allowed: ["@comity/kernel", "@comity/primitives"],
  },
};

export const KERNEL_SOURCE =
  "layering-policy.md §2.1 / dependency-graph-policy.md (docs/standards/)";

export const COMPOSITION_INFRASTRUCTURE_NAME =
  /^(?:Default|create|make|build)[A-Z]|(?:Facade|Factory|Writer|Builder|Composer|Resolver)$/;

export const IMPORT_STATEMENT_RE = /import\s+(type\s+)?([^'"]*?)\s*from\s+['"]([^'"]+)['"]/g;
export const IMPLEMENTS_RE = /implements\s+([^\{]+)/g;

export const PACKAGE_NAME_PATTERN = /^@comity\/[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const MIN_NODE_MAJOR = 24;
export const MIN_NODE_MINOR = 0;
export const MIN_NODE_PATCH = 0;
export const FORBIDDEN_SUBPATHS = ["utils", "helpers", "shared", "internal", "lazy"];

export const META_SOURCE = "architecture-validation.md §8 / public-api.md §3 (docs/standards/)";

export const REQUIRED_SECTIONS = [
  "Purpose",
  "Scope",
  "Public API",
  "Documentation",
  "Related Packages",
  "Status",
];

export async function createContext() {
  const [repositoryMarkdown, register, schema, adr008Markdown] = await Promise.all([
    readText(REPOSITORY_PATH),
    readJson(REGISTER_PATH),
    readJson(SCHEMA_PATH),
    readText(ADR008_PATH),
  ]);

  const classification = classifyFromRepository(repositoryMarkdown);
  const packages = await discoverPackages(PACKAGES_DIR);
  const graph = buildGraph(packages, classification);
  const rejectedEdges = parseRejectedEdges(adr008Markdown);

  return {
    repoRoot: REPO_ROOT,
    packagesDir: PACKAGES_DIR,
    packages,
    classification,
    graph,
    register,
    schema,
    rejectedEdges,
    registerEdges: parseRegisterEdges(register),
    registerSchemaErrors: validateRegisterSchema(register, schema),
  };
}

export {
  REPO_ROOT,
  PACKAGES_DIR,
  REGISTER_PATH,
  SCHEMA_PATH,
  ADR008_PATH,
  REPOSITORY_PATH,
};
