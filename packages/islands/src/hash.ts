/**
 * Calculate a hash for a given string
 *
 * This function generates a hash for the given string using the DJB2 algorithm.
 *
 * @param {string} str - The string to hash
 * @return {string} - The generated hash
 */
export const hash = (str: string): string => {
  let h = 5381;
  let i = str.length;

  while (i) {
    h = (h * 33) ^ str.charCodeAt(--i);
  }

  return (h >>> 0).toString(36);
};
