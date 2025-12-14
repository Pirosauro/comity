import type { ApplicationModuleOptions } from "@comity/application";
import type { AuthModuleOptions } from "@comity/auth";
import type { GraphQLModuleOptions } from "@comity/graphql";
import type { HydrationModuleOptions } from "@comity/hydration";
import type { LoggerModuleOptions } from "@comity/logger";
import type { ReactModuleOptions } from "@comity/react";

export type ApplicationOptions = {
  "@comity/application"?: ApplicationModuleOptions;
  "@comity/auth"?: AuthModuleOptions;
  "@comity/graphql"?: GraphQLModuleOptions;
  "@comity/hydration"?: HydrationModuleOptions;
  "@comity/logger"?: LoggerModuleOptions;
  "@comity/react"?: ReactModuleOptions;
};
