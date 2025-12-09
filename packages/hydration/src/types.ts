export type HydrationModuleContext = {};

export type HydrationModuleEvents = {};

export type HydrationModuleHooks = {
  /**
   * Hook triggered after the Hydration service has been initialized.
   */
  "@comity/hydration:initialized": void;
};

export type HydrationModuleOptions = {};

export interface HydrationAdapter {
  name: string;
  // metadata
  version?: string;
  supports?: {
    streaming: boolean;
    hydration: boolean;
    ssr: boolean;
    islands: boolean;
  };
}

export type ClientLoad = {
  "$client:load": true;
  "$client:idle"?: undefined;
  "$client:media"?: undefined;
  "$client:none"?: undefined;
  "$client:visible"?: undefined;
};
export type ClientIdle = {
  "$client:load"?: undefined;
  "$client:idle": true;
  "$client:media"?: undefined;
  "$client:none"?: undefined;
  "$client:visible"?: undefined;
};
export type ClientMedia = {
  "$client:load"?: undefined;
  "$client:idle"?: undefined;
  "$client:media": string;
  "$client:none"?: undefined;
  "$client:visible"?: undefined;
};
export type ClientVisible = {
  "$client:load"?: undefined;
  "$client:idle"?: undefined;
  "$client:media"?: undefined;
  "$client:none"?: undefined;
  "$client:visible": true;
};

export type ClientDirective =
  | ClientLoad
  | ClientIdle
  | ClientMedia
  | ClientVisible;

export type Strategy = {
  type: "load" | "idle" | "media" | "visible";
  value?: string;
};

export type HydrationData<P = any> = {
  name: string;
  strategy: Strategy | undefined;
  props: P;
  framework: string;
};
