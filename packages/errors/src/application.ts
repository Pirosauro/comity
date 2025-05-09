export type ApplicationErrorOptions = ErrorOptions & {
  code?: string | number;
};

export abstract class ApplicationError extends Error {
  readonly code: string | number;

  constructor(message: string, { cause, ...options }: ApplicationErrorOptions) {
    super(message, { cause });

    this.name = this.constructor.name;
    this.code = options.code ?? 500;
  }
}
