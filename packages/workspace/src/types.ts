import type { WorkspaceResultColumns } from "./repositories/workspace.js";

export interface WorkspaceModuleOptions {
  // Optional mapping for host -> workspace id
  websites?: Record<string, string | null>;
}

export interface WorkspaceMiddlewareOptions extends WorkspaceModuleOptions {}

export interface WorkspaceModuleHonoContext {
  Variables: {
    workspace?: WorkspaceResultColumns;
  };
}

export interface WorkspaceModuleEvents {
  "@comity/workspace:resolved": {
    workspace: WorkspaceResultColumns;
    domain: string;
  };
}
