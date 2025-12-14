import { ROUTE_PATTERN } from "../constants.js";

/**
 * Normalize path
 *
 * @param {string} str
 * @return {string}
 */
export const normalizePath = (str: string): string => {
  const replacer = (_: string, p: string, m: string) => {
    // normalize method, defaulting to 'all'
    return `${p}.${m || "all"}`;
  };

  return str
    .toLocaleLowerCase() // lowercase
    .substring(0, str.lastIndexOf(".")) // remove extension
    .replace(ROUTE_PATTERN, replacer);
};
