import { expect, it } from "@jest/globals";
import { getHydrationData } from "../../dist/get-hydration-data.js";

describe("getHydrationData", () => {
  it("should return correct hydration data", () => {
    const component = {
      name: "TestComponent",
      framework: "react",
    };
    const props = {
      "client:load": true,
    };
    const expected = {
      name: "TestComponent",
      strategy: { type: "load" },
      props: {},
      framework: "react",
    };
    const result = getHydrationData(component, props);

    expect(result).toMatchObject(expected);
  });

  it("should return correct hydration data when no strategy is provided", () => {
    const component = {
      name: "TestComponent",
      framework: "react",
    };
    const props = {};
    const expected = {
      name: "TestComponent",
      strategy: undefined,
      props: {},
      framework: "react",
    };
    const result = getHydrationData(component, props);

    expect(result).toMatchObject(expected);
  });
});
