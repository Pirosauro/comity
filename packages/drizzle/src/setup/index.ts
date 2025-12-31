import { ModuleMeta } from "@comity/core";

const module: ModuleMeta = {
  name: "@comity/drizzle",
  version: "1.0.0",
  dependsOn: ["@comity/core"],
  optionalDependsOn: ["@comity/cli"],
  incompatibleWith: [],
  setup: async () => async (ctx) => {},
};

export default module;
