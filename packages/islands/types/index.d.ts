export type Render<C, P> = (Component: C, props: P, HTMLElement) => JSX.Element;

export type HydratableComponent<P> = Component<P> & {
  name?: string;
  framework?: 'hono' | 'preact' | 'react' | 'solid' | 'vue';
};

export type ClientLoad = {
  'client:load': true;
  'client:idle'?: undefined;
  'client:media'?: undefined;
  'client:none'?: undefined;
  'client:visible'?: undefined;
};
export type ClientIdle = {
  'client:load'?: undefined;
  'client:idle': true;
  'client:media'?: undefined;
  'client:none'?: undefined;
  'client:visible'?: undefined;
};
export type ClientMedia = {
  'client:load'?: undefined;
  'client:idle'?: undefined;
  'client:media': string;
  'client:none'?: undefined;
  'client:visible'?: undefined;
};
export type ClientVisible = {
  'client:load'?: undefined;
  'client:idle'?: undefined;
  'client:media'?: undefined;
  'client:none'?: undefined;
  'client:visible': true;
};

export type ClientDirective =
  | ClientLoad
  | ClientIdle
  | ClientMedia
  | ClientVisible;

export type Strategy = {
  type: 'load' | 'idle' | 'media' | 'visible';
  value?: string;
};

export type HydrationData = {
  name: string;
  strategy: Strategy | undefined;
  props: any;
  framework: 'hono' | 'preact' | 'react' | 'solid' | 'vue';
};

export type IslandOptions = {
  tag?: string;
};
