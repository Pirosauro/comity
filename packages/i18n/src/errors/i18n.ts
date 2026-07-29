import type { ErrorMeta } from "@comity/primitives/errors";

import { BaseError } from "@comity/primitives/errors";

/**
 * I18n error reasons.
 */
export type I18nErrorReason =
  | "missing_loader"
  | "missing_translator_factory"
  | "locale_resolution_failed"
  | "locale_not_supported";

/**
 * Metadata for I18n errors.
 */
export interface I18nErrorMeta extends ErrorMeta {
  /** The reason for the I18n error. */
  reason: I18nErrorReason;

  /** Additional details about the I18n error, such as the locale and adapter involved. */
  details?: Readonly<{
    /** The locale associated with the I18n error. */
    locale?: string;

    /** The adapter associated with the I18n error. */
    adapter?: string;

    /** The violation associated with the I18n error. */
    violation?: string;
  }>;
}

const REASON_MESSAGES: Record<I18nErrorReason, string> = {
  missing_loader: "I18n loader not configured",
  missing_translator_factory: "I18n translator factory not configured",
  locale_resolution_failed: "Failed to resolve locale",
  locale_not_supported: "Locale not supported",
};

/**
 * I18n module errors.
 */
export class I18nError extends BaseError<I18nErrorMeta> {
  readonly code: `i18n:${I18nErrorReason}`;

  constructor(reason: I18nErrorReason, meta?: Omit<I18nErrorMeta, "reason">) {
    super(REASON_MESSAGES[reason], {
      ...meta,
      reason,
    });

    this.code = `i18n:${reason}`;
  }
}
