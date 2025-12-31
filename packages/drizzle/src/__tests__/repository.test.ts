import { describe, it, expect, beforeEach, vi } from "vitest";
import { Repository } from "../repository.js";
import type { DrizzleAlikeQueryBuilder } from "../types.js";

class TestRepository extends Repository<any> {
  public accessDb() {
    return this.db;
  }

  public testPaginate(
    query: Pick<DrizzleAlikeQueryBuilder, "limit" | "offset">,
    page?: number,
    limit?: number
  ) {
    return this.paginate(query, page, limit);
  }

  public testNormalizeArray<T>(data: T | T[]): T[] {
    return this.normalizeArray(data);
  }
}

describe("Repository", () => {
  let mockDb: any;
  let repository: TestRepository;

  beforeEach(() => {
    mockDb = {
      query: vi.fn(),
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    repository = new TestRepository(mockDb);
  });

  describe("constructor", () => {
    it("should create a repository with a database instance", () => {
      expect(repository).toBeInstanceOf(Repository);
    });

    it("should store the database instance", () => {
      expect(repository.accessDb()).toBe(mockDb);
    });
  });

  describe("db getter", () => {
    it("should return the database instance", () => {
      const db = repository.accessDb();
      expect(db).toBe(mockDb);
    });

    it("should allow access to database methods", () => {
      const db = repository.accessDb();
      expect(db.query).toBeDefined();
      expect(db.select).toBeDefined();
      expect(db.insert).toBeDefined();
    });
  });

  describe("paginate", () => {
    let mockQuery: Pick<DrizzleAlikeQueryBuilder, "limit" | "offset">;

    beforeEach(() => {
      mockQuery = {
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockReturnThis(),
      };
    });

    it("should apply default pagination (page 1, limit 100)", () => {
      repository.testPaginate(mockQuery);

      expect(mockQuery.offset).toHaveBeenCalledWith(0);
      expect(mockQuery.limit).toHaveBeenCalledWith(100);
    });

    it("should apply custom page and limit", () => {
      repository.testPaginate(mockQuery, 3, 50);

      expect(mockQuery.offset).toHaveBeenCalledWith(100); // (3-1) * 50
      expect(mockQuery.limit).toHaveBeenCalledWith(50);
    });

    it("should handle page 1 correctly", () => {
      repository.testPaginate(mockQuery, 1, 25);

      expect(mockQuery.offset).toHaveBeenCalledWith(0);
      expect(mockQuery.limit).toHaveBeenCalledWith(25);
    });

    it("should handle page 2 correctly", () => {
      repository.testPaginate(mockQuery, 2, 25);

      expect(mockQuery.offset).toHaveBeenCalledWith(25);
      expect(mockQuery.limit).toHaveBeenCalledWith(25);
    });

    it("should handle large page numbers", () => {
      repository.testPaginate(mockQuery, 100, 10);

      expect(mockQuery.offset).toHaveBeenCalledWith(990); // (100-1) * 10
      expect(mockQuery.limit).toHaveBeenCalledWith(10);
    });

    it("should return the query object for chaining", () => {
      const result = repository.testPaginate(mockQuery, 1, 10);
      expect(result).toBe(mockQuery);
    });

    it("should handle limit of 1", () => {
      repository.testPaginate(mockQuery, 5, 1);

      expect(mockQuery.offset).toHaveBeenCalledWith(4); // (5-1) * 1
      expect(mockQuery.limit).toHaveBeenCalledWith(1);
    });

    it("should apply only limit when provided without page", () => {
      repository.testPaginate(mockQuery, undefined, 50);

      expect(mockQuery.offset).toHaveBeenCalledWith(0);
      expect(mockQuery.limit).toHaveBeenCalledWith(50);
    });
  });

  describe("normalizeArray", () => {
    it("should return array as is", () => {
      const input = [1, 2, 3];
      const result = repository.testNormalizeArray(input);

      expect(result).toBe(input);
      expect(result).toEqual([1, 2, 3]);
    });

    it("should wrap single value in array", () => {
      const result = repository.testNormalizeArray(42);

      expect(result).toEqual([42]);
      expect(Array.isArray(result)).toBe(true);
    });

    it("should handle string values", () => {
      const result = repository.testNormalizeArray("test");

      expect(result).toEqual(["test"]);
    });

    it("should handle object values", () => {
      const obj = { id: 1, name: "test" };
      const result = repository.testNormalizeArray(obj);

      expect(result).toEqual([obj]);
      expect(result[0]).toBe(obj);
    });

    it("should handle empty array", () => {
      const input: any[] = [];
      const result = repository.testNormalizeArray(input);

      expect(result).toBe(input);
      expect(result).toEqual([]);
    });

    it("should handle null value", () => {
      const result = repository.testNormalizeArray(null);

      expect(result).toEqual([null]);
    });

    it("should handle undefined value", () => {
      const result = repository.testNormalizeArray(undefined);

      expect(result).toEqual([undefined]);
    });

    it("should handle boolean values", () => {
      expect(repository.testNormalizeArray(true)).toEqual([true]);
      expect(repository.testNormalizeArray(false)).toEqual([false]);
    });

    it("should handle array of objects", () => {
      const input = [{ id: 1 }, { id: 2 }];
      const result = repository.testNormalizeArray(input);

      expect(result).toBe(input);
      expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });
  });
});
