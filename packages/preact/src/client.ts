import type { Attributes, FunctionComponent } from "preact";
import { h, hydrate } from "preact";

export function render(
  component: FunctionComponent,
  props: Attributes,
  element: HTMLElement
): void {
  const target = h(component, props);

  hydrate(target, element);
}
