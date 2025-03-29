import { writeFile, readFile, readdir } from 'fs/promises';
import { join } from 'path';

(async () => {
  const versions = {};

  // Read all packages and get their versions
  (await readdir('../', { withFileTypes: true })).forEach(async (folder) => {
    if (folder.isDirectory()) {
      const path = join('../', folder.name, 'package.json');

      try {
        const manifest = JSON.parse(await readFile(path, 'utf-8'));

        versions[manifest.name] = process.env.VERSION || `^${manifest.version}`;
      } catch (error) {
        console.error(`Failed to read or parse ${manifest}:`, error);
      }
    }
  });

  // Update all templates with the latest versions
  (await readdir('../../templates', { withFileTypes: true })).forEach(
    async (folder) => {
      if (folder.isDirectory()) {
        const path = join('../../templates', folder.name);

        try {
          const manifest = JSON.parse(
            await readFile(`${path}/package.json`, 'utf-8')
          );

          // Update dependencies
          manifest.dependencies = Object.keys(manifest.dependencies).reduce(
            (accumulator, key) => {
              accumulator[key] = versions[key]
                ? versions[key]
                : manifest.dependencies[key];

              return accumulator;
            },
            {}
          );

          // Update devDependencies
          manifest.devDependencies = Object.keys(
            manifest.devDependencies
          ).reduce((accumulator, key) => {
            accumulator[key] = versions[key]
              ? versions[key]
              : manifest.devDependencies[key];

            return accumulator;
          }, {});

          await writeFile(
            `${path}/package.json`,
            JSON.stringify(manifest, undefined, 2)
          );
        } catch (error) {
          console.error(`Failed to read or parse ${path}/package.json:`, error);
        }
      }
    }
  );
})()
  .then(() => {})
  .catch(console.error);
