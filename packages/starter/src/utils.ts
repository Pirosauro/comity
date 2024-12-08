import { access } from 'node:fs/promises';

/**
 * Check if a file or directory exists
 *
 * @param {string} path
 * @returns {Promise<boolean>}
 */
export const exists = async (path: string): Promise<boolean> => {
  return await access(path).then(
    () => true,
    () => false
  );
};
