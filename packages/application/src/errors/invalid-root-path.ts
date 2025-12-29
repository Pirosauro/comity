import { BaseError } from "@comity/core/errors";

export class ApplicationInvalidRootPathError extends BaseError {
  readonly code = "CLI_INVALID_CONFIG_PATH";

  constructor(meta: { path: string; cwd: string; cause?: unknown }) {
    super("Invalid CLI configuration file path", {
      httpStatus: 400,
      path: meta.path,
      cwd: meta.cwd,
      cause: meta.cause,
    });
  }
}
