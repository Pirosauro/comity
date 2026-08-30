import { createCli } from "@comity/cli";
import { Command } from "commander";
import { describe, expect, it } from "vitest";
import { createCommanderAdapter } from "../adapter.js";

describe("probe", () => {
  it("help only", async () => {
    const cli = createCli({ context: {} });
    const adapter = createCommanderAdapter({
      program: new Command().name("my-cli").version("1.0.0"),
      cli,
    });
    console.log("PROBE-HELP-START");
    expect(await adapter.run(["--help"])).toBe(0);
    console.log("PROBE-HELP-END");
  });

  it("version only", async () => {
    const cli = createCli({ context: {} });
    const adapter = createCommanderAdapter({
      program: new Command().name("my-cli").version("1.0.0"),
      cli,
    });
    console.log("PROBE-VERSION-START");
    expect(await adapter.run(["--version"])).toBe(0);
    console.log("PROBE-VERSION-END");
  });
});
