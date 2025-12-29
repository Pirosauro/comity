import type { ModuleMeta } from "@comity/core";

const module: ModuleMeta = {
  name: "@comity/application",
  version: "1.0.0",
  setup: async (options) => async () => {},
  dependsOn: ["@comity/core"],
  optionalDependsOn: [],
  incompatibleWith: [],
};

export default module;
