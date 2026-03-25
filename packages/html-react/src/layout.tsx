import type { HtmlLayoutCollector } from "@comity/html";
import type { PropsWithChildren } from "react";

import { createContext } from "react";

export interface LayoutProviderProps {
  collector: HtmlLayoutCollector;
}

/**
 * Provides the layout collector to the React component tree.
 */
export function LayoutProvider({ collector, children }: PropsWithChildren<LayoutProviderProps>) {
  return <LayoutContext.Provider value={collector}>{children}</LayoutContext.Provider>;
}

/** Context for the layout collector. */
export const LayoutContext = createContext<HtmlLayoutCollector | null>(null);
