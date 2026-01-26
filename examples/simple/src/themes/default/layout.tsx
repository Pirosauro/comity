import type { ReactNode } from "react";

export interface LayoutProps {
  readonly title: string;

  readonly children: ReactNode;
}

export function DefaultLayout({ title, children }: LayoutProps) {
  return (
    <html>
      <head>
        <title>{title}</title>
      </head>
      <body>{children}</body>
      <script type="module" src="/src/client.js"></script>
    </html>
  );
}
