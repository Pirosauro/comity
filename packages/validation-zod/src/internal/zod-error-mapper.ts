import type { ValidationIssue } from "@comity/validation/errors";
import type { ZodError } from "zod";

import { ValidationError } from "@comity/validation/errors";

/**
 * Maps a ZodError to a ValidationError.
 *
 * @param error - The ZodError to map
 *
 * @returns A ValidationError representing the ZodError
 *
 * @remarks This function transforms the structure of a ZodError into a more generic ValidationError format, preserving the error codes and paths for each validation issue.
 */
export function mapZodError(error: ZodError): ValidationError {
  const fields: Record<string, ValidationIssue[]> = {};

  for (const issue of error.issues) {
    const path = formatPath(issue.path);

    (fields[path] ??= []).push({
      code: issue.code,
    });
  }

  return new ValidationError("failed", {
    details: {
      fields,
    },
  });
}

/**
 * Formats a path array into a string representation.
 *
 * @param path - An array of strings and/or numbers representing the path to a validation issue
 *
 * @returns A string representation of the path, where each segment is separated by a dot (.) and array indices are enclosed in square brackets ([]).
 *
 * @remarks This function is used to convert the path information from Zod's error structure into a more readable format for the ValidationError.
 */
function formatPath(path: readonly PropertyKey[]): string {
  if (path.length === 0) {
    return "$";
  }

  let result = "";

  for (const segment of path) {
    if (typeof segment === "number") {
      result += `[${segment}]`;

      continue;
    }

    if (result.length > 0) {
      result += ".";
    }

    result += String(segment);
  }

  return result;
}
