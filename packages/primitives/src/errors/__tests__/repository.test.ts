import { describe, expect, it } from "vitest";
import { RepositoryError, RepositoryErrorReason } from "../repository.js";

describe("RepositoryError", () => {
  it.each([
    ["invalid_data", "Invalid data", 422],
    ["access_denied", "Access denied", 403],
    ["service_unavailable", "Service unavailable", 503],
    ["protocol_error", "Protocol error", 502],
    ["unknown", "Unknown error", 500],
  ] as const)(
    "maps %s to the expected message and default http status",
    (reason, message, httpStatus) => {
      const error = new RepositoryError(reason, {
        details: {
          repository: "catalog",
          operation: "list",
        },
      });

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(message);
      expect(error.code).toBe(`repository:${reason}`);
      expect(error.meta.httpStatus).toBe(httpStatus);
      expect(error.meta.reason).toBe(reason);
      expect(error.meta.details).toEqual({
        repository: "catalog",
        operation: "list",
      });
    }
  );

  it("preserves provided metadata while keeping the reason stable", () => {
    const error = new RepositoryError("protocol_error", {
      httpStatus: 599,
      details: {
        repository: "catalog",
        operation: "get",
      },
    });

    expect(error.code).toBe("repository:protocol_error");
    expect(error.meta.reason).toBe("protocol_error");
    expect(error.meta.httpStatus).toBe(599);
    expect(error.meta.details).toEqual({
      repository: "catalog",
      operation: "get",
    });
  });

  it("uses a namespaced code for every reason", () => {
    const reasons: RepositoryErrorReason[] = [
      "invalid_data",
      "access_denied",
      "service_unavailable",
      "protocol_error",
      "unknown",
    ];

    for (const reason of reasons) {
      const error = new RepositoryError(reason);

      expect(error.code).toBe(`repository:${reason}`);
    }
  });

  it("always exposes the constructor reason even when metadata contains conflicting fields", () => {
    const error = new RepositoryError("access_denied", {
      httpStatus: 401,
      details: {
        repository: "catalog",
        operation: "delete",
      },
    });

    expect(error.meta.reason).toBe("access_denied");
    expect(error.code).toBe("repository:access_denied");
    expect(error.message).toBe("Access denied");
  });
});
