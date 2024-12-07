import { GraphQLError, GraphQLFormattedError } from 'graphql';

/**
 * Check if it is an object
 *
 * @param {any} obj
 * @returns {boolean}
 */
const isObject = (obj: any): boolean => {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
};

/**
 * Parse error
 *
 * @param {any} error
 * @returns {Record<string, any>}
 */
const parseError = (error: any): Record<string, any> => {
  const props: Record<string, any> = {};

  Object.getOwnPropertyNames(error).forEach((key) => {
    props[key] = isObject(error[key]) ? parseError(error[key]) : error[key];
  }, error);

  return props;
};

/**
 * Service error
 */
export class ServiceError extends AggregateError {
  public constructor(
    message: string,
    errors: readonly GraphQLError[] | readonly GraphQLFormattedError[] = []
  ) {
    super(errors, message);
  }

  toString() {
    return this.message;
  }

  toJSON() {
    return {
      message: this.message,
      errors: this.errors.map(parseError),
    };
  }
}
