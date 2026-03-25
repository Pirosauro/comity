import { useContext } from "react";
import { LayoutContext } from "./layout.js";

/**
 * Hook to access the layout collector from the context. Must be used inside a LayoutProvider.
 *
 * @returns The layout collector from the context, or null if not available.
 */
export function useLayout() {
  const ctx = useContext(LayoutContext);

  if (!ctx) {
    console.warn("useLayout must be used inside LayoutProvider");

    return null;
  }

  return ctx;
}
