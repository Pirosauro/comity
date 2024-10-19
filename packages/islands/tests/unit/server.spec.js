import { expect, jest, it } from "@jest/globals";
import { Server } from "../../dist/server.js";

describe("Server", () => {
  let app;
  const routes = {
    "/hello": jest.fn(({ text }) => text("world")),
    "/_404": jest.fn(({ text }) => text("not found")),
    "/_500": jest.fn(({ text }) => text("500")),
  };

  beforeEach(() => {
    const consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});
    app = new Server();

    app.registerRoutes(routes);

    consoleLogSpy.mockClear();
  });

  it("registers routes correctly", async () => {
    expect(app.routes.length).toBe(1);

    const res = await app.request("http://localhost/hello");

    expect(res.status).toBe(200);
    expect(routes["/hello"]).toHaveBeenCalled();
  });

  it("handles custom 404 page", async () => {
    const res = await app.request("http://localhost/foo");

    expect(await res.text()).toBe("not found");
    expect(routes["/_404"]).toHaveBeenCalled();
  });
});
