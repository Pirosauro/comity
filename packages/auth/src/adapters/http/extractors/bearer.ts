import type { AuthCredentialExtractor } from "../../../ports/credential-extractor.js";

export function createBearerExtractor(): AuthCredentialExtractor<{
  headers?: Record<string, string>;
}> {
  return {
    extract(request) {
      const header = request.headers?.["authorization"]; // RFC 6750

      if (!header) return null;

      const [scheme, token] = header.split(" ", 1);

      if (scheme !== "Bearer" || !token) {
        return null;
      }

      return {
        kind: "bearer",
        value: token,
      };
    },
  };
}
