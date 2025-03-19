/* jsxImportSource vue */
import { CSSProperties, FunctionalComponent } from 'vue';
import { vueRenderer } from '@comity/vue';

interface Props {
  title: string;
}

type Emit = {};

const Html: FunctionalComponent<Props, Emit> = (props, { slots }) => {
  const { title } = props;
  const children = slots.default?.() || [];

  return (
    <html lang="en">
      <head>
        <title>{title}</title>
      </head>
      <body>{children}</body>
      {import.meta.env.PROD ? (
        <script type="module" src="/static/client.js" defer async></script>
      ) : (
        <script type="module" src="/src/client.ts" defer async></script>
      )}
    </html>
  );
};

export const renderer = vueRenderer(Html);
