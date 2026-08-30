import type { CliCommand, CliConfig, CliHook, Logger } from "../types.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CliContext } from "../context.js";

interface TestConfig extends CliConfig {
  custom?: string;
}

function createTestConfig(overrides: Partial<CliConfig> = {}): CliConfig {
  const logger: Logger = {
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  };

  return {
    logger,
    plugins: [],
    hooks: {},
    ...overrides,
  };
}

function createTestCommand(name: string, action?: CliCommand["action"]): CliCommand {
  return {
    name,
    description: `Description for ${name}`,
    action: action ?? (async () => {}),
    options: [],
  };
}

describe("CliContext", () => {
  let context: CliContext;
  let config: CliConfig;

  beforeEach(() => {
    config = createTestConfig();
    context = new CliContext(config);
  });

  describe("registerCommand", () => {
    it("should register a command", () => {
      const command = createTestCommand("test");
      context.registerCommand(command);

      expect(context.getCommand("test")).toBe(command);
    });

    it("should throw on duplicate command name", () => {
      const command = createTestCommand("test");
      context.registerCommand(command);

      expect(() => context.registerCommand(createTestCommand("test"))).toThrow(
        "Command 'test' is already registered."
      );
    });

    it("should allow registering multiple different commands", () => {
      context.registerCommand(createTestCommand("cmd1"));
      context.registerCommand(createTestCommand("cmd2"));

      expect(context.getCommand("cmd1")).toBeDefined();
      expect(context.getCommand("cmd2")).toBeDefined();
    });
  });

  describe("getCommand", () => {
    it("should return undefined for non-existent command", () => {
      expect(context.getCommand("nonexistent")).toBeUndefined();
    });

    it("should return the registered command", () => {
      const command = createTestCommand("test");
      context.registerCommand(command);

      expect(context.getCommand("test")).toBe(command);
    });
  });

  describe("getAllCommands", () => {
    it("should return empty array initially", () => {
      expect(context.getAllCommands()).toEqual([]);
    });

    it("should return all registered commands in order", () => {
      const cmd1 = createTestCommand("cmd1");
      const cmd2 = createTestCommand("cmd2");
      const cmd3 = createTestCommand("cmd3");

      context.registerCommand(cmd1);
      context.registerCommand(cmd2);
      context.registerCommand(cmd3);

      const commands = context.getAllCommands();
      expect(commands).toHaveLength(3);
      expect(commands[0]).toBe(cmd1);
      expect(commands[1]).toBe(cmd2);
      expect(commands[2]).toBe(cmd3);
    });
  });

  describe("registerHook", () => {
    it("should register a hook", () => {
      const hook: CliHook = vi.fn();
      context.registerHook("testHook", hook);

      // Verify hook was registered by executing it
      return context.executeHook("testHook", {
        commandName: "test",
        args: {},
        config: config as any,
        logger: config.logger as any,
      }).then(() => {
        expect(hook).toHaveBeenCalledTimes(1);
      });
    });

    it("should support multiple hooks for the same name", () => {
      const hook1: CliHook = vi.fn();
      const hook2: CliHook = vi.fn();

      context.registerHook("multiHook", hook1);
      context.registerHook("multiHook", hook2);

      return context.executeHook("multiHook", {
        commandName: "test",
        args: {},
        config: config as any,
        logger: config.logger as any,
      }).then(() => {
        expect(hook1).toHaveBeenCalledTimes(1);
        expect(hook2).toHaveBeenCalledTimes(1);
      });
    });

    it("should execute hooks in registration order", () => {
      const order: number[] = [];
      const hook1: CliHook = vi.fn(() => order.push(1));
      const hook2: CliHook = vi.fn(() => order.push(2));

      context.registerHook("orderedHook", hook1);
      context.registerHook("orderedHook", hook2);

      return context.executeHook("orderedHook", {
        commandName: "test",
        args: {},
        config: config as any,
        logger: config.logger as any,
      }).then(() => {
        expect(order).toEqual([1, 2]);
      });
    });
  });

  describe("executeHook", () => {
    it("should execute all hooks for a name", async () => {
      const hook1: CliHook = vi.fn();
      const hook2: CliHook = vi.fn();

      context.registerHook("testHook", hook1);
      context.registerHook("testHook", hook2);

      await context.executeHook("testHook", {
        commandName: "test",
        args: { foo: "bar" },
        config: config as any,
        logger: config.logger as any,
      });

      expect(hook1).toHaveBeenCalledWith(
        expect.objectContaining({
          commandName: "test",
          args: { foo: "bar" },
        })
      );
      expect(hook2).toHaveBeenCalledTimes(1);
    });

    it("should isolate hook errors", async () => {
      const errorHook: CliHook = vi.fn(() => {
        throw new Error("Hook error");
      });
      const successHook: CliHook = vi.fn();

      context.registerHook("errorHook", errorHook);
      context.registerHook("errorHook", successHook);

      await context.executeHook("errorHook", {
        commandName: "test",
        args: {},
        config: config as any,
        logger: config.logger as any,
      });

      expect(errorHook).toHaveBeenCalledTimes(1);
      expect(successHook).toHaveBeenCalledTimes(1);
      expect(config.logger?.error).toHaveBeenCalled();
    });

    it("should pass correct context to hooks", async () => {
      const hook: CliHook = vi.fn();
      context.registerHook("contextHook", hook);

      const testArgs = { foo: "bar", baz: 123 };
      await context.executeHook("contextHook", {
        commandName: "myCommand",
        args: testArgs,
        config: config as any,
        logger: config.logger as any,
      });

      expect(hook).toHaveBeenCalledWith(
        expect.objectContaining({
          commandName: "myCommand",
          args: testArgs,
          config: config as any,
        })
      );
    });

    it("should do nothing for non-existent hook name", async () => {
      const hook: CliHook = vi.fn();
      await context.executeHook("nonexistent", {
        commandName: "test",
        args: {},
        config: config as any,
        logger: config.logger as any,
      });

      expect(hook).not.toHaveBeenCalled();
    });
  });

  describe("plugin registration", () => {
    it("should register plugin commands", () => {
      const pluginCommand = createTestCommand("pluginCmd");
      const plugin = {
        name: "testPlugin",
        version: "1.0.0",
        commands: [pluginCommand],
        hooks: {},
      };

      context.registerPlugin(plugin);

      expect(context.getCommand("pluginCmd")).toBe(pluginCommand);
    });

    it("should register plugin hooks", async () => {
      const hook: CliHook = vi.fn();
      const plugin = {
        name: "hookPlugin",
        version: "1.0.0",
        commands: [],
        hooks: {
          pluginHook: hook,
        },
      };

      context.registerPlugin(plugin);

      await context.executeHook("pluginHook", {
        commandName: "test",
        args: {},
        config: config as any,
        logger: config.logger as any,
      });

      expect(hook).toHaveBeenCalledTimes(1);
    });

    it("should throw on duplicate plugin name", () => {
      const plugin = {
        name: "dupPlugin",
        version: "1.0.0",
        commands: [],
        hooks: {},
      };

      context.registerPlugin(plugin);

      expect(() => context.registerPlugin(plugin)).toThrow(
        "Plugin 'dupPlugin' is already registered."
      );
    });

    it("should execute config hooks from constructor", async () => {
      const hook: CliHook = vi.fn();
      const configWithHooks = createTestConfig({
        hooks: {
          globalHook: hook,
        },
      });
      const ctx = new CliContext(configWithHooks);

      await ctx.executeHook("globalHook", {
        commandName: "test",
        args: {},
        config: configWithHooks as any,
        logger: configWithHooks.logger as any,
      });

      expect(hook).toHaveBeenCalledTimes(1);
    });

    it("should execute config plugins from constructor", () => {
      const pluginCommand = createTestCommand("configPluginCmd");
      const plugin = {
        name: "configPlugin",
        version: "1.0.0",
        commands: [pluginCommand],
        hooks: {},
      };
      const configWithPlugins = createTestConfig({
        plugins: [plugin],
      });
      const ctx = new CliContext(configWithPlugins);

      expect(ctx.getCommand("configPluginCmd")).toBe(pluginCommand);
    });
  });
});