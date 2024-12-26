import type { MiddlewareHandler, Context, Next } from 'hono';
import type { Options } from '../types';
import { envelop } from '@envelop/core';
import { getGraphQLParams } from './get-graphql-params.js';

export const graphqlHandler = ({
  plugins,
  enableInternalTracing = false,
}: Options): MiddlewareHandler => {
  const getEnveloped = envelop({
    plugins,
    enableInternalTracing,
  });

  return async (c: Context, next: Next) => {
    // GraphQL HTTP only supports GET and POST methods.
    if (c.req.method !== 'GET' && c.req.method !== 'POST') {
      return next();
    }

    const { parse, validate, contextFactory, execute, schema } = getEnveloped({
      req: c.req,
    });

    const { query, variables, operationName } = await getGraphQLParams(
      c.req.raw
    );
    const document = parse(query);
    // validate the document against the schema
    const validationErrors = validate(schema, document);

    if (validationErrors.length > 0) {
      return c.json({
        data: null,
        errors: validationErrors,
      });
    }

    // if (c.req.method === 'GET') {
    //   // Determine if this GET request will perform a non-query.
    //   const operationAST = getOperationAST(documentAST, operationName);

    //   if (operationAST && operationAST.operation !== 'query') {
    //     // Otherwise, report a 405: Method Not Allowed error.
    //     return c.json(
    //       new ServiceError(
    //         `Can only perform a ${operationAST.operation} operation from a POST request.`
    //       ),
    //       405,
    //       { Allow: 'POST' }
    //     );
    //   }
    // }

    const context = await contextFactory();
    const result = await execute({
      schema,
      document,
      contextValue: context,
      variableValues: variables,
      operationName: operationName,
    });

    return c.json(result);
  };
};
