import { join } from 'node:path';
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { render } from 'ejs';
import { exists } from './utils.js';

const skipFiles = ['node_modules', '.template.json'];

/**
 *
 * @param {string} templatePath
 * @param {string} projectName
 * @param {string} workingDir
 * @returns {Promise<void>}
 */
export const populateProject = async (
  templatePath: string,
  projectName: string,
  workingDir: string
): Promise<void> => {
  // read all files/folders (1 level) from template folder
  const filesToCreate = await readdir(templatePath);

  // loop each file/folder
  filesToCreate.forEach(async (file) => {
    const origFilePath = join(templatePath, file);

    // get stats about the current file
    const stats = await stat(origFilePath);

    // skip files that should not be copied
    if (skipFiles.indexOf(file) > -1) return;

    if (stats.isFile()) {
      // read file content and transform it using template engine
      const contents = render(await readFile(origFilePath, 'utf8'), {
        projectName,
      });
      // write file to destination folder
      const writePath = join(workingDir, projectName, file);

      await writeFile(writePath, contents, 'utf8');
    } else if (stats.isDirectory()) {
      const tartgetPath = join(workingDir, projectName, file);

      if (!(await exists(tartgetPath))) {
        // create folder in destination folder
        mkdir(tartgetPath);
      }

      // copy files/folder inside current folder recursively
      await populateProject(
        join(templatePath, file),
        join(projectName, file),
        workingDir
      );
    }
  });
};
