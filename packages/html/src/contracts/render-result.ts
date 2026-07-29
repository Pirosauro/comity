import type { HttpResponse } from "@comity/http";
import type { Result } from "@comity/primitives/result";
import type { HtmlError } from "../errors/html.js";

/**
 * HTML render result type
 */
export type HtmlRenderResult = Result<HttpResponse, HtmlError, "ok">;
