const ADAPTER_PEER_SOURCE = "adapters.md §13 / architecture-validation.md §7.4 (docs/standards/)";

const TECHNOLOGY_ADAPTERS = new Set([
  "@comity/http-hono",
  "@comity/router-path-to-regexp",
  "@comity/html-react",
  "@comity/html-preact",
  "@comity/hydration-react",
  "@comity/hydration-preact",
  "@comity/auth-jose",
  "@comity/cache-kv",
  "@comity/cache-redis",
  "@comity/i18n-typesafe",
  "@comity/sql-kysely",
  "@comity/graphql-client-ws",
  "@comity/graphql-client-fetch",
  "@comity/http-fetch",
  "@comity/validation-zod",
]);

const ADAPTER_CORE_MODULE_MAP = new Map([
  ["@comity/http-hono", "@comity/http"],
  ["@comity/router-path-to-regexp", "@comity/router"],
  ["@comity/html-react", "@comity/html"],
  ["@comity/html-preact", "@comity/html"],
  ["@comity/hydration-react", "@comity/hydration"],
  ["@comity/hydration-preact", "@comity/hydration"],
  ["@comity/auth-jose", "@comity/auth"],
  ["@comity/cache-kv", "@comity/cache"],
  ["@comity/cache-redis", "@comity/cache"],
  ["@comity/i18n-typesafe", "@comity/i18n"],
  ["@comity/sql-kysely", "@comity/sql"],
  ["@comity/graphql-client-ws", "@comity/graphql-client"],
  ["@comity/graphql-client-fetch", "@comity/graphql-client"],
  ["@comity/http-fetch", "@comity/http"],
  ["@comity/validation-zod", "@comity/validation"],
]);

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
]);

const KERNEL_PACKAGES = new Set(["@comity/primitives", "@comity/kernel", "@comity/composition"]);

function getAdapterCoreModules(adapterName, manifest) {
  const mapped = ADAPTER_CORE_MODULE_MAP.get(adapterName);
  if (mapped) return [mapped];

  const coreDeps = Object.keys(manifest.dependencies ?? {})
    .filter((dep) => dep.startsWith("@comity/"))
    .filter((dep) => !dep.includes("-"));

  return coreDeps;
}

export function validate(context) {
  const { packages, classification } = context;
  const violations = [];

  for (const pkg of packages) {
    const { name, manifest } = pkg;
    const category = classification.get(name);

    if (!TECHNOLOGY_ADAPTERS.has(name)) continue;

    const coreModules = getAdapterCoreModules(name, manifest);
    const peerDeps = manifest.peerDependencies ?? {};
    const deps = manifest.dependencies ?? {};

    for (const coreModule of coreModules) {
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
        const allowedPeerCoreModules = [...coreModules, ...KERNEL_PACKAGES];
        if (!allowedPeerCoreModules.includes(peerDep)) {
          violations.push({
            code: "ARCH-ADAPTER-PEER-004",
            message: `Technology Adapter "${name}" declares peerDependency on "${peerDep}" which is not a Core Module it implements or a Kernel package`,
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
