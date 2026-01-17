/**
 * Interface for serializing and deserializing island data
 */
export interface IslandSerializer {
  /** Serialize an island's properties to a string */
  serialize(value: unknown): string;

  /** Deserialize a string back into an island's properties */
  deserialize(value: string): unknown;
}

export const JsonIslandSerializer: IslandSerializer = {
  /**
   * Serialize an island's properties to a string
   *
   * @param value The value to serialize
   * @returns Serialized string
   */
  serialize(value) {
    return JSON.stringify(value);
  },

  /**
   * Deserialize a string back into an island's properties
   *
   * @param value The string to deserialize
   * @returns Deserialized value
   */
  deserialize(value) {
    return JSON.parse(value);
  },
};
