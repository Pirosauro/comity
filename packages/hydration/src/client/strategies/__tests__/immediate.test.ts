import { describe, expect, it, vi } from "vitest";
import { immediate } from "../immediate.js";

describe("immediate", () => {
  it("should call the run function immediately", () => {
    const run = vi.fn();

    immediate(run);

    expect(run).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledWith();
  });

  it("should call run synchronously", () => {
    let called = false;
    const run = async () => {
      called = true;
    };

    immediate(run);

    expect(called).toBe(true);
  });

  it("should handle async run function", async () => {
    const run = vi.fn().mockResolvedValue("done");

    immediate(run);

    expect(run).toHaveBeenCalled();

    await expect(run()).resolves.toBe("done");
  });
});
