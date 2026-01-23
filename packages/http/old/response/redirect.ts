import type { HttpRedirectResponse } from "../contracts/response.js";

/**
 * Creates a redirect HTTP response
 *
 * @param location The URL to redirect to
 * @param status The HTTP status code for the redirect (default: 302)
 * @returns The redirect HTTP response
 */
export function redirect(location: string, status: 302): HttpRedirectResponse {
  return { intent: "redirect", status, location };
}
