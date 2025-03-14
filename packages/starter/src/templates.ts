import { readdirSync } from 'node:fs';
import { join } from 'node:path';

export const getTemplates = () => {
  // const files = readdirSync(join(__dirname, 'templates'));
  return [
    {
      name: 'Minimal',
      value: 'minimal',
      description:
        'A minimal template using Hono and Vite, perfect for small projects.',
    },
    {
      name: 'React',
      value: 'react',
      description:
        'A template with React, a powerful library for building user interfaces efficiently and flexibly.',
    },
    {
      name: 'GraphQL',
      value: 'graphql',
      description:
        'A template with GraphQL, a query language for APIs that enables efficient data fetching and manipulation.',
    },
  ];
};
