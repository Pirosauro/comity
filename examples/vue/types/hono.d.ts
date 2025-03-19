import type { Handler } from 'hono';
import type { DefineComponent, FunctionalComponent } from 'vue';

type Props = {
  title: string;
  lang?: string;
};

declare module 'hono' {
  interface DefaultRenderer {
    (children: any, props?: Props): Response | Promise<Response>;
  }

  interface ContextRenderer {
    (children: any, props: Props): Response | Promise<Response>;
  }
}
