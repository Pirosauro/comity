#!/usr/bin/env node

import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { input, select } from '@inquirer/prompts';
import { createProject } from './create-project.js';
import { populateProject } from './populate-project.js';
import { getTemplates } from './templates.js';
import { exists } from './utils.js';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = dirname(__filename); // get the name of the directory

const workingDir = process.cwd();
const projectTemplate = await select({
  message: 'What template would you like to use?',
  choices: getTemplates(),
});
const projectName = await input({
  message: 'Please input a new project name:',
});
const templatePath = join(__dirname, 'templates', projectTemplate);
const targetPath = join(workingDir, projectName);
const isUpdate = await exists(targetPath);

try {
  await createProject(targetPath, isUpdate);
  await populateProject(templatePath, projectName, workingDir);

  console.log('\u001B[32m' + 'Project created successfully!' + '\u001B[0m');
} catch (error) {
  console.error('\u001B[31m' + (error as Error).message + '\u001B[0m');
}
