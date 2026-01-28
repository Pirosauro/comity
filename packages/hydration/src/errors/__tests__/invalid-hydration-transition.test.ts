import { describe, expect, it } from "vitest";
import { InvalidHydrationTransitionError } from "../../errors/invalid-hydration-transition.js";

describe("InvalidHydrationTransitionError", () => {
  it("should expose code, message and meta", () => {
    const err = new InvalidHydrationTransitionError({ from: "idle", to: "hydrating" } as any);

    expect(err).toBeInstanceOf(Error);
    expect(err.code).toBe("hydration:invalid-transition");
    expect(err.message).toBe("Invalid hydration transition");
    expect(err.meta.from).toBe("idle");
    expect(err.meta.to).toBe("hydrating");
  });
});
