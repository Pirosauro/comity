import { existsSync } from "node:fs";
import { resolve } from "node:path";
import {
  CANONICAL_BUGS,
  CANONICAL_HOMEPAGE,
  CANONICAL_REPOSITORY,
  FORBIDDEN_SUBPATHS,
  META_SOURCE,
  MIN_NODE_MAJOR,
  MIN_NODE_MINOR,
  MIN_NODE_PATCH,
  PACKAGE_NAME_PATTERN,
} from "../context.mjs";

export function collectExportTargets(value) {
  const targets = [];
  if (typeof value === "string") {
    targets.push(value);
    return targets;
  }
  if (value && typeof value === "object") {
    for (const child of Object.values(value)) {
      targets.push(...collectExportTargets(child));
    }
  }
  return targets;
}

export function exportTargetExists(packagePath, target) {
  if (target === "./package.json") return true;
  const resolved = resolve(packagePath, target);
  return existsSync(resolved);
}

export function enginesNodeSatisfies(range) {
  if (range === undefined || range === null || range === "") {
    return { ok: false, reason: "missing" };
  }
  const text = String(range).trim();
  const rangeMatch = text.match(/>=\s*(\d+)\.(\d+)\.(\d+)/);
  if (rangeMatch) {
    const [, a, b, c] = rangeMatch;
    const ok =
      Number(a) > MIN_NODE_MAJOR ||
      (Number(a) === MIN_NODE_MAJOR &&
        (Number(b) > MIN_NODE_MINOR ||
          (Number(b) === MIN_NODE_MINOR && Number(c) >= MIN_NODE_PATCH)));
    return ok
      ? { ok: true }
      : { ok: false, reason: `${text} (< ${MIN_NODE_MAJOR}.${MIN_NODE_MINOR}.${MIN_NODE_PATCH})` };
  }
  const exactMatch = text.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (exactMatch) {
    const [, a, b, c] = exactMatch;
    const ok =
      Number(a) > MIN_NODE_MAJOR ||
      (Number(a) === MIN_NODE_MAJOR &&
        (Number(b) > MIN_NODE_MINOR ||
          (Number(b) === MIN_NODE_MINOR && Number(c) >= MIN_NODE_PATCH)));
    return ok
      ? { ok: true }
      : { ok: false, reason: `${text} (< ${MIN_NODE_MAJOR}.${MIN_NODE_MINOR}.${MIN_NODE_PATCH})` };
  }
  return { ok: false, reason: `unrecognized format: ${text}` };
}

