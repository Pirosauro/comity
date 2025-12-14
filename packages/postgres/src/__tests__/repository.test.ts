import { describe, it, expect, vi } from "vitest";
import { PostgresRepository } from "../repository.js";

describe("PostgresRepository", () => {
  // Mock database service
  const mockDb = {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    transaction: vi.fn(),
    execute: vi.fn(),
  };

  class TestRepository extends PostgresRepository {
    constructor() {
      super(mockDb as any);
    }

    get testDb() {
      return this.db;
    }
  }

  it("should create a repository instance", () => {
    const repo = new TestRepository();
    expect(repo).toBeInstanceOf(PostgresRepository);
    expect(repo).toBeInstanceOf(TestRepository);
  });

  it("should provide access to the database instance", () => {
    const repo = new TestRepository();
    expect(repo.testDb).toBe(mockDb);
  });

  it("should protect the database instance from external modification", () => {
    const repo = new TestRepository();

    // The db property should be accessible but not directly assignable
    expect(() => {
      // @ts-expect-error - testing that db is readonly
      repo.db = {} as any;
    }).toThrow();
  });

  it("should allow extending and adding custom methods", () => {
    class CustomRepository extends PostgresRepository {
      findById(id: string) {
        return this.db.select().where({ id });
      }

      create(data: any) {
        return this.db.insert(data);
      }

      updateById(id: string, data: any) {
        return this.db.update(data).where({ id });
      }

      deleteById(id: string) {
        return this.db.delete().where({ id });
      }
    }

    const repo = new CustomRepository(mockDb as any);

    expect(typeof repo.findById).toBe("function");
    expect(typeof repo.create).toBe("function");
    expect(typeof repo.updateById).toBe("function");
    expect(typeof repo.deleteById).toBe("function");
  });
});
