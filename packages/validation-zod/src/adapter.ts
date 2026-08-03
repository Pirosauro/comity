import type { Result } from "@comity/primitives/result";
import type { Validator } from "@comity/validation";
import type { ValidationError } from "@comity/validation/errors";
import type { ZodType } from "zod";

import { failure, success } from "@comity/primitives/result";
import { mapZodError } from "./internal/zod-error-mapper.js";

/**
 * Zod-based validator implementation.
 */
export class ZodValidator<T> implements Validator<T> {
  #schema: ZodType<T>;

  /**
   * @param schema - Zod schema to validate against
   */
  constructor(schema: ZodType<T>) {
    this.#schema = schema;
  }

  /**
   * @inheritdoc
   */
  async validate(value: T): Promise<Result<T, ValidationError>> {
    const result = await this.#schema.safeParseAsync(value);

    if (result.success) {
      return success(value);
    }

    return failure(mapZodError(result.error));
  }
}
