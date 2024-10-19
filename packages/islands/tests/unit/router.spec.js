import { expect, jest, it } from "@jest/globals";
import { registerRoutes } from "../../dist/router.js";

describe("registerRoutes", () => {
  it("should register routes correctly", async () => {
    const consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});
    const mockApp = {
      on: jest.fn(),
      notFound: jest.fn(),
      onError: jest.fn(),
    };
    const routes = {
      "folder/file": () => {},
      "api/folder/file": () => {},
      _404: () => {},
      _500: () => {},
    };

    await registerRoutes(mockApp, routes);

    expect(mockApp.on).toHaveBeenCalledTimes(2); // adjust based on actual routes
    expect(mockApp.notFound).toHaveBeenCalledTimes(1);
    expect(mockApp.onError).toHaveBeenCalledTimes(1);

    consoleLogSpy.mockClear();
  });
});
