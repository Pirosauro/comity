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
  const groups: Record<string, string[]> = {};

  // Arrange files by folder
  routes.forEach((path) => {
    const parts = path.replace(/^\//, '').split('/');
    const filename = parts.pop();
    const directory = parts.length === 0 ? '/' : `/${parts.join('/')}/`;

    // Initialize group if it doesn't exist
    if (!groups[directory]) {
      groups[directory] = [];
    }

    if (filename) {
      groups[directory].push(filename);
    }
  });

  // Sort groups by length - longer paths first
  const index = Object.keys(groups).sort((a, b) => {
    if (a.length === b.length) {
      return a.localeCompare(b);
    }

    return b.length - a.length;
  });

  const result: string[] = [];
  const replacer = (_: string, p: string) => (p === 'index' ? '' : p);

  // Sort files in each directory
  index.forEach((directory) => {
    result.push(
      ...groups[directory]
        .sort((a, b) => {
          // Sort special files first
          if (a[0] === '_' || (a[0] === '[' && b[0] !== '[')) {
            return 1;
          }

          if (a[0] !== '[' && b[0] === '[') {
            return -1;
          }

          // Normalize and compare filenames
          const an = a.toLocaleLowerCase().replace(regex, replacer);
          const bn = b.toLocaleLowerCase().replace(regex, replacer);

          if (an.length === bn.length) {
            return an.localeCompare(bn);
          }

          return bn.length - an.length;
        })
        .map((s) => directory + s)
    );
  });

  return result;
};
