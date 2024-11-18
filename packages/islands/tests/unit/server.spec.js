import { describe, expect, jest, it } from "@jest/globals";
import { Server } from "../../dist/server.js";

describe("Server", () => {
  let server;
  let consoleLog;

  beforeEach(() => {
    consoleLog = console.log;
    console.log = jest.fn();
    server = new Server();
  });

  afterEach(() => {
    console.log = consoleLog;
  });

  it("should register routes correctly", () => {
    const routes = {
      "/test.get": jest.fn(),
      "/test.post": jest.fn(),
    };

    server.registerRoutes(routes);

    expect(console.log).toHaveBeenCalledWith(
      "\u001B[34mRegistering routes\u001B[0m"
    );
    expect(console.log).toHaveBeenCalledWith("GET", "/test");
    expect(console.log).toHaveBeenCalledWith("POST", "/test");
    expect(console.log).toHaveBeenCalledWith(
      "\u001B[33m[OK] 2 routes registered\u001B[0m"
    );
  });

  it("should register custom 404 handler", () => {
    const routes = {
      "/_404": jest.fn(),
    };

    server.notFound = jest.fn();

    server.registerRoutes(routes);

    expect(server.notFound).toHaveBeenCalledWith(routes["/_404"]);
    expect(console.log).toHaveBeenCalledWith("404");
    expect(console.log).toHaveBeenCalledWith(
      "\u001B[33m[OK] 1 routes registered\u001B[0m"
    );
  });

  it("should register custom 500 handler", () => {
    const routes = {
      "/_500": jest.fn(),
    };

    server.onError = jest.fn();

    server.registerRoutes(routes);

    expect(server.onError).toHaveBeenCalledWith(routes["/_500"]);
    expect(console.log).toHaveBeenCalledWith("500");
    expect(console.log).toHaveBeenCalledWith(
      "\u001B[33m[OK] 1 routes registered\u001B[0m"
    );
  });

  it("should default to GET method for invalid methods", () => {
    const routes = {
      "/test.invalid": jest.fn(),
    };

    server.registerRoutes(routes);

    expect(console.log).toHaveBeenCalledWith("GET", "/test");
    expect(console.log).toHaveBeenCalledWith(
      "\u001B[33m[OK] 1 routes registered\u001B[0m"
    );
  });
});
