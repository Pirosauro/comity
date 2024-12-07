/**
 * Normalize path
 *
 * @param {string} str
 * @return {string}
 */
export const normalizePath = (str: string): string => {
  const regex = /^(\/.*?)(?:\.(all|delete|get|patch|post|put))?$/i;
  const replacer = (_: string, p: string, m: string) => {
    return `${p}.${m || 'get'}`;
  };

  return str
    .toLowerCase() // lowercase
    .substring(0, str.lastIndexOf('.')) // remove extension
    .replace(regex, replacer);
};

/**
 * Sort routes
 *
 * @param {string[]} routes
 * @returns {string[]}
 */
export const sortRoutes = (routes: string[]): string[] => {
  const regex = /^(.*?)(?:\.(all|delete|get|patch|post|put))?$/i;
  const groups: Record<string, string[]> = {};

  // arrange files by folder
  routes.forEach((path) => {
    const parts = path.replace(/^\//, '').split('/');
    const filename = parts.pop();
    const directory = parts.length === 0 ? '/' : `/${parts.join('/')}/`;

    // init group
    if (!groups[directory]) {
      groups[directory] = [];
    }

    if (filename) {
      groups[directory].push(filename);
    }
  });

  // sort groups by length - longer paths first
  const index = Object.keys(groups).sort((a, b) => {
    if (a.length === b.length) {
      return a.localeCompare(b);
    }

    return b.length - a.length;
  });
  const result: string[] = [];
  const replacer = (_: string, p: string) => (p === 'index' ? '' : p);

  // sort files in each directory
  index.forEach((directory) => {
    result.push(
      ...groups[directory]
        .sort((a, b) => {
          if (a[0] === '_' || (a[0] === '[' && b[0] !== '[')) {
            return 1;
          }

          if (a[0] !== '[' && b[0] === '[') {
            return -1;
          }

          const an = a.toLowerCase().replace(regex, replacer);
          const bn = b.toLowerCase().replace(regex, replacer);

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
