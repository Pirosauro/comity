import type { CliPlugin } from "@comity/cli";

// Example plugin that adds a simple command and a hook
const plugin: CliPlugin = {
  name: "@comity/postgres",
  version: "1.0.0",
  commands: [
    {
      name: "greet <name>",
      description: "Greet a user",
      action: (name: string) => {
        console.log(`Hello, ${name}! Welcome to MyCLI!`);
      },
    },
  ],
  hooks: {
    beforeCommand: (context) => {
      console.log(`[Plugin] Executing command: ${context.command}`);
    },
  },
};

export default plugin;
