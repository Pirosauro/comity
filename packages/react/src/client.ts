import type { Attributes, FC } from "react";
import { createElement } from "react";
import { hydrateRoot } from "react-dom/client";

export function render(
  component: FC,
  props: Attributes,
  element: HTMLElement
): void {
  const target = createElement(component, props);

  hydrateRoot(element, target);
}
