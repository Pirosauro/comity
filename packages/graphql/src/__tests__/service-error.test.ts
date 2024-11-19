import { describe, expect, it } from "vitest";
import { GraphQLError, GraphQLFormattedError } from "graphql";
import { ServiceError } from "../service-error.js";

describe("ServiceError", () => {
  it("should create an instance with a message and errors", () => {
    const errors: GraphQLError[] = [
      new GraphQLError("Error 1"),
      new GraphQLError("Error 2"),
    ];
    const serviceError = new ServiceError("Service error occurred", errors);

    expect(serviceError).toBeInstanceOf(ServiceError);
    expect(serviceError.message).toBe("Service error occurred");
    expect(serviceError.errors).toEqual(errors);
  });

  it("should return the correct string representation", () => {
    const serviceError = new ServiceError("Service error occurred");

    expect(serviceError.toString()).toBe("Service error occurred");
  });

  it("should return the correct JSON representation", () => {
    const errors: GraphQLError[] = [
      new GraphQLError("Error 1"),
      new GraphQLError("Error 2"),
    ];
    const serviceError = new ServiceError("Service error occurred", errors);
    const json = serviceError.toJSON();

    expect(json).toEqual({
      message: "Service error occurred",
      errors: errors.map((error) => ({
        name: error.name,
        message: error.message,
        locations: error.locations,
        path: error.path,
        extensions: error.extensions,
        nodes: error.nodes,
        source: error.source,
        positions: error.positions,
        originalError: error.originalError,
        stack: error.stack,
      })),
    });
  });

  it("should handle empty errors array", () => {
    const serviceError = new ServiceError("Service error occurred", []);

    expect(serviceError.errors).toEqual([]);
  });

  it("should handle GraphQLFormattedError", () => {
    const errors: GraphQLFormattedError[] = [
      { message: "Formatted Error 1" },
      { message: "Formatted Error 2" },
    ];
    const serviceError = new ServiceError("Service error occurred", errors);
    const json = serviceError.toJSON();

    expect(json).toEqual({
      message: "Service error occurred",
      errors: errors.map((error) => ({
        message: error.message,
      })),
    });
  });
});
