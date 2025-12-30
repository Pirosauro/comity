import type { ModuleMeta } from "@comity/core";

/**
 * Module metadata for `@comity/acl`.
 *
 * @remarks
 * The ACL module provides helpers and adapters to perform subject- and
 * field-level access control checks within Comity use-cases. Consumers can
 * register this module when assembling application modules, although the
 * module itself does not currently provide runtime services — it acts as a
 * logical grouping for ACL-related utilities.
 *
 * @example
 * ```typescript
 * import aclModule from "@comity/acl/setup";
 * const ctx = await createContext([aclModule, otherModules...]);
 * ```
 */
const module: ModuleMeta = {
  name: "@comity/acl",
  version: "1.0.0",
  setup: async (options) => async () => {},
  dependsOn: ["@comity/core"],
  optionalDependsOn: [],
  incompatibleWith: [],
};

export default module;
