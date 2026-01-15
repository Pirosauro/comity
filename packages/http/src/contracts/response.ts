export const HTTP_INTENTS = [
  "text",
  "html",
  "json",
  "redirect",
  "event-stream",
] as const;

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
 * HTTP Stream interface
 */
export interface HttpStream {
  /** Pipes the stream to a writable stream */
  pipe(writable: WritableStream): Promise<void>;

  /** Aborts the stream */
  abort?(): void;
}

/**
 * Base HTTP Response
 */
export interface HttpBaseResponse<K extends string> {
  /** Intent  */
  readonly intent: K;

  /** HTTP status code */
  readonly status?: number;

  /** HTTP headers */
  readonly headers?: Record<string, string> | undefined;

  /** HTTP cookies */
  readonly cookies?: Record<string, string> | undefined;
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
export type HttpTextResponse = HttpBaseResponse<"text"> &
  (HttpStaticResponse<string> | HttpStreamingResponse);

/**
 * HTTP JSON response
 */
export type HttpJsonResponse = HttpBaseResponse<"json"> &
  (HttpStaticResponse<unknown> | HttpStreamingResponse);

/**
 * HTTP HTML response
 */
export type HttpHtmlResponse = HttpBaseResponse<"html"> &
  (HttpStaticResponse<string> | HttpStreamingResponse);

/**
 * HTTP redirect response
 */
export interface HttpRedirectResponse {
  /** Response intent */
  readonly intent: "redirect";

  /** HTTP status code */
  status: 301 | 302 | 303 | 307 | 308;

  /** Redirection location */
  readonly location: string;
}