export function validate(context) {
  const { packages } = context;
  const violations = [];

  for (const pkg of packages) {
    const { name, path: packagePath, manifest } = pkg;

    if (typeof manifest.name !== "string" || !PACKAGE_NAME_PATTERN.test(manifest.name)) {
      violations.push({
        code: "ARCH-META-001",
        message: `Package name does not follow the @comity/<name> convention: ${JSON.stringify(manifest.name)}`,
        edge: { from: name, to: "name" },
        source: META_SOURCE,
        remediation: 'Set package.json "name" to "@comity/<kebab-case-name>".',
      });
    }

    if (manifest.type !== "module") {
      violations.push({
        code: "ARCH-META-002",
        message: `package.json "type" must be "module" (got ${JSON.stringify(manifest.type)})`,
        edge: { from: name, to: "type" },
        source: META_SOURCE,
        remediation: 'Set package.json "type" to "module".',
      });
    }

    const nodeRange = enginesNodeSatisfies(manifest.engines?.node);
    if (!nodeRange.ok) {
      violations.push({
        code: "ARCH-META-003",
        message: `package.json "engines.node" is ${nodeRange.reason}`,
        edge: { from: name, to: "engines.node" },
        source: META_SOURCE,
        remediation: `Set package.json "engines.node" to ">=${MIN_NODE_MAJOR}.${MIN_NODE_MINOR}.${MIN_NODE_PATCH}.0".`,
      });
    }

    if (manifest.license === undefined || manifest.license === null || manifest.license === "") {
      violations.push({
        code: "ARCH-META-004",
        message: `package.json "license" is missing`,
        edge: { from: name, to: "license" },
        source: META_SOURCE,
        remediation: 'Set package.json "license" to a valid SPDX expression.',
      });
    }

    // ARCH-META-008: private must be explicitly false for publishable packages
    if (manifest.private !== false) {
      violations.push({
        code: "ARCH-META-008",
        message: `package.json "private" must be explicitly "false" for publishable packages (got ${JSON.stringify(manifest.private)})`,
        edge: { from: name, to: "private" },
        source: META_SOURCE,
        remediation: 'Set package.json "private" to false.',
      });
    }

    // ARCH-META-009: description must exist
    if (
      !manifest.description ||
      typeof manifest.description !== "string" ||
      manifest.description.trim() === ""
    ) {
      violations.push({
        code: "ARCH-META-009",
        message: `package.json "description" is missing or empty`,
        edge: { from: name, to: "description" },
        source: META_SOURCE,
        remediation: 'Set package.json "description" to a concise package description.',
      });
    }

    // ARCH-META-010: homepage must point to canonical Comity repository
    if (manifest.homepage !== CANONICAL_HOMEPAGE) {
      violations.push({
        code: "ARCH-META-010",
        message: `package.json "homepage" must be "${CANONICAL_HOMEPAGE}" (got ${JSON.stringify(manifest.homepage)})`,
        edge: { from: name, to: "homepage" },
        source: META_SOURCE,
        remediation: `Set package.json "homepage" to "${CANONICAL_HOMEPAGE}".`,
      });
    }

    // ARCH-META-011: repository must point to canonical Comity repository
    if (!manifest.repository || manifest.repository.url !== CANONICAL_REPOSITORY) {
      violations.push({
        code: "ARCH-META-011",
        message: `package.json "repository.url" must be "${CANONICAL_REPOSITORY}" (got ${JSON.stringify(manifest.repository?.url)})`,
        edge: { from: name, to: "repository.url" },
        source: META_SOURCE,
        remediation: `Set package.json "repository.url" to "${CANONICAL_REPOSITORY}".`,
      });
    }

    // ARCH-META-012: bugs must point to canonical Comity issues URL
    if (!manifest.bugs || manifest.bugs.url !== CANONICAL_BUGS) {
      violations.push({
        code: "ARCH-META-012",
        message: `package.json "bugs.url" must be "${CANONICAL_BUGS}" (got ${JSON.stringify(manifest.bugs?.url)})`,
        edge: { from: name, to: "bugs.url" },
        source: META_SOURCE,
        remediation: `Set package.json "bugs.url" to "${CANONICAL_BUGS}".`,
      });
    }

    if (manifest.exports && typeof manifest.exports === "object") {
      for (const [subpath, value] of Object.entries(manifest.exports)) {
        const targets = collectExportTargets(value);
        for (const target of targets) {
          if (!exportTargetExists(packagePath, target)) {
            violations.push({
              code: "ARCH-META-005",
              message: `Exports target ${subpath} -> ${target} does not resolve to an existing file`,
              edge: { from: name, to: target },
              source: META_SOURCE,
              remediation:
                "Align the exports target with the build output, or restore the missing file.",
            });
          }
        }
      }
    }

    if (manifest.typesVersions && typeof manifest.typesVersions === "object") {
      const tv = manifest.typesVersions["*"];
      if (tv && typeof tv === "object") {
        const exportKeys = new Set(Object.keys(manifest.exports ?? {}));
        for (const key of Object.keys(tv)) {
          const expected = `./${key}`;
          if (!exportKeys.has(expected)) {
            violations.push({
              code: "ARCH-META-006",
              message: `typesVersions["*"]["${key}"] has no matching exports entry "${expected}"`,
              edge: { from: name, to: expected },
              source: META_SOURCE,
              remediation: `Add an exports entry for "${expected}" or remove the typesVersions entry.`,
            });
          }
        }
      }
    }

    if (manifest.exports && typeof manifest.exports === "object") {
      for (const subpath of Object.keys(manifest.exports)) {
        if (subpath === "." || subpath === "./package.json") continue;
        const segment = subpath.replace(/^\.\//, "").split("/")[0];
        if (FORBIDDEN_SUBPATHS.includes(segment)) {
          violations.push({
            code: "ARCH-META-007",
            message: `Exports subpath "${subpath}" is forbidden by public-api.md §3.2`,
            edge: { from: name, to: subpath },
            source: META_SOURCE,
            remediation:
              "Remove the forbidden subpath; relocate the contents to a documented public entrypoint.",
          });
        }
      }
    }
  }

  return violations;
}

export const validateMetadata = validate;
