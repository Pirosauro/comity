import type { ReactElement } from "react";

/**
 * React HTML template function
 */
export interface ReactHtmlTemplate<Props> {
  (props: Props): ReactElement;
}

/**
 * React Streaming HTML Render Options
 */
export interface ReactStreamingHtmlRenderOptions {
  /** HTML templates */
  templates: {
    /** Page layout */
    default: ReactHtmlTemplate<Record<string, unknown>>;

    /** Error layout */
    error: ReactHtmlTemplate<Record<string, unknown>>;
  };

  /** Timeout in milliseconds */
  timeout?: number;

  /** Error handler */
  onError?: (error: unknown) => void;
}

/**
 * React Static HTML Render Options
 */
export interface ReactStaticHtmlRenderOptions {
  /** HTML templates */
  templates: {
    /** Page layout */
    default: ReactHtmlTemplate<Record<string, unknown>>;

    /** Error layout */
    error: ReactHtmlTemplate<Record<string, unknown>>;
  };
}
