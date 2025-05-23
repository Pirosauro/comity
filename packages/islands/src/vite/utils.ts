const regex = /^(\/.*?)(?:\.(all|delete|get|middleware|patch|post|put))?$/i;

/**
 * Normalize path
 *
 * This function normalizes a given path string by converting it to lowercase,
 * removing the file extension, and ensuring it follows a consistent format.
 *
 * @param {string} str - The path string to normalize.
 * @return {string} - The normalized path string.
 */
export const normalizePath = (str: string): string => {
  const replacer = (_: string, p: string, m: string) => {
    // Normalize method, defaulting to 'all'
    return `${p}.${m || 'all'}`;
  };

  return str
    .toLocaleLowerCase() // Convert to lowercase
    .substring(0, str.lastIndexOf('.')) // Remove file extension
    .replace(regex, replacer); // Apply regex replacement
};

/**
 * Sort routes
 *
 * This function sorts an array of route paths. It arranges the routes by their
 * directory structure, sorts directories by length (longer paths first), and
 * sorts files within each directory.
 *
 * @param {string[]} routes - The array of route paths to sort.
 * @returns {string[]} - The sorted array of route paths.
 */
export const sortRoutes = (routes: string[]): string[] => {
  const getRank = (segment: string): number => {
    if (segment.startsWith('_')) return 0; // highest priority
    if (segment.includes('*') || segment.includes('[...')) return 1; // wildcard
    if (segment.startsWith(':') || segment.startsWith('[')) return 3; // dynamic

    return 2; // static
  };

  return routes
    .sort((a, b) => {
      const aParts = a.replace(/^\//, '').split('/');
      const bParts = b.replace(/^\//, '').split('/');

      const len = Math.max(aParts.length, bParts.length);

      for (let i = 0; i < len; i++) {
        const aSeg = aParts[i] || '';
        const bSeg = bParts[i] || '';

        const aRank = getRank(aSeg);
        const bRank = getRank(bSeg);

        if (aRank !== bRank) return aRank - bRank;

        if (aSeg !== bSeg) return aSeg.localeCompare(bSeg);
      }

      // If everything else equal, shorter path wins (root `/`)
      return aParts.length - bParts.length;
    })
    .map((route) => {
      // Remove leading slash and trailing slash
      return '/' + route.replace(/^\//, '').replace(/\/$/, '');
    });
};
