import type { SearchCriteriaFilter } from "@comity/search";

/**
 * Converts generic search filters to Magento category filter payload.
 *
 * @param filters - Generic search filters.
 *
 * @returns Magento filter object when filters are present.
 */
export function toMagentoFilter(
  filters?: ReadonlyArray<SearchCriteriaFilter>
): Record<string, unknown> | undefined {
  if (!filters || filters.length === 0) {
    return undefined;
  }

  const mapped = filters.reduce<Record<string, unknown>>((acc, filter) => {
    if (!filter?.field) {
      return acc;
    }

    // Handle equality filter.
    if (filter.eq !== undefined) {
      acc[filter.field] = { eq: String(filter.eq) };

      return acc;
    }

    // Handle "in" filter.
    if (filter.in && filter.in.length > 0) {
      acc[filter.field] = { in: filter.in.map((v) => String(v)) };

      return acc;
    }

    // Handle range filter.
    if (filter.min !== undefined || filter.max !== undefined) {
      acc[filter.field] = {
        ...(filter.min !== undefined ? { from: String(filter.min) } : {}),
        ...(filter.max !== undefined ? { to: String(filter.max) } : {}),
      };
    }

    return acc;
  }, {});

  if (Object.keys(mapped).length === 0) {
    return undefined;
  }

  return mapped;
}
