import type { ErrorMeta } from "@comity/primitives/errors";
import type { CliLifecycle } from "../contracts/hook.js";

import { BaseError } from "@comity/primitives/errors";

/**
 * Reasons for CLI errors.
 *
 * @remarks
 * Finite set of machine-readable failure reasons for the CLI Core. Each
 * reason maps to a distinct recovery strategy (none require framework
 * knowledge in the Core).
 */
export type CliErrorReason =
  "duplicate_command" | "command_not_found" | "command_failed" | "hook_failed";

/**
 * CLI Error metadata.
 */
export interface CliErrorMeta extends ErrorMeta {
  /** Structured metadata */
  readonly details?: Readonly<{
    /** The command name involved, when applicable */
    name?: string;

    /** The lifecycle hook involved, when applicable */
    hook?: keyof CliLifecycle;

    /** Message of a secondary error that occurred during cleanup */
    afterCommandError?: string;
  }>;
}

/**
 * Stable default messages for each reason.
 */
const REASON_MESSAGES: Record<CliErrorReason, string> = {
  duplicate_command: "Command is already registered",
  command_not_found: "Command not found",
  command_failed: "Command execution failed",
  hook_failed: "Command hook failed",
};

/**
 * CLI Error.
 *
 * @remarks
 * The single error class of the CLI Core. Command execution failures are
 * returned as `Result` failures carrying this error; registration invariant
 * violations are thrown as this error. Infrastructure errors stay in the
 * adapter layer and are never wrapped by the Core.
 */
export class CliError extends BaseError<CliErrorMeta> {
  /** Error code */
  readonly code: `cli:${CliErrorReason}`;

  /**
   * @param reason - The reason for the error
   * @param meta - Additional metadata for the error
   */
  constructor(reason: CliErrorReason, meta?: Omit<CliErrorMeta, "reason">) {
    super(REASON_MESSAGES[reason], {
      ...meta,
      reason,
    });

    this.code = `cli:${reason}`;
  }
}
