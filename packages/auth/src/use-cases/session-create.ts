import type { AuthSession } from "../contracts/session.js";

/**
 * Create Session Use Case Input
 */
export interface CreateSessionInput {
  /**  */
  identityId?: string;

  /**  */
  providerId?: string;

  /**  */
  methods: string[];

  /**  */
  scopes?: string[];

  /**  */
  transport: string;

  /**  */
  context?: {
    /**  */
    userAgent?: string;

    /**  */
    ipAddress?: string;

    /**  */
    deviceId?: string;

    /**  */
    channel?: string;
  };
}

/**
 * Create Session
 */
export interface CreateSession {
  /**
   *
   */
  execute(input: CreateSessionInput): AuthSession;
}
