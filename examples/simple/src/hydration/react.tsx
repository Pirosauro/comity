import type { ComponentType } from "react";

import { createElement } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";

export type ReactIslandMode = "hydrate" | "client-only";

export function reactIsland<Props extends {}>(
  component: ComponentType<Props>,
  options?: {
    mode?: ReactIslandMode;
  },
) {
  const mode = options?.mode ?? "hydrate";

  return async function islandHydrate(
    props: Props,
    elem: HTMLElement,
  ): Promise<void> {
    if (mode === "client-only") {
      createRoot(elem).render(
        createElement<Props>(component, props as Props)
      );

      return;
    }

    // default: hydrate existing SSR markup
    hydrateRoot(elem, createElement<Props>(component, props as Props));
  };
}