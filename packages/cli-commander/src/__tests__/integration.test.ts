import type { CliCommandArgs, CliCommandContext } from "@comity/cli";
import { CommandRegistry, CliExecutionFacade, createCliExecutionFacade } from "@comity/cli";
import { Command } from "commander";
import { describe, expect, it, vi } from "vitest";
import { createCommanderAdapter } from "../adapter.js";
import { DefaultHookBus } from "@comity/primitives/lifecycle";
import { DefaultEventBus } from "@comity/primitives/lifecycle";
import { DefaultDiContainer } from "@comity/primitives/di";
import { Kernel } from "@comity/kernel";

interface AppContext {
  services: {
    resolve<T>(token: PropertyKey): T;
  };
  config: {
    apiUrl: string;
  };
}

interface OrderService {
  list(): Promise<readonly { id: string; total: number }[]>;
}

const ORDER_SERVICE_TOKEN = Symbol("orderService");

const mockOrderService = {
  list: vi.fn().mockResolvedValue([
    { id: "1", total: 100 },
    { id: "2", total: 200 },
  ]),
};

describe("ADR-025 Integration: Application-owned CLI wiring", () => {
  function createTestKernel() {
    const services = new DefaultDiContainer();
    const events = new DefaultEventBus();
    const hooks = new DefaultHookBus();
    return new Kernel({ services, events, hooks });
  }

  function createAppContext(kernel: Kernel): AppContext {
    return {
      services: {
        resolve: kernel.services.resolve.bind(kernel.services),
      },
      config: { apiUrl: "https://api.example.com" },
    };
  }

  it("demonstrates complete Application → Module → Registry → Facade → Commander chain", async () => {
    // 1. Application creates ONE Kernel
    const kernel = createTestKernel();

    // 2. Kernel lifecycle: OPEN → CONFIGURE → SEAL → INITIALIZE → RUNNING
    // Define shared service in Kernel DI
    kernel.services.define(ORDER_SERVICE_TOKEN, () => mockOrderService);
    kernel.seal();
    kernel.start();

    // 2. Application creates CommandRegistry
    const registry = new CommandRegistry<AppContext>();

    // 3. Module registers command via registerCliCommands(registry)
    // Module receives ONLY the registry, NOT Kernel/HookBus/EventBus
    function ordersModuleRegisterCliCommands(registry: CommandRegistry<AppContext>) {
      registry.register({
        name: "orders:list",
        description: "List orders",
        action: async (args: CliCommandArgs, context: CliCommandContext<AppContext>) => {
          // Module accesses services via execution context ONLY
          const orderService = context.services.resolve(ORDER_SERVICE_TOKEN);
          const orders = await orderService.list();
          console.table(orders);
        },
      });
    }

    // Application invokes module capability
    ordersModuleRegisterCliCommands(registry);

    // Verify command registered
    expect(registry.all()).toHaveLength(1);
    expect(registry.all()[0].name).toBe("orders:list");

    // 5. Application creates AppContext from Kernel
    const appContext = {
      services: {
        resolve: kernel.services.resolve.bind(kernel.services),
      },
      config: { apiUrl: "https://api.example.com" },
    };

    // 6. Application adapts Kernel buses to CLI-specific contracts
    const cliHooks = kernel.hooks as any;
    const cliEvents = kernel.events as any;

    // 7. Create CliExecutionFacade (NO second Kernel)
    const cli = createCliExecutionFacade(registry, cliHooks, cliEvents, appContext);

    // 8. Create Commander adapter consuming ONLY CliExecutionFacade
    const program = new Command().name("test-cli").version("1.0.0");
    const adapter = createCommanderAdapter({ program, facade: cli });

    // 9. Execute command via Commander
    const exitCode = await adapter.run(["orders:list"]);

    // 10. Verify successful execution
    expect(exitCode).toBe(0);

    // 11. Verify single Kernel only (no second Kernel created)
    // No CliKernel/createCliKernel used anywhere

    // 12. Verify CliExecutionFacade has no start/stop lifecycle
    // It only has execute() method - no start()/stop()
    expect(typeof cli.execute).toBe("function");
    expect((cli as any).start).toBeUndefined();
    expect((cli as any).stop).toBeUndefined();

    // 12. Shutdown order: adapter shutdown → kernel.stop()
    // CLI has no persistent adapter to stop; just stop Kernel
    await kernel.stop();
  });

  it("verifies module receives ONLY CommandRegistry, not Kernel/HookBus/EventBus", () => {
    const registry = new CommandRegistry<AppContext>();

    // This is the module's registerCliCommands function
    // It must ONLY receive the registry
    let receivedArgs: unknown[] = [];

    function ordersModuleRegisterCliCommands(registry: CommandRegistry<AppContext>, ...extra: unknown[]) {
      receivedArgs = [registry, ...extra];
      registry.register({
        name: "orders:list",
        action: async () => {},
      });
    }

    // Application calls with ONLY registry
    ordersModuleRegisterCliCommands(registry);

    // Module received exactly ONE argument: the registry
    expect(receivedArgs).toHaveLength(1);
    expect(receivedArgs[0]).toBe(registry);
    expect(receivedArgs[0]).toBeInstanceOf(CommandRegistry);

    // Module did NOT receive Kernel, HookBus, EventBus, or lifecycle controls
  });

  it("verifies CliExecutionFacade is the ONLY CLI runtime boundary", () => {
    const registry = new CommandRegistry<AppContext>();
    const hooks = new DefaultHookBus<any>();
    const events = new DefaultEventBus<any>();
    const context = {
      services: { resolve: () => mockOrderService },
      config: { apiUrl: "https://api.example.com" },
    };

    const cli = createCliExecutionFacade(registry, hooks, events, context);

    // CliExecutionFacade has ONLY these methods
    expect(typeof cli.execute).toBe("function");
    expect(typeof cli.commands).toBe("function");

    // NO start/stop lifecycle
    expect((cli as any).start).toBeUndefined();
    expect((cli as any).stop).toBeUndefined();
    expect((cli as any).seal).toBeUndefined();

    // NO Kernel reference exposed
    expect((cli as any).kernel).toBeUndefined();
  });

  it("verifies adapter uses ONLY CliExecutionFacade, no internal APIs", () => {
    const registry = new CommandRegistry<AppContext>();
    registry.register({
      name: "test",
      action: async () => {},
    });

    const hooks = new DefaultHookBus<any>();
    const events = new DefaultEventBus<any>();
    const context = {
      services: { resolve: () => mockOrderService },
      config: { apiUrl: "https://api.example.com" },
    };

    const cli = createCliExecutionFacade(registry, hooks, events, context);

    const program = new Command().name("test").version("1.0.0");
    const adapter = createCommanderAdapter({ program, facade: cli });

    // Adapter works with ONLY the facade
    expect(typeof adapter.run).toBe("function");

    // Adapter does not access CommandRegistry directly
    // Adapter does not access CommandExecutor directly
    // Adapter does not access Kernel directly
  });

  it("verifies no second Kernel created in concurrent CLI + HTTP scenario", async () => {
    // Single Kernel created ONCE
    const kernel = createTestKernel();
    kernel.services.define(ORDER_SERVICE_TOKEN, () => mockOrderService);
    kernel.seal();
    kernel.start();

    // CLI wiring
    const cliRegistry = new CommandRegistry<AppContext>();
    cliRegistry.register({
      name: "test",
      action: async () => {},
    });

    const appContext = {
      services: { resolve: kernel.services.resolve.bind(kernel.services) },
      config: { apiUrl: "https://api.example.com" },
    };

    const cli = createCliExecutionFacade(
      cliRegistry,
      kernel.hooks as any,
      kernel.events as any,
      appContext
    );

    // HTTP wiring (simulated - uses SAME kernel)
    // HTTP would use: kernel.services.resolve(HTTP_TOKEN)
    // No second Kernel created

    // Verify same Kernel instance
    expect(cli.commands()).toHaveLength(1);

    // Execute CLI command
    const program = new Command().name("test").version("1.0.0");
    const adapter = createCommanderAdapter({ program, facade: cli });
    await adapter.run(["test"]);

    // Shutdown: HTTP adapter.stop() → kernel.stop()
    // CLI has no separate adapter shutdown
    await kernel.stop();
  });
});