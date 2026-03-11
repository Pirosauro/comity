import type { Result } from "@comity/primitives/result";
import type { HttpError } from "../error/http.js";
import type { HttpResponse } from "./response.js";

/**
 * HTTP result.
 */
export type HttpResult = Result<HttpResponse, HttpError, "ok">;
