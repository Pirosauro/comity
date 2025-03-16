import type { FC } from 'hono/jsx';
import { describe, it, expect, vi } from 'vitest';
import { withHydration } from '../with-hydration.js';

describe('withHydration', () => {
  it('should add filename and framework properties to the component', () => {
    const Component: any = () => null;
    const framework = 'react';
    const filename = 'TestComponent.tsx';

    const HydratedComponent = withHydration(Component, framework, filename);

    expect(Component.filename).toBe(filename);
    expect(Component.framework).toBe(framework);
  });

  it('should not allow modification of filename and framework properties', () => {
    const Component: any = () => null;
    const framework = 'react';
    const filename = 'TestComponent.tsx';

    const HydratedComponent = withHydration(Component, framework, filename);

    expect(() => {
      Component.filename = 'NewFilename.tsx';
    }).toThrowError(TypeError);

    expect(() => {
      Component.framework = 'vue';
    }).toThrowError(TypeError);
  });
});
