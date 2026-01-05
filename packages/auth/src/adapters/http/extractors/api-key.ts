import type { AuthCredentialExtractor } from "../../../ports/credential-extractor.js";

export function createApiKeyExtractor(options?: {
  headerName?: string;
}): AuthCredentialExtractor<{ headers?: Record<string, string | undefined> }> {
  const headerName = options?.headerName ?? "x-api-key";

  return {
    extract(req) {
      const value = req.headers?.[headerName.toLowerCase()];

      if (!value) return null;

      return {
        kind: "api_key",
        value,
      };
    },
  };
}
