export const HTTP_INTENTS = ["text", "html", "json", "redirect", "event-stream"] as const;

/**
 * HTTP intent type
 */
export type HttpIntent = (typeof HTTP_INTENTS)[number];

/**
 * Base type for all HTTP responses
 */
export type HttpResponse =
  | HttpTextResponse
  | HttpJsonResponse
  | HttpHtmlResponse
  | HttpRedirectResponse;

/**
 * Any HTTP Response
 */
export type AnyHttpResponse = HttpBaseResponse | HttpResponse;

/**
 * Represents an HTTP response.
 *
 * @comity ai-jsdoc-skip
 */
export interface HttpBaseResponse {
  /** HTTP status code. */
  status: number;

  /** HTTP headers. */
  headers?: Record<string, string>;
}

/**
 * Base HTTP Response
 */
export interface HttpIntentResponse<K extends string> extends HttpBaseResponse {
  /** Intent  */
  readonly intent: K;

  /** HTTP cookies */
  readonly cookies?: Record<string, string>;
}

/**
 * HTTP streaming response
 */
export interface HttpStreamingResponse {
  /** Stream */
  readonly stream: ReadableStream<Uint8Array>;

  /** Abort function */
  readonly abort?: () => void;

  /** No Body */
  readonly body?: never;
}

/**
 * Static HTTP response
 */
export interface HttpStaticResponse<T> {
  /** Body */
  readonly body: T;

  /** No streaming */
  readonly streaming?: never;

  /** No streaming abort */
  readonly abort?: never;
}

/**
 * HTTP text response
 */
export type HttpTextResponse = HttpIntentResponse<"text"> &
  (HttpStaticResponse<string> | HttpStreamingResponse);

/**
 * HTTP JSON response
 */
export type HttpJsonResponse = HttpIntentResponse<"json"> &
  (HttpStaticResponse<unknown> | HttpStreamingResponse);

/**
 * HTTP HTML response
 */
export type HttpHtmlResponse = HttpIntentResponse<"html"> &
  (HttpStaticResponse<string> | HttpStreamingResponse);

/**
 * HTTP redirect response
 */
export interface HttpRedirectResponse {
  /** Response intent */
  readonly intent: "redirect";

  /** HTTP status code */
  readonly status: 301 | 302 | 303 | 307 | 308;

  /** Redirection location */
  readonly location: string;
}
