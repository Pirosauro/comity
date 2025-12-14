import type { FunctionComponent, PropsWithChildren, ReactNode } from "react";

export const Root: FunctionComponent<
  PropsWithChildren<{
    title?: string;
    meta?: ReactNode[];
    nonce?: string;
  }>
> = ({ children, title, meta, nonce }) => {
  return (
    <html lang="it">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        {meta}
        {import.meta.env.PROD && (
          <link
            rel="stylesheet"
            href="/static/assets/client.css"
            media="all"
            type="text/css"
          />
        )}
      </head>
      <body>{children}</body>
      {import.meta.env.PROD ? (
        <script type="module" src="/static/client.js" />
      ) : (
        <script type="module" src="/src/client.ts" />
      )}
    </html>
  );
};

export default Root;
