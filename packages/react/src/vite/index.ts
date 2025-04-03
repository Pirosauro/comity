import type { Transpiler } from '@comity/islands/vite';

const transpiler: Transpiler = async (hash, path, name) => {
  const code = [
    `import { withHydration } from '@comity/react';`,
    `import { ${name} as Component } from ${JSON.stringify(path)};`,
    `const HydratableComponent = withHydration(Component, ${JSON.stringify(
      hash + '.' + name
    )});`,
    `export { HydratableComponent as ${name} };`,
  ].join('\n');

  return code;
};

export default transpiler;
