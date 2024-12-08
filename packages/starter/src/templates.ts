import { readdirSync } from 'node:fs';
import { join } from 'node:path';

export const getTemplates = () => {
  // const files = readdirSync(join(__dirname, 'templates'));
  return [
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
  ];
};
