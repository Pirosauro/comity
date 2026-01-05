import type { AuthCredentialExtractor } from "../ports/credential-extractor.js";
import type { AuthCredential } from "../ports/credential.js";

export function composeExtractors<R, O extends Record<string, unknown> = {}>(
  ...extractors: AuthCredentialExtractor<R, O>[]
): AuthCredentialExtractor<R, O> {
  return {
    extract(context: R, options?: O): AuthCredential | null {
      for (const extractor of extractors) {
        const credential = extractor.extract(context, options);

        if (credential) return credential;
      }

      return null;
    },
  };
}
