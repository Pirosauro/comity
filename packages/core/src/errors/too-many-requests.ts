export class TooManyRequestsError extends Error {
  readonly status = 429;

  constructor(message = "Too Many Requests") {
    super(message);

    this.name = "TooManyRequestsError";
  }
}
