import { OperationBuilder } from "./operation-builder";

/**
 * QueryBuilder provides a static API for creating queries, mutations, and subscriptions.
 */
export class QueryBuilder {
  public static query<T = any>(operationName?: string): OperationBuilder<T> {
    return new OperationBuilder<T>("query", operationName);
  }

  public static mutation<T = any>(operationName?: string): OperationBuilder<T> {
    return new OperationBuilder<T>("mutation", operationName);
  }

  public static subscription<T = any>(operationName?: string): OperationBuilder<T> {
    return new OperationBuilder<T>("subscription", operationName);
  }
}
