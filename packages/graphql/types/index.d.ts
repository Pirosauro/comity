import type {
  GraphQLSchema,
  DocumentNode,
  ValidationRule,
  FormattedExecutionResult,
  GraphQLFormattedError,
} from "graphql";
import type { PluginsType } from "@envelop/core";

export type RootResolver<
  E extends Env = any,
  P extends string = any,
  I extends Input = {}
> = (c: Context<E, P, I>) => Promise<unknown> | unknown;

export type Options<
  E extends Env = any,
  P extends string = any,
  I extends Input = {}
> = {
  schema: GraphQLSchema;
  rootResolver?: RootResolver<E, P, I>;
  pretty?: boolean;
  validationRules?: ReadonlyArray<ValidationRule>;
  plugins?: PluginsType;
};

export interface GraphQLParams {
  query: string | null;
  variables: { readonly [name: string]: unknown } | null;
  operationName: string | null;
  raw: boolean;
}
