import type { BaseError } from "@comity/core/errors";

/**
 * Domain-level HTTP execution result.
 *
 * Protocol-agnostic.
 */
export type HttpResult =
  | {
      /**
       *
       */
      kind: "success";
      /**
       *
       */
      data?: unknown;
    }
  | {
      /**
       *
       */
      kind: "redirect";
      /**
       *
       */
      location: string;
    }
  | {
      /**
       *
       */
      kind: "failure";
      /**
       *
       */
      error: BaseError;
    };

/**
 *
 * @param data
 */
export const success = (data?: unknown): HttpResult => ({
  kind: "success",
  data,
});

/**
 *
 * @param error
 */
export const failure = (error: BaseError): HttpResult => ({
  kind: "failure",
  error,
});

/**
 *
 * @param location
 */
export const redirect = (location: string): HttpResult => ({
  kind: "redirect",
  location,
});
