import type { PropsWithChildren } from "react";
import { HtmlMeta } from "../../types/html.js";

export interface LayoutProps extends HtmlMeta {}

export function DefaultLayout({
  title,
  keywords,
  description,
  children,
}: PropsWithChildren<LayoutProps>) {
  return (
    <html>
      <head>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        {keywords && <meta name="keywords" content={keywords.join(", ")} />}
      </head>
      <body>{children}</body>
      <script type="module" src="/src/client.js"></script>
    </html>
  );
}
