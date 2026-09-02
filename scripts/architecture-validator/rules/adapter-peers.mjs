const ADAPTER_PEER_SOURCE = "adapters.md §13 / architecture-validation.md §7.4 (docs/standards/)";

const TECHNOLOGY_DEPENDENCIES = new Set([
  "hono",
  "kysely",
  "jose",
  "zod",
  "react",
  "react-dom",
  "preact",
  "path-to-regexp",
  "ioredis",
  "redis",
  "graphql",
  "graphql-ws",
  "typesafe-i18n",
  "commander",
]);

const KERNEL_PACKAGES = new Set(["@comity/primitives", "@comity/kernel", "@comity/composition"]);

function getAdapterCoreModule(pkg) {
  const implementsMeta = pkg.manifest?.comity?.implements;
  if (typeof implementsMeta === "string" && implementsMeta.trim()) {
    return implementsMeta.trim();
  }

  // Fallback for legacy packages that might not have implements metadata
  const coreDeps = Object.keys(pkg.manifest?.dependencies ?? {})
    .filter((dep) => dep.startsWith("@comity/"))
    .filter((dep) => !dep.includes("-"));

  return coreDeps.length > 0 ? coreDeps[0] : null;
}

export function validate(context) {
  const { packages, classification } = context;
  const violations = [];

  for (const pkg of packages) {
    const { name, manifest } = pkg;
    const category = classification.get(name);

    if (category !== "technology-adapter") continue;

    const coreModule = getAdapterCoreModule(pkg);
    if (!coreModule) {
      violations.push({
        code: "ARCH-ADAPTER-PEER-005",
        message: `Technology Adapter "${name}" cannot determine implemented Core Module (missing or invalid comity.implements)`,
        package: name,
        source: ADAPTER_PEER_SOURCE,
        remediation: `Ensure package.json has "comity.implements" set to the Core Module package name.`,
      });
      continue;
    }

    const peerDeps = manifest.peerDependencies ?? {};
    const deps = manifest.dependencies ?? {};

    if (!peerDeps[coreModule]) {
      violations.push({
        code: "ARCH-ADAPTER-PEER-001",
        message: `Technology Adapter "${name}" implements "${coreModule}" but does not declare it as a peerDependency`,
        package: name,
        source: ADAPTER_PEER_SOURCE,
        remediation: `Add "${coreModule}" to peerDependencies with a compatible version range (workspace:* within monorepo).`,
      });
    }

    if (!deps[coreModule] && !peerDeps[coreModule]) {
      violations.push({
        code: "ARCH-ADAPTER-PEER-002",
        message: `Technology Adapter "${name}" implements "${coreModule}" but does not depend on it at all`,
        package: name,
        source: ADAPTER_PEER_SOURCE,
        remediation: `Add "${coreModule}" to dependencies and peerDependencies.`,
      });
    }

    const techDeps = Object.keys(deps).filter((dep) => TECHNOLOGY_DEPENDENCIES.has(dep));
    for (const techDep of techDeps) {
      if (!peerDeps[techDep]) {
        violations.push({
          code: "ARCH-ADAPTER-PEER-003",
          message: `Technology Adapter "${name}" uses technology "${techDep}" but does not declare it as a peerDependency`,
          package: name,
          source: ADAPTER_PEER_SOURCE,
          remediation: `Add "${techDep}" to peerDependencies with a compatible version range.`,
        });
      }
    }

    for (const [peerDep, range] of Object.entries(peerDeps)) {
      if (peerDep.startsWith("@comity/")) {
        const allowedPeerCoreModules = [coreModule, ...KERNEL_PACKAGES];
        if (!allowedPeerCoreModules.includes(peerDep)) {
          violations.push({
            code: "ARCH-ADAPTER-PEER-004",
            message: `Technology Adapter "${name}" declares peerDependency on "${peerDep}" which is not the implemented Core Module or a Kernel package`,
            package: name,
            source: ADAPTER_PEER_SOURCE,
            remediation: `Remove "${peerDep}" from peerDependencies unless it is the implemented Core Module, a Kernel package (primitives/kernel/composition), or a required technology dependency.`,
          });
        }
      }
    }
  }

  return violations;
}

export const validateAdapterPeers = validate;