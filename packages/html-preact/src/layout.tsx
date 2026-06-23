import type { HtmlLayoutCollector } from "@comity/html";
import type { ComponentChildren } from "preact";

import { createContext } from "preact";

export interface LayoutProviderProps {
  collector: HtmlLayoutCollector;

  children?: ComponentChildren;
}

/**
 * Provides the layout collector to the Preact component tree.
 */
export function LayoutProvider({ collector, children }: LayoutProviderProps) {
  return <LayoutContext.Provider value={collector}>{children}</LayoutContext.Provider>;
}

/** Context for the layout collector. */
export const LayoutContext = createContext<HtmlLayoutCollector | null>(null);
