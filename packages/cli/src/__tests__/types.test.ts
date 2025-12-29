import { describe, it, expect } from "vitest";
import type {
  CliOption,
  CliCommand,
  CliHook,
  CliPlugin,
  CliConfig,
  CliContextInterface,
} from "../types.js";

describe("types.ts exports", () => {
  describe("CliOption", () => {
    it("should allow valid CliOption structure", () => {
      const option: CliOption = {
        flags: "-v, --version",
        description: "Show version",
        default: "1.0.0",
      };

      expect(option.flags).toBe("-v, --version");
      expect(option.description).toBe("Show version");
      expect(option.default).toBe("1.0.0");
    });

    it("should allow CliOption without description", () => {
      const option: CliOption = {
        flags: "-v",
      };

      expect(option.flags).toBe("-v");
      expect(option.description).toBeUndefined();
    });

    it("should allow CliOption without default", () => {
      const option: CliOption = {
        flags: "-v, --version",
        description: "Show version",
      };

      expect(option.default).toBeUndefined();
    });
  });

  describe("CliCommand", () => {
    it("should allow valid CliCommand structure", () => {
      const command: CliCommand = {
        name: "test",
        description: "Test command",
        action: () => {},
        options: [
          {
            flags: "-v, --verbose",
            description: "Verbose output",
          },
        ],
      };

      expect(command.name).toBe("test");
      expect(command.description).toBe("Test command");
      expect(typeof command.action).toBe("function");
      expect(command.options).toHaveLength(1);
    });

    it("should allow CliCommand without options", () => {
      const command: CliCommand = {
        name: "test",
        description: "Test command",
        action: () => {},
      };

      expect(command.options).toBeUndefined();
    });

    it("should allow async action", async () => {
      const command: CliCommand = {
        name: "test",
        description: "Test command",
        action: async () => {
          await Promise.resolve();
        },
      };

      await expect(command.action()).resolves.toBeUndefined();
    });
  });

  describe("CliHook", () => {
    it("should allow synchronous hook", () => {
      const hook: CliHook = (context) => {
        expect(context).toBeDefined();
      };

      hook({});
    });

    it("should allow asynchronous hook", async () => {
      const hook: CliHook = async (context) => {
        await Promise.resolve();
        expect(context).toBeDefined();
      };

      await hook({});
    });

    it("should allow hook that returns void", () => {
      const hook: CliHook = () => {};

      expect(hook({})).toBeUndefined();
    });

    it("should allow hook that returns Promise<void>", async () => {
      const hook: CliHook = async () => {
        await Promise.resolve();
      };

      await expect(hook({})).resolves.toBeUndefined();
    });
  });

  describe("CliPlugin", () => {
    it("should allow valid CliPlugin structure", () => {
      const plugin: CliPlugin = {
        name: "test-plugin",
        version: "1.0.0",
        commands: [
          {
            name: "test",
            description: "Test command",
            action: () => {},
          },
        ],
        hooks: {
          beforeCommand: () => {},
        },
      };

      expect(plugin.name).toBe("test-plugin");
      expect(plugin.version).toBe("1.0.0");
      expect(plugin.commands).toHaveLength(1);
      expect(plugin.hooks).toBeDefined();
    });

    it("should allow CliPlugin without commands", () => {
      const plugin: CliPlugin = {
        name: "test-plugin",
        version: "1.0.0",
      };

      expect(plugin.commands).toBeUndefined();
    });

    it("should allow CliPlugin without hooks", () => {
      const plugin: CliPlugin = {
        name: "test-plugin",
        version: "1.0.0",
        commands: [],
      };

      expect(plugin.hooks).toBeUndefined();
    });
  });

  describe("CliConfig", () => {
    it("should allow valid CliConfig structure", () => {
      const logger = {
        info: () => {},
        error: () => {},
      };

      const config: CliConfig = {
        logger: logger as any,
        plugins: [
          {
            name: "test-plugin",
            version: "1.0.0",
          },
        ],
        hooks: {
          beforeCommand: () => {},
        },
      };

      expect(config.logger).toBe(logger);
      expect(config.plugins).toHaveLength(1);
      expect(config.hooks).toBeDefined();
    });

    it("should allow CliConfig without logger", () => {
      const config: CliConfig = {
        plugins: [],
      };

      expect(config.logger).toBeUndefined();
    });

    it("should allow CliConfig without plugins", () => {
      const config: CliConfig = {
        hooks: {},
      };

      expect(config.plugins).toBeUndefined();
    });

    it("should allow CliConfig without hooks", () => {
      const config: CliConfig = {
        plugins: [],
      };

      expect(config.hooks).toBeUndefined();
    });

    it("should allow empty CliConfig", () => {
      const config: CliConfig = {};

      expect(config).toEqual({});
    });
  });

  describe("CliContextInterface", () => {
    it("should define registerCommand method", () => {
      const context: CliContextInterface = {
        registerCommand: () => {},
        registerHook: () => {},
        executeHook: async () => {},
      };

      expect(typeof context.registerCommand).toBe("function");
      expect(typeof context.registerHook).toBe("function");
      expect(typeof context.executeHook).toBe("function");
    });

    it("should allow registerCommand with CliCommand", () => {
      const context: CliContextInterface = {
        registerCommand: (command: CliCommand) => {
          expect(command.name).toBe("test");
        },
        registerHook: () => {},
        executeHook: async () => {},
      };

      context.registerCommand({
        name: "test",
        description: "Test",
        action: () => {},
      });
    });

    it("should allow registerHook with string and CliHook", () => {
      const context: CliContextInterface = {
        registerCommand: () => {},
        registerHook: (name: string, hook: CliHook) => {
          expect(name).toBe("testHook");
          expect(typeof hook).toBe("function");
        },
        executeHook: async () => {},
      };

      context.registerHook("testHook", () => {});
    });

    it("should allow executeHook with optional context", async () => {
      const context: CliContextInterface = {
        registerCommand: () => {},
        registerHook: () => {},
        executeHook: async (name: string, ctx?: any) => {
          expect(name).toBe("testHook");
          expect(ctx).toBeDefined();
        },
      };

      await context.executeHook("testHook", { test: "data" });
    });
  });
});

