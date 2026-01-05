import type { AuthCredentialExtractor } from "../../../ports/credential-extractor.js";

export function createCookieExtractor(options: {
  cookieName: string;
}): AuthCredentialExtractor<{ cookies?: Record<string, string> }> {
  return {
    extract(request) {
      const value = request.cookies?.[options.cookieName];

      if (!value) return null;

      return {
        kind: "cookie",
        value,
      };
    },
  };
}
