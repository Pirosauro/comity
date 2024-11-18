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
      "/test.all": jest.fn(),
      "/test.delete": jest.fn(),
      "/test.patch": jest.fn(),
      "/test.post": jest.fn(),
      "/test.put": jest.fn(),
    };

    server.registerRoutes(routes);

    expect(console.log).toHaveBeenCalledWith(
      "\u001B[34mRegistering routes\u001B[0m"
    );
    expect(console.log).toHaveBeenCalledWith("*", "/test");
    expect(console.log).toHaveBeenCalledWith("DELETE", "/test");
    expect(console.log).toHaveBeenCalledWith("PATCH", "/test");
    expect(console.log).toHaveBeenCalledWith("POST", "/test");
    expect(console.log).toHaveBeenCalledWith("PUT", "/test");
    expect(console.log).toHaveBeenCalledWith(
      "\u001B[33m[OK] 5 routes registered\u001B[0m"
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

  it("should default to GET method for not specified methods", () => {
    const routes = {
      "/test": jest.fn(),
      "/test.txt": jest.fn(),
      "/test.invalid": jest.fn(),
    };

    server.registerRoutes(routes);

    expect(console.log).toHaveBeenCalledWith("GET", "/test");
    expect(console.log).toHaveBeenCalledWith("GET", "/test.txt");
    expect(console.log).toHaveBeenCalledWith("GET", "/test.invalid");
    expect(console.log).toHaveBeenCalledWith(
      "\u001B[33m[OK] 3 routes registered\u001B[0m"
    );
  });
});
