import type { Result } from "@comity/primitives/result";
import type { GeographyError } from "../errors/index.js";

/**
 * Metadata for a country.
 *
 * @remarks
 * Represents geographic metadata and rules for a country.
 * This is an extension point for adapters to populate country-specific data.
 */
export interface CountryMetadata {
  /**
   * ISO 3166-1 alpha-2 country code.
   */
  readonly code: string;

  /**
   * Country name.
   */
  readonly name: string;
}

/**
 * Metadata for a geographic subdivision.
 *
 * @remarks
 * Represents a subdivision (state, province, region, etc.) within a country.
 * Subdivisions are organized hierarchically by country.
 * This is an extension point for adapters to populate subdivision-specific data.
 */
export interface SubdivisionMetadata {
  /**
   * Subdivision code within the country context.
   */
  readonly code: string;

  /**
   * Subdivision name.
   */
  readonly name: string;

  /**
   * ISO 3166-2 subdivision code (optional).
   */
  readonly isoCode?: string;
}

/**
 * Input for geographic resolution.
 *
 * @remarks
 * Contains geographic identifiers used to resolve geographic context.
 * The countryCode is required; other fields are optional and may be used
 * for more precise resolution.
 */
export interface GeographicInput {
  /**
   * ISO 3166-1 alpha-2 country code.
   */
  readonly countryCode: string;

  /**
   * Administrative area code or name within the country.
   * Interpretation depends on country-specific rules.
   */
  readonly administrativeArea?: string | null;

  /**
   * Postal code within the country.
   * Format and validation rules are country-specific.
   */
  readonly postalCode?: string | null;
}

/**
 * Resolved geographic context.
 *
 * @remarks
 * Represents enriched geographic information resolved from geographic identifiers.
 * Contains metadata for country and subdivision if resolution was successful.
 */
export interface GeographicContext {
  /**
   * Country metadata resolved from countryCode.
   */
  readonly country?: CountryMetadata;

  /**
   * Subdivision metadata resolved from administrativeArea code.
   */
  readonly subdivision?: SubdivisionMetadata;
}

/**
 * Provider for geographic metadata and resolution.
 *
 * @remarks
 * Defines the contract for resolving geographic context from geographic identifiers.
 * Implementations are responsible for providing country and subdivision metadata,
 * validating geographic data, and applying geographic rules.
 *
 * This is the primary extension point for external geographic data providers.
 */
export interface GeographyProvider {
  /**
   * Resolves geographic context based on the provided input.
   *
   * @param input - The geographic input containing country code, administrative area, and postal code.
   *
   * @returns A promise that resolves to a Result containing either the GeographicContext or a GeographyError.
   *
   * @remarks
   * This method is responsible for determining the geographic context based on the provided
   * geographic identifiers. It may involve looking up country and subdivision metadata based
   * on the input parameters. If resolution fails, a GeographyError with appropriate reason
   * should be returned.
   */
  resolve(input: GeographicInput): Promise<Result<GeographicContext, GeographyError>>;
}
