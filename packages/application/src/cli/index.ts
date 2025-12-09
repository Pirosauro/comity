import type { CliPlugin } from "@comity/cli";
import { buildCommand } from "./build.js";
import { devCommand } from "./dev.js";

const plugin: CliPlugin = {
  name: "@comity/application",
  version: "1.0.0",
  commands: [
    {
      name: "build",
      description: "Build the application",
      action: buildCommand,
    },
    {
      name: "dev",
      description: "Start the development server",
      action: devCommand,
    },
  ],
  hooks: {},
};

export default plugin;
