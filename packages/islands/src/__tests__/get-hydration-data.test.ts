import { describe, expect, it } from 'vitest';
import { getHydrationData } from '../get-hydration-data.js';

describe('getHydrationData', () => {
  it('should return correct hydration data with $client:load strategy', () => {
    const props = {
      '$client:load': true as const,
      $component: 'TestComponent.tsx',
    };
    const expected = {
      component: 'TestComponent',
      strategy: { type: 'load' },
      props: {},
      framework: 'react',
    };

    expect(getHydrationData(props, 'react', 'TestComponent')).toEqual(expected);
  });

  it('should return correct hydration data with $client:visible strategy', () => {
    const props = {
      '$client:visible': true as const,
      $component: 'TestComponent.tsx',
    };
    const expected = {
      component: 'TestComponent',
      strategy: { type: 'visible' },
      props: {},
      framework: 'react',
    };

    expect(getHydrationData(props, 'react', 'TestComponent')).toEqual(expected);
  });

  it('should return correct hydration data with $client:media strategy', () => {
    const props = {
      '$client:media': '(max-width: 600px)',
      $component: 'TestComponent.tsx',
    };
    const expected = {
      component: 'TestComponent',
      strategy: { type: 'media', value: '(max-width: 600px)' },
      props: {},
      framework: 'react',
    };

    expect(getHydrationData(props, 'react', 'TestComponent')).toEqual(expected);
  });

  it('should return correct hydration data with $client:idle strategy', () => {
    const props = {
      '$client:idle': true as const,
      $component: 'TestComponent.tsx',
    };
    const expected = {
      component: 'TestComponent',
      strategy: { type: 'idle' },
      props: {},
      framework: 'react',
    };

    expect(getHydrationData(props, 'react', 'TestComponent')).toEqual(expected);
  });

  it('should return correct hydration data with no strategy', () => {
    const props = {};
    const expected = {
      component: 'TestComponent',
      strategy: undefined,
      props: {},
      framework: 'react',
    };

    expect(
      // @ts-expect-error
      getHydrationData(props, 'react', 'TestComponent')
    ).toEqual(expected);
  });

  it('should return default framework if not provided', () => {
    const props = {
      '$client:load': true as const,
      $component: 'TestComponent.tsx',
    };
    const expected = {
      component: 'TestComponent',
      strategy: { type: 'load' },
      props: {},
      framework: 'hono',
    };

    expect(getHydrationData(props, 'hono', 'TestComponent')).toEqual(expected);
  });
});
