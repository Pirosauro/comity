import { GraphQLError, GraphQLFormattedError } from "graphql";

// export class ServiceError extends GraphQLError {
//   extensions: GraphQLErrorExtensions;

//   constructor(
//     message: string,
//     extensions: {
//       code: string;
//       statusCode: number;
//       details?: Record<string, any>;
//     },
//     error?: Error
//   ) {
//     super(message, { originalError: error });

//     this.extensions = extensions;
//     this.cause = error;
//   }

//   toString() {
//     return `Name: ${this.name}, Age: ${this.age}`;
//   }

//   toJSON() {
//     return {
//       message: this.message,
//       extensions: this.extensions,
//       cause: this.cause,
//     };
//   }
// }

const isObject = (obj: any) => {
  return typeof obj === "object" && obj !== null && !Array.isArray(obj);
};

const parseError = (error: any) => {
  const props: Record<string, any> = {};

  Object.getOwnPropertyNames(error).forEach((key) => {
    props[key] = isObject(error[key]) ? parseError(error[key]) : error[key];
  }, error);

  return props;
};

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
