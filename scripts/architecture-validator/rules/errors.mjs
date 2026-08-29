import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { listSourceFiles } from "../utils/filesystem.mjs";

const ERROR_SOURCE = "errors.md / public-api.md §3.1 (docs/standards/)";

// Map of package to its public error class name (per errors.md §6: one error class per module)
const PACKAGE_ERROR_CLASSES = new Map([
  ["@comity/auth", "AuthError"],
  ["@comity/auth-tokens", "AuthTokenError"],
  ["@comity/cache", "CacheError"],
  ["@comity/catalog", "CatalogError"],
  ["@comity/graphql-client", "GraphqlClientError"],
  ["@comity/html", "HtmlError"],
  ["@comity/http", "HttpError"],
  ["@comity/hydration", "HydrationError"],
  ["@comity/inventory", "InventoryError"],
  ["@comity/order", "OrderError"],
  ["@comity/primitives", "BaseError"],
  ["@comity/router", "RouterError"],
  ["@comity/search", "SearchError"],
  ["@comity/sql", "SqlError"],
  ["@comity/storage", "StorageError"],
  ["@comity/validation", "ValidationError"],
  ["@comity/address", "AddressError"],
  ["@comity/geography", "GeographyError"],
  ["@comity/identity", "IdentityError"],
  ["@comity/pricing", "PricingError"],
  ["@comity/taxonomy", "TaxonomyError"],
  ["@comity/content", "ContentError"],
  ["@comity/media", "MediaError"],
  ["@comity/seo", "SeoError"],
  ["@comity/i18n", "I18nError"],
  ["@comity/graphql-builder", "GraphqlBuilderError"],
  ["@comity/storefront", "StorefrontError"],
]);

const PACKAGES_WITH_PUBLIC_ERRORS = new Set(PACKAGE_ERROR_CLASSES.keys());

function hasErrorSourceBarrel(packagePath) {
  const errorsDir = join(packagePath, "src", "errors");
  return existsSync(errorsDir);
}

import { existsSync } from "node:fs";

function hasErrorExport(manifest) {
  return manifest.exports && manifest.exports["./errors"] !== undefined;
}

function findErrorImportsInSource(source, packageName) {
  const imports = [];
  const importRegex = /import\s+(?:type\s+)?\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g;
  const defaultImportRegex = /import\s+(?:type\s+)?(\w+)\s+from\s+['"]([^'"]+)['"]/g;

  for (const match of source.matchAll(importRegex)) {
    const importedNames = match[1].split(",").map((n) =>
      n
        .trim()
        .split(/\s+as\s+/)[0]
        .replace(/^type\s+/, "")
        .trim()
    );
    const specifier = match[2];
    if (specifier.startsWith("@comity/")) {
      for (const importedName of importedNames) {
        if (isPublicErrorType(importedName)) {
          imports.push({ specifier, importedName, isType: match[0].startsWith("import type") });
        }
      }
    }
  }

  for (const match of source.matchAll(defaultImportRegex)) {
    const importedName = match[1];
    const specifier = match[2];
    if (specifier.startsWith("@comity/")) {
      if (isPublicErrorType(importedName)) {
        imports.push({ specifier, importedName, isType: match[0].startsWith("import type") });
      }
    }
  }

  return imports;
}

function isPublicErrorType(name) {
  // Check if this is a module's public error class or its associated Reason/Meta types
  for (const [pkg, errorClass] of PACKAGE_ERROR_CLASSES) {
    if (name === errorClass) return true;
    if (name === `${errorClass}Reason`) return true;
    if (name === `${errorClass}Meta`) return true;
    // Also handle BaseError special case
    if (errorClass === "BaseError" && (name === "BaseError" || name === "ErrorMeta")) return true;
  }
  return false;
}

function isErrorSubpathExport(specifier) {
  return specifier.includes("/errors");
}

export async function validate(context) {
  const { packages, graph, classification } = context;
  const violations = [];

  const packagePaths = new Map(packages.map((p) => [p.name, p.path]));
  const packageManifests = new Map(packages.map((p) => [p.name, p.manifest]));

  for (const pkg of packages) {
    const { name, path: packagePath, manifest } = pkg;
    const category = classification.get(name);

    if (PACKAGES_WITH_PUBLIC_ERRORS.has(name)) {
      if (!hasErrorSourceBarrel(packagePath)) {
        continue;
      }

      if (!hasErrorExport(manifest)) {
        violations.push({
          code: "ARCH-ERRORS-001",
          message: `Package defines domain errors but does not export "./errors" subpath`,
          package: name,
          source: ERROR_SOURCE,
          remediation:
            'Add "./errors" to package.json exports with proper import/require conditions.',
        });
      }
    }
  }

  for (const pkg of packages) {
    const { name, path: packagePath, manifest } = pkg;
    const category = classification.get(name);

    if (category === "core" || category === "draft") {
      if (hasErrorExport(manifest)) {
        const srcIndex = join(packagePath, "src", "index.ts");
        const source = await readFile(srcIndex, "utf8").catch(() => "");
        if (source.includes('from "./errors"') || source.includes("from './errors'")) {
          violations.push({
            code: "ARCH-ERRORS-002",
            message: `Core Module root barrel re-exports errors from "./errors" — errors should only be available via the ./errors subpath`,
            package: name,
            source: ERROR_SOURCE,
            remediation:
              "Remove re-export of errors from src/index.ts; consumers must import from @comity/<pkg>/errors.",
          });
        }
      }
    }
  }

  for (const pkg of packages) {
    const { name, path: packagePath } = pkg;
    const srcDir = join(packagePath, "src");
    const files = await listSourceFiles(srcDir);

    for (const file of files) {
      const source = await readFile(file, "utf8").catch(() => "");
      const errorImports = findErrorImportsInSource(source, name);

      for (const imp of errorImports) {
        const targetPkg = imp.specifier.match(/^(@comity\/[a-z0-9-]+)/)?.[1];
        if (!targetPkg) continue;

        if (PACKAGES_WITH_PUBLIC_ERRORS.has(targetPkg)) {
          if (!isErrorSubpathExport(imp.specifier)) {
            violations.push({
              code: "ARCH-ERRORS-003",
              message: `Import of error type "${imp.importedName}" from "${targetPkg}" must use the ./errors subpath (got ${imp.specifier})`,
              package: name,
              file: file.replace(packagePath + "/", ""),
              source: ERROR_SOURCE,
              remediation: `Change import to use "${targetPkg}/errors" instead of "${targetPkg}".`,
            });
          }
        }
      }
    }
  }

  return violations;
}

export const validateErrors = validate;
