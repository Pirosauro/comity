#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import { Command } from 'commander';
import { build, createServer } from 'vite';

const version = '0.4.5';
const program = new Command();
const ascii = `                                                            
  _____           _ __      
 / ___/__  __ _  (_) /___ __
/ /__/ _ \\/  ' \\/ / __/ // /
\\___/\\___/_/_/_/_/\\__/\\_, / 
                     /___/  ${version}

`;
const usageText = `
usage:
  comity <command>

  commands can be:

  dev:      used to start the development server
  build:    used to build the code for production
  help:     used to print the usage guide
`;
const __dirname = fileURLToPath(new URL('.', import.meta.url));

program.name('comity').description('Comity').version(version);

program.argument('<command>', 'Command').action(async (command: string) => {
  console.log(ascii);

  switch (command) {
    case 'dev':
      const server = await createServer({
        configFile: 'comity.ssr.ts',
      });

      await server.listen();

      server.printUrls();
      server.bindCLIShortcuts({ print: true });
      break;

    case 'build':
      buildAll();
      break;

    case 'help':
      usage();
      break;

    default:
      console.log('Unknown command');
      break;
  }
});

const usage = () => {
  console.log(usageText);
};

const buildAll = async () => {
  try {
    // SSR Build
    console.log('📦 Running SSR Build...');
    await build({
      configFile: 'comity.ssr.ts',
    });

    // Client Build (after SSR)
    console.log('📦 Running Client Build...');
    await build({
      configFile: 'comity.client.ts',
    });

    console.log('✅ Builds completed successfully.');
  } catch (error) {
    console.error('❌ Error during build:', error);
    process.exit(1);
  }
};

if (process.argv.length !== 3) {
  usage();
}

program.parse(process.argv);
