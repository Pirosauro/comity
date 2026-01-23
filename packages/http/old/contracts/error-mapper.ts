import type { BaseError } from "@comity/core/errors";
import type { HttpProblem } from "./problem.js";

/**
 * Maps domain errors to HTTP problems.
 */
export interface HttpErrorMapper {
  /**
   *
   */
  map(error: BaseError): HttpProblem;
}
