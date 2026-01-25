/**
 * HTTP status codes.
 *
 * @comity ai-jsdoc-skip
 */
export type HttpStatus =
  | 100 // Informational response, continuation or request received
  | 101 // Switching protocols
  | 102 // Processing (WebDAV)
  | 200 // OK
  | 201 // Created
  | 202 // Accepted
  | 204 // No Content
  | 301 // Moved Permanently
  | 302 // Found
  | 304 // Not Modified
  | 400 // Bad Request
  | 401 // Unauthorized
  | 403 // Forbidden
  | 404 // Not Found
  | 409 // Conflict
  | 422 // An unprocessable entity was encountered
  | 500 // Internal Server Error
  | 502 // Bad Gateway
  | 503 // Service Unavailable
  | 504; // Gateway Timeout
