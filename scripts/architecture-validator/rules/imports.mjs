import { readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { listSourceFiles } from "../utils/filesystem.mjs";

const IMPORT_SOURCE = "architecture-validation.md §4 / public-api.md (docs/standards/)";

const FORBIDDEN_DEEP_IMPORT_PATTERNS = [
  /^@comity\/[^/]+\/src\//,
  /^@comity\/[^/]+\/dist\//,
  /^@comity\/[^/]+\/internal/,
  /^@comity\/[^/]+\/lazy/,
];

function collectExportedSubpaths(manifest) {
  const exported = new Set();
  if (manifest.exports && typeof manifest.exports === "object") {
    for (const subpath of Object.keys(manifest.exports)) {
      exported.add(subpath);
    }
  }
  return exported;
}

function extractImports(source) {
  const imports = [];
  const importRegex = /import\s+(?:type\s+)?(?:(?:\{([^}]+)\})|(\w+))\s+from\s+['"]([^'"]+)['"]/g;

  for (const match of source.matchAll(importRegex)) {
    const specifier = match[3];
    if (!specifier.startsWith("@comity/")) continue;

    let importedNames = [];
    if (match[1]) {
      importedNames = match[1].split(",").map((n) =>
        n
          .trim()
          .split(/\s+as\s+/)[0]
          .replace(/^type\s+/, "")
          .trim()
      );
    } else if (match[2]) {
      importedNames = [match[2]];
    }

    imports.push({ specifier, importedNames });
  }

  return imports;
}

function isValidImport(specifier, exportedSubpaths) {
  if (specifier === "@comity/") return false;

  if (!specifier.includes("/")) {
    return exportedSubpaths.has(".");
  }

  const parts = specifier.split("/");
  if (parts.length < 3 || !parts[0].startsWith("@")) return false;

  const pkg = parts[0] + "/" + parts[1];
  const rest = parts.slice(2);
  const subpath = "./" + rest.join("/");

  if (exportedSubpaths.has(subpath)) return true;

  if (subpath === "./package.json") return true;

  return false;
}

function isForbiddenDeepImport(specifier) {
  for (const pattern of FORBIDDEN_DEEP_IMPORT_PATTERNS) {
    if (pattern.test(specifier)) return true;
  }
  return false;
}

export async function validate(context) {
  const { packages } = context;
  const violations = [];

  const exportedSubpaths = new Map();
  for (const pkg of packages) {
    exportedSubpaths.set(pkg.name, collectExportedSubpaths(pkg.manifest));
  }

  for (const pkg of packages) {
    const { name, path: packagePath } = pkg;
    const srcDir = join(packagePath, "src");
    const files = await listSourceFiles(srcDir);

    for (const file of files) {
      const source = await readFile(file, "utf8").catch(() => "");
      const imports = extractImports(source);

      for (const imp of imports) {
        const { specifier, importedNames } = imp;

        if (isForbiddenDeepImport(specifier)) {
          violations.push({
            code: "ARCH-IMPORT-001",
            message: `Forbidden deep import pattern: ${specifier}`,
            package: name,
            file: relative(packagePath, file),
            source: IMPORT_SOURCE,
            remediation:
              "Import only from declared public subpaths (exports). Do not import from src/, dist/, internal/, or lazy/.",
          });
          continue;
        }

        const parts = specifier.split("/");
        if (parts.length < 3 || !parts[0].startsWith("@")) continue;
        const targetPkg = parts[0] + "/" + parts[1];

        const targetExports = exportedSubpaths.get(targetPkg);
        if (!targetExports) continue;

        if (!isValidImport(specifier, targetExports)) {
          violations.push({
            code: "ARCH-IMPORT-002",
            message: `Import "${specifier}" references a non-exported path. Exported subpaths: ${[...targetExports].filter((s) => s !== "./package.json").join(", ") || "(only root)"}`,
            package: name,
            file: relative(packagePath, file),
            source: IMPORT_SOURCE,
            remediation: `Use only exported subpaths from ${targetPkg}. Available: ${[...targetExports].filter((s) => s !== "./package.json").join(", ") || "(root only)"}`,
          });
        }
      }
    }
  }

  return violations;
}

export const validateImports = validate;
