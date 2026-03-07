import type { Result } from "@comity/primitives/result";
import type { HttpError } from "../error/http.js";
import type { AnyHttpResponse } from "./response.js";

/**
 * HTTP result.
 */
export type HttpResult = Result<AnyHttpResponse, HttpError, "ok">;
