import type { GraphQLParams } from '../types';
import { parseRequest } from './parse-request.js';

export const getGraphQLParams = async (
  request: Request
): Promise<GraphQLParams> => {
  const data: Partial<GraphQLParams> = await parseRequest(request);

  // GraphQL Query string
  if (typeof data.query !== 'string') {
    data.query = undefined;
  }

  // Parse the variables if needed
  if (typeof data.variables === 'string') {
    try {
      data.variables = JSON.parse(data.variables);
    } catch {
      throw Error('Variables are invalid JSON.');
    }
  } else if (typeof data.variables !== 'object') {
    data.variables = undefined;
  }

  // Name of GraphQL operation to execute
  if (typeof data.operationName !== 'string') {
    data.operationName = undefined;
  }

  const params: GraphQLParams = {
    query: data.query || null,
    variables: data.variables || null,
    operationName: data.operationName || null,
    raw: data.raw ? true : false,
  };

  return params;
};
