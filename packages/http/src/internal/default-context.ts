import type { HttpContext } from "../contracts/context.js";
import type { HttpRequest } from "../contracts/request.js";
import type { HttpResult } from "../contracts/result.js";
import type { HttpState } from "../contracts/state.js";

import { createHttpState } from "../contracts/state.js";

/**
 * Default implementation of HttpContext.
 *
 * @comity ai-jsdoc-skip
 */
export class DefaultHttpContext implements HttpContext {
  /**  */
  #request: HttpRequest;

  /** */
  #signal: AbortSignal;

  /** */
  #state: HttpState;

  /** */
  #response?: HttpResult;

  constructor(request: HttpRequest, signal: AbortSignal) {
    this.#request = request;
    this.#signal = signal;
    this.#state = createHttpState();
  }

  /** @inheritdoc */
  get response(): HttpResult | undefined {
    return this.#response;
  }

  /** @inheritdoc */
  get state(): HttpState {
    return this.#state;
  }

  /** @inheritdoc */
  get request(): HttpRequest {
    return this.#request;
  }

  /** @inheritdoc */
  get signal(): AbortSignal {
    return this.#signal;
  }

  /** @inheritdoc */
  setResponse(response: HttpResult): void {
    if (this.#response) {
      throw new Error("Response already set");
    }

    this.#response = response;
  }
}
