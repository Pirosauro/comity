import type { Logger } from "pino";

export type CliOption = {
  flags: string;
  description?: string;
  default?: any;
};

export type CliCommand = {
  name: string;
  description: string;
  action: (...args: any[]) => void | Promise<void>;
  options?: CliOption[];
};

export type CliHook = {
  (context: any): void | Promise<void>;
};

export type CliPlugin = {
  name: string;
  version: string;
  commands?: CliCommand[];
  hooks?: {
    [hookName: string]: CliHook;
  };
};

export interface CliConfig {
  logger?: Logger;
  plugins?: CliPlugin[];
  hooks?: {
    [hookName: string]: CliHook;
  };
}

export interface CliContextInterface {
  registerCommand: (command: CliCommand) => void;
  registerHook: (name: string, hook: CliHook) => void;
  executeHook: (name: string, context?: any) => Promise<void>;
}
