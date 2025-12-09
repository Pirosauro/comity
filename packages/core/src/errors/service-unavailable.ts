export class ServiceUnavailableError extends Error {
  readonly status = 503;

  constructor(message = "Service Unavailable") {
    super(message);

    this.name = "ServiceUnavailableError";
  }
}
