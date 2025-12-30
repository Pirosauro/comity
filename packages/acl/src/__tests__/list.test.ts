import { describe, it, expect, vi, beforeEach } from "vitest";
import { listWithAcl } from "../list.js";
import type { AclAdapter, AclFieldListValidator } from "../types.js";

describe("listWithAcl", () => {
  const mockAcl: AclAdapter<any> = {
    resourceType: "TestResource",
    filterReadableFields: vi.fn(),
    filterWritableFields: vi.fn(),
    can: vi.fn(),
  };

  const mockList = vi.fn();
  const allowedFields = ["id", "name", "email", "password"] as const;
  const fieldsValidator: AclFieldListValidator<readonly string[]> = (input) => {
    const validated = input.filter((field) =>
      allowedFields.includes(field as any)
    );
    if (validated.length !== input.length) {
      throw new Error("Invalid fields");
    }
    return validated;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return filtered entities with allowed fields", async () => {
    const entities = [
      {
        id: "1",
        name: "user1",
        email: "user1@example.com",
        password: "secret1",
      },
      {
        id: "2",
        name: "user2",
        email: "user2@example.com",
        password: "secret2",
      },
    ];

    vi.mocked(mockAcl.filterReadableFields).mockReturnValue([
      "id",
      "name",
      "email",
    ]);
    vi.mocked(mockAcl.can).mockReturnValue(true);
    mockList.mockResolvedValue(entities);

    const result = await listWithAcl({
      acl: mockAcl,
      requestedFields: ["id", "name", "email"],
      fieldsValidator,
      list: mockList,
    });

    expect(result).toEqual([
      { id: "1", name: "user1", email: "user1@example.com" },
      { id: "2", name: "user2", email: "user2@example.com" },
    ]);
    expect(mockList).toHaveBeenCalledWith(["id", "name", "email"]);
  });

  it("should filter out entities that fail ACL check", async () => {
    const entities = [
      { id: "1", name: "user1", email: "user1@example.com" },
      { id: "2", name: "user2", email: "user2@example.com" },
      { id: "3", name: "user3", email: "user3@example.com" },
    ];

    vi.mocked(mockAcl.filterReadableFields).mockReturnValue(["id", "name"]);
    vi.mocked(mockAcl.can).mockImplementation((action, resource) => {
      return resource.id !== "2";
    });
    mockList.mockResolvedValue(entities);

    const result = await listWithAcl({
      acl: mockAcl,
      requestedFields: ["id", "name"],
      fieldsValidator,
      list: mockList,
    });

    expect(result).toEqual([
      { id: "1", name: "user1" },
      { id: "3", name: "user3" },
    ]);
  });

  it("should return empty array when no entities exist", async () => {
    vi.mocked(mockAcl.filterReadableFields).mockReturnValue(["id", "name"]);
    mockList.mockResolvedValue([]);

    const result = await listWithAcl({
      acl: mockAcl,
      requestedFields: ["id", "name"],
      fieldsValidator,
      list: mockList,
    });

    expect(result).toEqual([]);
  });

  it("should return empty array when all entities fail ACL check", async () => {
    const entities = [
      { id: "1", name: "user1" },
      { id: "2", name: "user2" },
    ];

    vi.mocked(mockAcl.filterReadableFields).mockReturnValue(["id", "name"]);
    vi.mocked(mockAcl.can).mockReturnValue(false);
    mockList.mockResolvedValue(entities);

    const result = await listWithAcl({
      acl: mockAcl,
      requestedFields: ["id", "name"],
      fieldsValidator,
      list: mockList,
    });

    expect(result).toEqual([]);
  });

  it("should merge mandatory columns with requested columns", async () => {
    const entities = [{ id: "1", name: "user1", email: "user1@example.com" }];

    vi.mocked(mockAcl.filterReadableFields).mockReturnValue(["name"]);
    vi.mocked(mockAcl.can).mockReturnValue(true);
    mockList.mockResolvedValue(entities);

    const result = await listWithAcl({
      acl: mockAcl,
      requestedFields: ["name"],
      requiredFields: ["id"],
      fieldsValidator,
      list: mockList,
    });

    expect(mockList).toHaveBeenCalledWith(["name", "id"]);
    expect(result).toEqual([{ name: "user1" }]);
  });

  it("should use all columns when requestedColumns is undefined", async () => {
    const entities = [{ id: "1", name: "user1" }];

    vi.mocked(mockAcl.filterReadableFields).mockReturnValue(["id", "name"]);
    vi.mocked(mockAcl.can).mockReturnValue(true);
    mockList.mockResolvedValue(entities);

    const result = await listWithAcl({
      acl: mockAcl,
      fieldsValidator,
      list: mockList,
    });

    expect(mockAcl.filterReadableFields).toHaveBeenCalledWith("read", {}, []);
    expect(result).toEqual([{ id: "1", name: "user1" }]);
  });

  it("should deduplicate mandatory and allowed columns", async () => {
    const entities = [{ id: "1", name: "user1" }];

    vi.mocked(mockAcl.filterReadableFields).mockReturnValue(["id", "name"]);
    vi.mocked(mockAcl.can).mockReturnValue(true);
    mockList.mockResolvedValue(entities);

    await listWithAcl({
      acl: mockAcl,
      requestedFields: ["id", "name"],
      requiredFields: ["id"],
      fieldsValidator,
      list: mockList,
    });

    const callArgs = mockList.mock.calls[0][0];
    expect(callArgs).toEqual(["id", "name"]);
  });

  it("should call filterReadableFields with empty resource object", async () => {
    const entities = [{ id: "1", name: "user1" }];

    vi.mocked(mockAcl.filterReadableFields).mockReturnValue(["id"]);
    vi.mocked(mockAcl.can).mockReturnValue(true);
    mockList.mockResolvedValue(entities);

    await listWithAcl({
      acl: mockAcl,
      requestedFields: ["id"],
      fieldsValidator,
      list: mockList,
    });

    expect(mockAcl.filterReadableFields).toHaveBeenCalledWith("read", {}, [
      "id",
    ]);
  });

  it("should handle complex filtering scenarios", async () => {
    const entities = [
      { id: "1", name: "public", email: "public@example.com" },
      { id: "2", name: "private", email: "private@example.com" },
      { id: "3", name: "semi", email: "semi@example.com" },
    ];

    vi.mocked(mockAcl.filterReadableFields).mockReturnValue(["id", "name"]);
    vi.mocked(mockAcl.can).mockImplementation((action, resource) => {
      return resource.name !== "private";
    });
    mockList.mockResolvedValue(entities);

    const result = await listWithAcl({
      acl: mockAcl,
      requestedFields: ["id", "name", "email"],
      fieldsValidator,
      list: mockList,
    });

    expect(result).toHaveLength(2);
    expect(result).toEqual([
      { id: "1", name: "public" },
      { id: "3", name: "semi" },
    ]);
  });

  it("should pass through list function errors", async () => {
    const listError = new Error("Database error");

    vi.mocked(mockAcl.filterReadableFields).mockReturnValue(["id"]);
    mockList.mockRejectedValue(listError);

    await expect(
      listWithAcl({
        acl: mockAcl,
        requestedFields: ["id"],
        fieldsValidator,
        list: mockList,
      })
    ).rejects.toThrow("Database error");
  });
});
