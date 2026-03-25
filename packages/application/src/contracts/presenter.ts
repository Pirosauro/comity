import type { HtmlLayoutCollector } from "@comity/html";
import type { Locale, Translator } from "@comity/i18n";

/**
 * Context provided to presenters during the rendering process, containing necessary information and utilities for rendering views.
 */
export interface PresenterContext {
  /** The HTML layout collector used to gather layout information during rendering. */
  readonly html: HtmlLayoutCollector;

  /** The locale information for the current rendering context. */
  readonly locale: Locale;

  /** The translator utility for the current rendering context. */
  readonly translator: Translator;
}
