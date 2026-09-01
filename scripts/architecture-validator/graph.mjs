import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { PACKAGE_NAME_REGEX } from "./utils/paths.mjs";
import { readJson } from "./utils/filesystem.mjs";

const VALID_LAYERS = new Set([
  "primitives",
  "kernel",
  "composition",
  "core",
  "technology-adapter",
  "integration-adapter",
]);

export function classifyFromRepository(markdown) {
  const result = new Map();
  let currentSection = null;

  for (const line of markdown.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (trimmed.startsWith("###")) {
      if (trimmed.includes("Kernel / Primitives")) currentSection = "kernel-primitives";
      else if (trimmed.includes("Core Modules")) currentSection = "core";
      else if (trimmed.includes("Adapters")) currentSection = "technology-adapter";
      else if (trimmed.includes("Draft Packages")) currentSection = "draft";
      else currentSection = null;
      continue;
    }

    if (currentSection === null || !trimmed.startsWith("|")) continue;
    const names = trimmed.match(PACKAGE_NAME_REGEX);
    if (!names) continue;

    let category = currentSection;
    if (currentSection === "technology-adapter" && trimmed.includes("Integration Adapter")) {
      category = "integration-adapter";
    }
    result.set(names[0], category);
  }

  return result;
}

export function classifyFromPackageJson(packages) {
  const result = new Map();
  const missing = [];

  for (const pkg of packages) {
    const meta = pkg.manifest?.comity;
    if (!meta || !meta.layer) {
      missing.push(pkg.name);
      continue;
    }
    if (!VALID_LAYERS.has(meta.layer)) {
      throw new Error(`Invalid layer "${meta.layer}" for package ${pkg.name}. Valid layers: ${Array.from(VALID_LAYERS).join(", ")}`);
    }
    result.set(pkg.name, meta.layer);
  }

  if (missing.length > 0) {
    throw new Error(`The following @comity/* packages are missing layer classification in package.json: ${missing.join(", ")}`);
  }

  return result;
}

export async function discoverPackages(packagesDir) {
  const packages = [];

  let entries;
  try {
    entries = await readdir(packagesDir, { withFileTypes: true });
  } catch {
    return packages;
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const manifest = await readJson(join(packagesDir, entry.name, "package.json"));
    if (!manifest?.name || !manifest.name.startsWith("@comity/")) continue;

    packages.push({
      name: manifest.name,
      path: join(packagesDir, entry.name),
      deps: Object.keys(manifest.dependencies ?? {})
        .filter((dep) => dep.startsWith("@comity/"))
        .sort(),
      manifest,
    });
  }

  return packages.sort((a, b) => a.name.localeCompare(b.name));
}

export function buildGraph(packages, classification) {
  const byName = new Map(packages.map((pkg) => [pkg.name, pkg]));
  const coreLike = new Set(
    packages
      .filter((pkg) => {
        const category = classification.get(pkg.name);
        return category === "core";
      })
      .map((pkg) => pkg.name)
  );
  const technologyAdapters = new Set(
    packages
      .filter((pkg) => classification.get(pkg.name) === "technology-adapter")
      .map((pkg) => pkg.name)
  );
  const integrationAdapters = new Set(
    packages
      .filter((pkg) => classification.get(pkg.name) === "integration-adapter")
      .map((pkg) => pkg.name)
  );
  const adapters = new Set([...technologyAdapters, ...integrationAdapters]);

  const edges = [];
  const seen = new Set();

  for (const pkg of packages) {
    for (const dep of pkg.deps) {
      if (!byName.has(dep)) continue;
      const key = `${pkg.name} -> ${dep}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push({ from: pkg.name, to: dep });
    }
  }

  edges.sort((a, b) => `${a.from}${a.to}`.localeCompare(`${b.from}${b.to}`));

  const coreToCore = edges.filter(
    (edge) => coreLike.has(edge.from) && coreLike.has(edge.to)
  );

  return {
    edges,
    coreToCore,
    coreLike,
    adapters,
    technologyAdapters,
    integrationAdapters,
  };
}
