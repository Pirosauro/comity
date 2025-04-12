import type { Transpiler } from './islands.js';

export const transpiler: Transpiler = async (hash, path, name) => {
  const code = [
    `import { withHydration } from '@comity/islands';`,
    `import { ${name} as Component } from ${JSON.stringify(path)};`,
    `const HydratableComponent = withHydration(Component, ${JSON.stringify(
      hash + '.' + name
    )});`,
    `export { HydratableComponent as ${name} };`,
  ].join('\n');

  return code;
};
