import type { IslandContract } from "./contracts/island.js";

/**
 * Island contract or null/undefined
 */
export type MaybeIslandContract = IslandContract | null | undefined;

/**
 * Interface for serializing and deserializing island data
 */
export interface IslandSerializer {
  /** Serialize an island's properties to a string */
  serialize(value: MaybeIslandContract): string;

  /** Deserialize a string back into an island's properties */
  deserialize(value: string): MaybeIslandContract;
}

const ESCAPED_SCRIPT_CHARS: Record<string, string> = {
  "<": "\\u003C",
  ">": "\\u003E",
  "&": "\\u0026",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029",
};

/**
 * Escapes characters that can break an inline JSON script payload.
 *
 * @param value - Serialized JSON string.
 *
 * @returns JSON safe to embed inside HTML.
 */
function escapeSerializedJson(value: string): string {
  return value.replace(/[<>&\u2028\u2029]/g, (char) => ESCAPED_SCRIPT_CHARS[char] ?? char);
}

/**
 * Checks whether a value is a non-null object record.
 *
 * @param value - Value to inspect.
 *
 * @returns True when the value is an object.
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Validates the runtime shape of a parsed island contract.
 *
 * @param value - Parsed JSON payload.
 *
 * @returns True when the payload matches the public island contract.
 */
function isIslandContract(value: unknown): value is IslandContract<unknown> {
  if (!isRecord(value)) return false;

  const strategy = value["strategy"];
  const hasValidStrategy = isRecord(strategy) && typeof strategy["kind"] === "string";

  return (
    typeof value["id"] === "string" &&
    typeof value["component"] === "string" &&
    hasValidStrategy &&
    "data" in value &&
    (value["mode"] === undefined || value["mode"] === "client-only")
  );
}

export const JsonIslandSerializer: IslandSerializer = {
  /**
   * Serialize an island's properties to a string
   *
   * @param value The value to serialize
   *
   * @returns Serialized string
   */
  serialize(value) {
    return escapeSerializedJson(JSON.stringify(value ?? null));
  },

  /**
   * Deserialize a string back into an island's properties
   *
   * @param value The string to deserialize
   *
   * @returns Deserialized value
   */
  deserialize(value) {
    const parsed: unknown = JSON.parse(value);

    if (parsed === null) {
      return null;
    }

    if (!isIslandContract(parsed)) {
      throw new TypeError("Invalid island contract");
    }

    return parsed;
  },
};
