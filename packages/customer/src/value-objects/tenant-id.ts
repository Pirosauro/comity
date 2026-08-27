import type { Result } from "@comity/primitives/result";

import { InvalidIdentifierError } from "@comity/primitives/errors";
import { failure, success } from "@comity/primitives/result";
/**
 * TenantId is a value object that represents the unique identifier of a tenant.
 *
 * Tenant is a first-class isolation scope: repositories bind to a tenant via
 * `forTenant(tenant)` and the resulting instance is structurally scoped.
 */
export class TenantId {
  #value: string;

  /**
   * Creates a TenantId from an identifier string.
   *
   * The Value Object is always created in a valid state; an empty or
   * whitespace-only value yields an `empty` failure instead of throwing.
   *
   * @param value - The value of the tenant ID.
   *
   * @returns The TenantId, or an `empty` error when the value is empty or
   * whitespace-only.
   */
  static create(value: string): Result<TenantId, InvalidIdentifierError> {
    if (value.trim().length === 0) {
      return failure(
        new InvalidIdentifierError("empty", {
          details: { kind: "TenantId" },
        })
      );
    }

    return success(new TenantId(value));
  }

  /**
   * @param value - The value of the tenant ID.
   */
  private constructor(value: string) {
    this.#value = value;
  }

  /**
   * Returns the underlying string value of the tenant ID.
   *
   * @returns The underlying identifier.
   */
  get value(): string {
    return this.#value;
  }

  /**
   * Checks if this TenantId is equal to another TenantId.
   *
   * @param other - The other TenantId to compare with.
   *
   * @returns True if the TenantIds are equal, false otherwise.
   */
  equals(other: TenantId): boolean {
    return this.#value === other.toString();
  }

  /**
   * Returns a stable technical serialization of the tenant ID.
   *
   * This is a technical representation, NEVER a display format.
   *
   * @returns The string representation of the tenant ID.
   */
  toString(): string {
    return this.#value;
  }
}
