import { mkdir } from 'node:fs/promises';

/**
 *
 * @param {string} tartgetPath
 * @param {boolean} isUpdate
 * @returns {Promise<void>}
 */
export const createProject = async (
  tartgetPath: string,
  isUpdate: boolean
): Promise<void> => {
  const message = isUpdate ? 'Updating project…' : 'Creating project…';

  console.log('\u001B[33m' + message + '\u001B[0m');

  // create folder in current directory
  if (!isUpdate) {
    await mkdir(tartgetPath);
  }
};
