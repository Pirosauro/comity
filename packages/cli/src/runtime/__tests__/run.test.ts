import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { CliCommand } from "../../types.js";

describe("run", () => {
  let mockCommand: any;
  let mockProgram: any;
  let mockContext: any;
  let originalArgv: string[];

  beforeEach(() => {
    originalArgv = process.argv;
    process.argv = ["node", "cli"];

    // Create a mock command object
    mockCommand = {
      description: vi.fn().mockReturnThis(),
      option: vi.fn().mockReturnThis(),
      action: vi.fn(),
    };

    // Create a mock program
    mockProgram = {
      name: vi.fn().mockReturnThis(),
      version: vi.fn().mockReturnThis(),
      command: vi.fn().mockReturnValue(mockCommand),
      parse: vi.fn(),
    };

    // Mock Commander
    vi.doMock("commander", () => ({
      Command: class MockCommand {
        constructor() {
          return mockProgram;
        }
      },
    }));

    // Mock CliContext
    mockContext = {
      getAllCommands: vi.fn().mockReturnValue([]),
      executeHook: vi.fn().mockResolvedValue(undefined),
    };

    vi.doMock("../context.js", () => ({
      CliContext: class MockCliContext {
        constructor() {
          return mockContext;
        }
      },
    }));

    vi.doMock("../loader.js", () => ({
      loadCliConfig: vi.fn().mockResolvedValue({}),
    }));

    vi.doMock("../constant.js", () => ({
      VERSION: "1.0.0",
    }));
  });

  afterEach(() => {
    process.argv = originalArgv;
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("should execute without throwing", async () => {
    const { run } = await import("../run.js");
    await expect(run(["node", "cli"])).resolves.not.toThrow();
  });

  it("should set program name and version", async () => {
    const { run } = await import("../run.js");
    await run(["node", "cli"]);

    expect(mockProgram.name).toHaveBeenCalledWith("Comity CLI");
    expect(mockProgram.version).toHaveBeenCalledWith("1.0.0");
  });

  it("should register commands with description", async () => {
    const command: CliCommand = {
      name: "test",
      description: "Test command",
      action: vi.fn(),
    };

    mockContext.getAllCommands.mockReturnValue([command]);

    const { run } = await import("../run.js");
    await run(["node", "cli"]);

    expect(mockProgram.command).toHaveBeenCalledWith("test");
    expect(mockCommand.description).toHaveBeenCalledWith("Test command");
  });

  it("should register commands without description", async () => {
    const command: CliCommand = {
      name: "test",
      action: vi.fn(),
    };

    mockContext.getAllCommands.mockReturnValue([command]);

    const { run } = await import("../run.js");
    await run(["node", "cli"]);

    expect(mockProgram.command).toHaveBeenCalledWith("test");
    expect(mockCommand.description).not.toHaveBeenCalled();
  });

  it("should register command options", async () => {
    const command: CliCommand = {
      name: "test",
      description: "Test command",
      action: vi.fn(),
      options: [
        {
          flags: "-v, --verbose",
          description: "Verbose output",
          default: false,
        },
        {
          flags: "-o, --output <file>",
          description: "Output file",
        },
      ],
    };

    mockContext.getAllCommands.mockReturnValue([command]);

    const { run } = await import("../run.js");
    await run(["node", "cli"]);

    expect(mockCommand.option).toHaveBeenCalledTimes(2);
    expect(mockCommand.option).toHaveBeenNthCalledWith(
      1,
      "-v, --verbose",
      "Verbose output",
      false
    );
    expect(mockCommand.option).toHaveBeenNthCalledWith(
      2,
      "-o, --output <file>",
      "Output file",
      undefined
    );
  });

  it("should register command action with hooks", async () => {
    const commandAction = vi.fn().mockResolvedValue(undefined);
    const command: CliCommand = {
      name: "test",
      description: "Test command",
      action: commandAction,
    };

    mockContext.getAllCommands.mockReturnValue([command]);

    const { run } = await import("../run.js");
    await run(["node", "cli"]);

    expect(mockCommand.action).toHaveBeenCalled();
    const actionCallback = mockCommand.action.mock.calls[0][0];

    // Execute the action callback
    await actionCallback("arg1", "arg2");

    expect(mockContext.executeHook).toHaveBeenCalledTimes(2);
    expect(mockContext.executeHook).toHaveBeenNthCalledWith(
      1,
      "beforeCommand",
      { command: "test", args: ["arg1", "arg2"] }
    );
    expect(mockContext.executeHook).toHaveBeenNthCalledWith(2, "afterCommand", {
      command: "test",
      args: ["arg1", "arg2"],
    });
    expect(commandAction).toHaveBeenCalledWith("arg1", "arg2");
  });

  it("should handle multiple commands", async () => {
    const command1: CliCommand = {
      name: "test1",
      description: "Test command 1",
      action: vi.fn(),
    };

    const command2: CliCommand = {
      name: "test2",
      description: "Test command 2",
      action: vi.fn(),
    };

    mockContext.getAllCommands.mockReturnValue([command1, command2]);

    const { run } = await import("../run.js");
    await run(["node", "cli"]);

    expect(mockProgram.command).toHaveBeenCalledTimes(2);
    expect(mockProgram.command).toHaveBeenNthCalledWith(1, "test1");
    expect(mockProgram.command).toHaveBeenNthCalledWith(2, "test2");
  });

  it("should parse process.argv", async () => {
    const { run } = await import("../run.js");
    await run(["node", "cli"]);

    expect(mockProgram.parse).toHaveBeenCalledWith(process.argv);
  });

  it("should handle command action errors in hooks", async () => {
    const commandAction = vi.fn().mockResolvedValue(undefined);
    const command: CliCommand = {
      name: "test",
      description: "Test command",
      action: commandAction,
    };

    mockContext.getAllCommands.mockReturnValue([command]);
    mockContext.executeHook.mockRejectedValueOnce(new Error("Hook error"));

    const { run } = await import("../run.js");
    await run(["node", "cli"]);

    const actionCallback = mockCommand.action.mock.calls[0][0];

    await expect(actionCallback()).rejects.toThrow("Hook error");
  });
});
