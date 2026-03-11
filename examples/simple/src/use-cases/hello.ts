import type { Result } from "@comity/primitives/result";
import type { HelloViewModel } from "../view-models/hello.js";

import { HttpError } from "@comity/http/error";
import { failure, success } from "@comity/primitives/result";

/**
 * Hello use case
 *
 * @param fail Whether to simulate a failure
 *
 * @returns A Result containing a greeting message
 */
export function helloUseCase(fail: boolean = false): Result<HelloViewModel, HttpError> {
  if (fail) {
    return failure(new HttpError("internal_error"));
  }

  return success({ message: "Hello, Comity!", title: "Greetings" });
}
