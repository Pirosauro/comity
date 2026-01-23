import type { HttpError } from "./error.js";

/**
 * HTTP result type.
 */
export type HttpResult =
  | { 
    /** Success result */
    ok: true; 

    /** Response */
    response: HttpResponse 
  }
  | { 
    /** Failure result */
    ok: false; 
    
    /** Error */
    error: HttpError 
  };

/**
 * HTTP response interface.
 */
export interface HttpResponse {
  /** HTTP status code */
  status: number;

  /** HTTP headers */
  headers?: Record<string, string>;
  
  /** HTTP body */
  body?: unknown;
}