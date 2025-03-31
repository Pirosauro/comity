import type { FC } from 'react';

declare module 'virtual:comity-islands' {
  const components: Record<string, FC>;
  export = components;
}
