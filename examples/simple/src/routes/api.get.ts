import type { Route } from "@comity/router";
import { helloUseCase } from "../use-cases/hello.js";

const route: Route = {
  method: "GET",
  path: "/api/hello",
  /** @inheritdoc */
  handler: async (ctx) => {
    const result = helloUseCase();

    if (!result.success) {
      return {
        status: 500,
        body: { error: result.error.code },
      };
    }

    return {
      status: 200,
      body: result.value,
    };
  },
};

export default route;
