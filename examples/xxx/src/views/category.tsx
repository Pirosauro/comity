import type { HtmlContract } from "../types/html.js";
import type { CategoryViewModel } from "../view-models/category.js";

import { DefaultLayout } from "../themes/default/layout.js";

export function CategoryView(props: HtmlContract<CategoryViewModel>) {
  const { name, description, meta } = props.data;

  return (
    <DefaultLayout {...meta}>
      <h1>{name}</h1>
      <p>{description}</p>
    </DefaultLayout>
  );
}
