import type { Optional, Plugin } from '@envelop/core';

export type Options = {
  plugins: Optional<Plugin>[];
  enableInternalTracing?: boolean;
  validationRules?: ReadonlyArray<ValidationRule>;
};

export interface GraphQLParams {
  query: string | null;
  variables: { readonly [name: string]: unknown } | null;
  operationName: string | null;
  raw: boolean;
}
