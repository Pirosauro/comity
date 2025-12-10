import type { CliConfig, CliPlugin, CliCommand, CliHook } from "../types.js";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CliContext } from "../context.js";

describe("CliContext", () => {
  let mockLogger: any;
  let config: CliConfig;

  beforeEach(() => {
    mockLogger = {
      debug: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
    };

    config = {
      logger: mockLogger,
    };
  });

  describe("constructor", () => {
    it("should initialize with default logger if none provided", () => {
      const context = new CliContext({});

      expect(context).toBeInstanceOf(CliContext);
    });

    it("should use provided logger", () => {
      const context = new CliContext(config);

      expect(context).toBeInstanceOf(CliContext);
    });

    it("should register plugins from config", () => {
      const mockPlugin: CliPlugin = {
        name: "test-plugin",
        version: "1.0.0",
        commands: [
          {
            name: "test-cmd",
            description: "Test command",
            action: vi.fn(),
          },
        ],
        hooks: {
          beforeCommand: vi.fn(),
        },
      };

      const configWithPlugins: CliConfig = {
        ...config,
        plugins: [mockPlugin],
      };

      const context = new CliContext(configWithPlugins);

      expect(context.getCommand("test-cmd")).toBeDefined();
      expect(mockLogger.debug).toHaveBeenCalledWith(
        "Registered command: test-cmd"
      );
      expect(mockLogger.debug).toHaveBeenCalledWith(
        "Registered hook for: beforeCommand"
      );
    });

    it("should register global hooks from config", () => {
      const mockHook: CliHook = vi.fn();
      const configWithHooks: CliConfig = {
        ...config,
        hooks: {
          globalHook: mockHook,
        },
      };

      const context = new CliContext(configWithHooks);

      expect(mockLogger.debug).toHaveBeenCalledWith(
        "Registered hook for: globalHook"
      );
    });
  });

  describe("registerPlugin", () => {
    let context: CliContext;

    beforeEach(() => {
      context = new CliContext(config);
    });

    it("should register a plugin successfully", () => {
      const plugin: CliPlugin = {
        name: "test-plugin",
        version: "1.0.0",
      };

      context["registerPlugin"](plugin);

      expect(mockLogger.debug).not.toHaveBeenCalled();
    });

    it("should register plugin commands", () => {
      const plugin: CliPlugin = {
        name: "test-plugin",
        version: "1.0.0",
        commands: [
          {
            name: "test-cmd",
            description: "Test command",
            action: vi.fn(),
          },
        ],
      };

      context["registerPlugin"](plugin);

      expect(context.getCommand("test-cmd")).toBeDefined();
      expect(mockLogger.debug).toHaveBeenCalledWith(
        "Registered command: test-cmd"
      );
    });

    it("should register plugin hooks", () => {
      const plugin: CliPlugin = {
        name: "test-plugin",
        version: "1.0.0",
        hooks: {
          testHook: vi.fn(),
        },
      };

      context["registerPlugin"](plugin);

      expect(mockLogger.debug).toHaveBeenCalledWith(
        "Registered hook for: testHook"
      );
    });

    it("should throw error for duplicate plugin registration", () => {
      const plugin: CliPlugin = {
        name: "test-plugin",
        version: "1.0.0",
      };

      context["registerPlugin"](plugin);

      expect(() => {
        context["registerPlugin"](plugin);
      }).toThrow("Plugin 'test-plugin' is already registered.");

      expect(mockLogger.error).toHaveBeenCalledWith(
        "Plugin 'test-plugin' is already registered."
      );
    });
  });

  describe("registerCommand", () => {
    let context: CliContext;

    beforeEach(() => {
      context = new CliContext(config);
    });

    it("should register a command successfully", () => {
      const command: CliCommand = {
        name: "test-cmd",
        description: "Test command",
        action: vi.fn(),
      };

      context.registerCommand(command);

      expect(context.getCommand("test-cmd")).toEqual(command);
      expect(mockLogger.debug).toHaveBeenCalledWith(
        "Registered command: test-cmd"
      );
    });

    it("should throw error for duplicate command registration", () => {
      const command: CliCommand = {
        name: "test-cmd",
        description: "Test command",
        action: vi.fn(),
      };

      context.registerCommand(command);

      expect(() => {
        context.registerCommand(command);
      }).toThrow("Command 'test-cmd' is already registered.");

      expect(mockLogger.error).toHaveBeenCalledWith(
        "Command 'test-cmd' is already registered."
      );
    });
  });

  describe("registerHook", () => {
    let context: CliContext;

    beforeEach(() => {
      context = new CliContext(config);
    });

    it("should register a hook for a new hook name", () => {
      const hook: CliHook = vi.fn();

      context.registerHook("testHook", hook);

      expect(mockLogger.debug).toHaveBeenCalledWith(
        "Registered hook for: testHook"
      );
    });

    it("should register multiple hooks for the same name", () => {
      const hook1: CliHook = vi.fn();
      const hook2: CliHook = vi.fn();

      context.registerHook("testHook", hook1);
      context.registerHook("testHook", hook2);

      expect(mockLogger.debug).toHaveBeenCalledTimes(2);
    });
  });

  describe("executeHook", () => {
    let context: CliContext;

    beforeEach(() => {
      context = new CliContext(config);
    });

    it("should execute all hooks for a given name", async () => {
      const hook1 = vi.fn().mockResolvedValue(undefined);
      const hook2 = vi.fn().mockResolvedValue(undefined);
      const hookContext = { test: "data" };

      context.registerHook("testHook", hook1);
      context.registerHook("testHook", hook2);

      await context.executeHook("testHook", hookContext);

      expect(hook1).toHaveBeenCalledWith(hookContext);
      expect(hook2).toHaveBeenCalledWith(hookContext);
    });

    it("should handle empty context object", async () => {
      const hook = vi.fn().mockResolvedValue(undefined);

      context.registerHook("testHook", hook);

      await context.executeHook("testHook");

      expect(hook).toHaveBeenCalledWith({});
    });

    it("should handle hook errors gracefully", async () => {
      const errorHook = vi.fn().mockRejectedValue(new Error("Hook error"));
      const successHook = vi.fn().mockResolvedValue(undefined);

      context.registerHook("testHook", errorHook);
      context.registerHook("testHook", successHook);

      await context.executeHook("testHook");

      expect(errorHook).toHaveBeenCalled();
      expect(successHook).toHaveBeenCalled();
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.any(Error),
        "Error in hook 'testHook': Hook error"
      );
    });

    it("should handle non-Error exceptions", async () => {
      const errorHook = vi.fn().mockRejectedValue("String error");

      context.registerHook("testHook", errorHook);

      await context.executeHook("testHook");

      expect(mockLogger.error).toHaveBeenCalledWith(
        "String error",
        "Error in hook 'testHook': Unknown error"
      );
    });

    it("should do nothing for unregistered hooks", async () => {
      await context.executeHook("nonexistentHook");

      expect(mockLogger.error).not.toHaveBeenCalled();
    });
  });

  describe("getCommand", () => {
    let context: CliContext;

    beforeEach(() => {
      context = new CliContext(config);
    });

    it("should return registered command", () => {
      const command: CliCommand = {
        name: "test-cmd",
        description: "Test command",
        action: vi.fn(),
      };

      context.registerCommand(command);

      expect(context.getCommand("test-cmd")).toEqual(command);
    });

    it("should return undefined for unregistered command", () => {
      expect(context.getCommand("nonexistent")).toBeUndefined();
    });
  });

  describe("getAllCommands", () => {
    let context: CliContext;

    beforeEach(() => {
      context = new CliContext(config);
    });

    it("should return empty array when no commands registered", () => {
      expect(context.getAllCommands()).toEqual([]);
    });

    it("should return all registered commands", () => {
      const command1: CliCommand = {
        name: "cmd1",
        description: "Command 1",
        action: vi.fn(),
      };

      const command2: CliCommand = {
        name: "cmd2",
        description: "Command 2",
        action: vi.fn(),
      };

      context.registerCommand(command1);
      context.registerCommand(command2);

      const commands = context.getAllCommands();

      expect(commands).toHaveLength(2);
      expect(commands).toContain(command1);
      expect(commands).toContain(command2);
    });
  });
});
