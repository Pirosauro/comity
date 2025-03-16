import type { FC } from 'hono/jsx';

export type ClientLoad = {
  '$client:load': true;
  '$client:idle'?: undefined;
  '$client:media'?: undefined;
  '$client:none'?: undefined;
  '$client:visible'?: undefined;
};
export type ClientIdle = {
  '$client:load'?: undefined;
  '$client:idle': true;
  '$client:media'?: undefined;
  '$client:none'?: undefined;
  '$client:visible'?: undefined;
};
export type ClientMedia = {
  '$client:load'?: undefined;
  '$client:idle'?: undefined;
  '$client:media': string;
  '$client:none'?: undefined;
  '$client:visible'?: undefined;
};
export type ClientVisible = {
  '$client:load'?: undefined;
  '$client:idle'?: undefined;
  '$client:media'?: undefined;
  '$client:none'?: undefined;
  '$client:visible': true;
};

export type ClientDirective =
  | ClientLoad
  | ClientIdle
  | ClientMedia
  | ClientVisible;

export type Strategy =
  | {
      type: 'load' | 'idle' | 'visible';
    }
  | {
      type: 'media';
      value: string;
    };

export type HydrationData = {
  strategy: Strategy | undefined;
  component: string;
  props: any;
  framework: string;
};

export type HydratableComponent<P> = FC<P> & {
  filename: string;
  framework: string;
};
