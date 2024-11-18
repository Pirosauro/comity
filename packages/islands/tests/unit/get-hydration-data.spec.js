import { describe, expect, it } from "@jest/globals";
import { getHydrationData } from "../../dist/get-hydration-data.js";

describe("getHydrationData", () => {
  it("should return correct hydration data with client:load strategy", () => {
    const component = {
      name: "TestComponent",
      framework: "react",
    };
    const props = { "client:load": true };
    const expected = {
      name: "TestComponent",
      strategy: { type: "load" },
      props: {},
      framework: "react",
    };

    expect(getHydrationData(component, props)).toEqual(expected);
  });

  it("should return correct hydration data with client:visible strategy", () => {
    const component = {
      name: "TestComponent",
      framework: "react",
    };
    const props = { "client:visible": true };
    const expected = {
      name: "TestComponent",
      strategy: { type: "visible" },
      props: {},
      framework: "react",
    };

    expect(getHydrationData(component, props)).toEqual(expected);
  });

  it("should return correct hydration data with client:media strategy", () => {
    const component = {
      name: "TestComponent",
      framework: "react",
    };
    const props = { "client:media": "(max-width: 600px)" };
    const expected = {
      name: "TestComponent",
      strategy: { type: "media", value: "(max-width: 600px)" },
      props: {},
      framework: "react",
    };

    expect(getHydrationData(component, props)).toEqual(expected);
  });

  it("should return correct hydration data with client:idle strategy", () => {
    const component = {
      name: "TestComponent",
      framework: "react",
    };
    const props = { "client:idle": true };
    const expected = {
      name: "TestComponent",
      strategy: { type: "idle" },
      props: {},
      framework: "react",
    };

    expect(getHydrationData(component, props)).toEqual(expected);
  });

  it("should return correct hydration data with no strategy", () => {
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

    expect(getHydrationData(component, props)).toEqual(expected);
  });

  it("should return default framework if not provided", () => {
    const component = { name: "TestComponent" };
    const props = { "client:load": true };
    const expected = {
      name: "TestComponent",
      strategy: { type: "load" },
      props: {},
      framework: "hono",
    };

    expect(getHydrationData(component, props)).toEqual(expected);
  });
});
