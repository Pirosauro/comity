import { describe, it, expect } from 'vitest';
import { getTemplates } from '../templates.js';

describe('getTemplates', () => {
  it('should return an array of templates', () => {
    const templates = getTemplates();

    expect(Array.isArray(templates)).toBe(true);
  });

  it('should return the correct templates', () => {
    const templates = getTemplates();

    expect(templates).toEqual([
      {
        name: 'React',
        value: 'react',
        description:
          'React is a declarative, efficient, and flexible JavaScript library for building user interfaces.',
      },
      {
        name: 'GraphQL',
        value: 'graphql',
        description:
          'GraphQL is a query language for APIs and a runtime for executing those queries by using a type system you define for your data.',
      },
    ]);
  });
});
