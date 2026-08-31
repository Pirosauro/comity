import type { ErrorMeta } from "@comity/primitives/errors";

import { BaseError } from "@comity/primitives/errors";

/**
 * Reasons for CLI Core errors.
 *
 * @remarks
 * Finite set of machine-readable failure reasons for the CLI Core.
 * Each reason maps to a distinct recovery strategy.
 */
export type CliErrorReason =
  | "command_not_found"
  | "command_failed"
  | "hook_failed";

/**
 * CLI Error metadata.
 */
export interface CliErrorMeta extends ErrorMeta {
  readonly details?: Readonly<{
    name?: string;
    hook?: string;
    action?: string;
  }>;
}

/**
 * Stable default messages for each reason.
 */
const REASON_MESSAGES: Record<CliErrorReason, string> = {
  command_not_found: "Command not found",
  command_failed: "Command execution failed",
  hook_failed: "Command hook failed",
};

/**
 * CLI Error.
 *
 * @remarks
 * The single error class of the CLI Core. Execution failures are returned
 * as `Result` failures carrying this error; composition invariant violations
 * are thrown as this error. Infrastructure errors stay in the adapter layer.
 */
export class CliError extends BaseError<CliErrorMeta> {
  readonly code: `cli:${CliErrorReason}`;

  constructor(reason: CliErrorReason, meta?: Omit<CliErrorMeta, "reason">) {
    super(REASON_MESSAGES[reason], {
      ...meta,
      reason,
    });

    this.code = `cli:${reason}`;
  }
}