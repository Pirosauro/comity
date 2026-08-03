/**
 * Represents a point in time, with millisecond precision.
 */
export class Instant {
  /**
   * @param epochMilliseconds The number of milliseconds since the Unix epoch.
   */
  private constructor(readonly epochMilliseconds: number) {}

  /**
   * Creates an Instant representing the current point in time.
   *
   * @returns An Instant representing the current point in time.
   */
  static now(): Instant {
    return new Instant(Date.now());
  }

  /**
   * Creates an Instant from the number of milliseconds since the Unix epoch.
   *
   * @param value The number of milliseconds since the Unix epoch.
   *
   * @returns An Instant representing the specified point in time.
   */
  static fromEpochMilliseconds(value: number): Instant {
    return new Instant(value);
  }

  /**
   * Converts the Instant to an ISO 8601 string.
   *
   * @returns An ISO 8601 string representation of the Instant.
   */
  toISOString(): string {
    return new Date(this.epochMilliseconds).toISOString();
  }
}
