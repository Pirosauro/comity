import type { DestinationStream, Logger, LoggerOptions } from "pino";

export type LoggerModuleOptions = DestinationStream | LoggerOptions;

export type LoggerModuleContext = {
  logger: LoggerService;
};

export type LoggerService = Pick<
  Logger,
  "fatal" | "error" | "warn" | "info" | "debug" | "trace" | "silent" | "child"
>;
