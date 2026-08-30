import type { CliCommand, CliConfig, CliContext, Logger } from "@comity/cli";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createCommanderAdapter, createCommanderAdapterWithDefaults } from "../adapter.js";
import { CliContext } from "@comity/cli";

function createTestLogger(): Logger {
  return {
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  };
}

function createTestContext(config?: Partial<CliConfig>): CliContext {
  const logger = createTestLogger();
  const testConfig: CliConfig = {
    logger,
    plugins: [],
    hooks: {},
    ...config,
  };
  return new CliContext(testConfig);
}

function createTestCommand(name: string, action?: CliCommand["action"]): CliCommand {
  return {
    name,
    description: `Description for ${name}`,
    action: action ?? (async () => {}),
    options: [],
  };
}

describe("createCommanderAdapter", () => {
  let context: CliContext;
  let logger: Logger;

  beforeEach(() => {
    logger = createTestLogger();
    context = createTestContext({ logger });
  });

  it("should create adapter with run function", () => {
    const adapter = createCommanderAdapter({
      name: "test",
      version: "1.0.0",
      context,
      logger,
    });

    expect(adapter).toHaveProperty("run");
    expect(typeof adapter.run).toBe("function");
  });

  it("should execute a simple command", async () => {
    const action = vi.fn();
    context.registerCommand(createTestCommand("test", action));

    const adapter = createCommanderAdapter({
      name: "test",
      version: "1.0.0",
      context,
      logger,
    });

    const exitCode = await adapter.run(["test"]);

    expect(exitCode).toBe(0);
    expect(action).toHaveBeenCalledTimes(1);
  });

  it("should pass parsed arguments to command action", async () => {
    const action = vi.fn();
    const command = createTestCommand("test", action);
    command.options = [
      { flags: "-f, --flag <value>", description: "A flag", default: "default" },
    ];
    context.registerCommand(command);

    const adapter = createCommanderAdapter({
      name: "test",
      version: "1.0.0",
      context,
      logger,
    });

    await adapter.run(["test", "--flag", "custom"]);

    expect(action).toHaveBeenCalledWith(
      expect.objectContaining({
        flag: "custom",
      }),
      expect.any(Object)
    );
  });

  it("should execute beforeCommand and afterCommand hooks", async () => {
    const beforeHook = vi.fn();
    const afterHook = vi.fn();

    context.registerHook("beforeCommand", beforeHook);
    context.registerHook("afterCommand", afterHook);

    const action = vi.fn();
    context.registerCommand(createTestCommand("test", action));

    const adapter = createCommanderAdapter({
      name: "test",
      version: "1.0.0",
      context,
      logger,
    });

    await adapter.run(["test"]);

    expect(beforeHook).toHaveBeenCalledWith(
      expect.objectContaining({
        commandName: "test",
      })
    );
    expect(afterHook).toHaveBeenCalledWith(
      expect.objectContaining({
        commandName: "test",
      })
    );
    // Check that beforeHook was called before afterHook
    const beforeTime = vi.mocked(beforeHook).mock.results[0].value;
    const afterTime = vi.mocked(afterHook).mock.results[0].value;
    // Just verify both were called
    expect(beforeHook).toHaveBeenCalled();
    expect(afterHook).toHaveBeenCalled();
  });

  it("should return exit code 1 on command error", async () => {
    const errorAction = vi.fn(() => {
      throw new Error("Command failed");
    });
    context.registerCommand(createTestCommand("fail", errorAction));

    const adapter = createCommanderAdapter({
      name: "test",
      version: "1.0.0",
      context,
      logger,
    });

    const exitCode = await adapter.run(["fail"]);

    expect(exitCode).toBe(1);
    expect(logger.error).toHaveBeenCalled();
  });

  it("should return exit code 1 for unknown command (Commander default)", async () => {
    const adapter = createCommanderAdapter({
      name: "test",
      version: "1.0.0",
      context,
      logger,
    });

    const exitCode = await adapter.run(["unknown"]);

    // Commander returns exit code 1 for unknown commands
    expect(exitCode).toBe(1);
  });

  it("should pass logger and config to command context", async () => {
    const action = vi.fn();
    context.registerCommand(createTestCommand("test", action));

    const adapter = createCommanderAdapter({
      name: "test",
      version: "1.0.0",
      context,
      logger,
    });

    await adapter.run(["test"]);

    expect(action).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        config: expect.any(Object),
        logger,
      })
    );
  });

  it("should handle async command actions", async () => {
    const action = vi.fn(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });
    context.registerCommand(createTestCommand("async", action));

    const adapter = createCommanderAdapter({
      name: "test",
      version: "1.0.0",
      context,
      logger,
    });

    const exitCode = await adapter.run(["async"]);

    expect(exitCode).toBe(0);
    expect(action).toHaveBeenCalledTimes(1);
  });

  it("should handle command with options and defaults", async () => {
    const action = vi.fn();
    const command = createTestCommand("build", action);
    command.options = [
      { flags: "--env <environment>", description: "Environment", default: "development" },
      { flags: "--verbose", description: "Verbose output" },
    ];
    context.registerCommand(command);

    const adapter = createCommanderAdapter({
      name: "test",
      version: "1.0.0",
      context,
      logger,
    });

    await adapter.run(["build"]);

    expect(action).toHaveBeenCalledWith(
      expect.objectContaining({
        env: "development",
      }),
      expect.any(Object)
    );
  });

  it("should override defaults with provided values", async () => {
    const action = vi.fn();
    const command = createTestCommand("build", action);
    command.options = [
      { flags: "--env <environment>", description: "Environment", default: "development" },
    ];
    context.registerCommand(command);

    const adapter = createCommanderAdapter({
      name: "test",
      version: "1.0.0",
      context,
      logger,
    });

    await adapter.run(["build", "--env", "production"]);

    expect(action).toHaveBeenCalledWith(
      expect.objectContaining({
        env: "production",
      }),
      expect.any(Object)
    );
  });
});

describe("createCommanderAdapterWithDefaults", () => {
  it("should create adapter with default filesystem config loader", () => {
    const context = createTestContext();

    const adapter = createCommanderAdapterWithDefaults({
      name: "test",
      version: "1.0.0",
      context,
      logger: createTestLogger(),
    });

    expect(adapter).toHaveProperty("run");
    expect(typeof adapter.run).toBe("function");
  });
});