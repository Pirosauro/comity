import type { HttpContext } from "../contracts/context.js";
import type { HttpRequest } from "../contracts/request.js";
import type { HttpResult } from "../contracts/result.js";

import type { HttpState } from "../contracts/state.js";
import { createHttpState } from "../contracts/state.js";

/**
 * Default implementation of HttpContext.
 */
export class DefaultHttpContext implements HttpContext {
  #response?: HttpResult;

  #state: HttpState;

  #request: HttpRequest;

  #signal: AbortSignal;

  constructor(request: HttpRequest, signal: AbortSignal) {
    this.#state = createHttpState();
    this.#request = request;
    this.#signal = signal;
  }

  /**
   *
   */
  get response() {
    return this.#response;
  }

  /**
   *
   */
  get state() {
    return this.#state;
  }

  /**
   *
   */
  get request() {
    return this.#request;
  }

  /**
   *
   */
  get signal() {
    return this.#signal;
  }

  /**
   *
   * @param response
   */
  setResponse(response: HttpResult): void {
    if (this.#response) {
      throw new Error("Response already set");
    }

    this.#response = response;
  }
}
