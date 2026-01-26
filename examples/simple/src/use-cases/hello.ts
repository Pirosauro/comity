import type { BaseError } from "@comity/primitives/errors";
import type { Result } from "@comity/primitives/result";
import type { HelloViewModel } from "../view-models/hello.js";

import { InternalError } from "@comity/primitives/errors";
import { failure, success } from "@comity/primitives/result";

/**
 * Hello use case
 *
 * @param fail Whether to simulate a failure
 * @returns A Result containing a greeting message
 */
export function helloUseCase(
  fail: boolean = false,
): Result<HelloViewModel, BaseError> {
  if (fail) {
    return failure(new InternalError());
  }

  return success({ message: "Hello, Comity!", title: "Greetings" });
}
