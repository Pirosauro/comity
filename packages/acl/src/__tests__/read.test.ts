import { describe, it, expect, vi, beforeEach } from "vitest";
import { readWithAcl } from "../read.js";
import type { AclAdapter, AclFieldListValidator } from "../types.js";
import { ForbiddenError, NotFoundError } from "@comity/core/errors";

describe("readWithAcl", () => {
  const mockAcl: AclAdapter<any> = {
    resourceType: "TestResource",
    filterReadableFields: vi.fn(),
    filterWritableFields: vi.fn(),
    can: vi.fn(),
  };

  const mockRead = vi.fn();
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

  it("should return allowed fields when entity exists and is readable", async () => {
    const resource = { id: "1", name: "test" };
    const entity = {
      id: "1",
      name: "test",
      email: "test@example.com",
      password: "secret",
    };

    vi.mocked(mockAcl.filterReadableFields).mockReturnValue([
      "id",
      "name",
      "email",
    ]);
    vi.mocked(mockAcl.can).mockReturnValue(true);
    mockRead.mockResolvedValue(entity);

    const result = await readWithAcl({
      acl: mockAcl,
      resource,
      requestedFields: ["id", "name", "email"],
      fieldsValidator,
      read: mockRead,
    });

    expect(result).toEqual({
      id: "1",
      name: "test",
      email: "test@example.com",
    });
    expect(mockAcl.filterReadableFields).toHaveBeenCalledWith(
      "read",
      resource,
      ["id", "name", "email"]
    );
    expect(mockRead).toHaveBeenCalledWith(["id", "name", "email"]);
    expect(mockAcl.can).toHaveBeenCalledWith("read", entity);
  });

  it("should throw NotFoundError when entity does not exist", async () => {
    const resource = { id: "1", name: "test" };

    vi.mocked(mockAcl.filterReadableFields).mockReturnValue(["id", "name"]);
    mockRead.mockResolvedValue(null);

    await expect(
      readWithAcl({
        acl: mockAcl,
        resource,
        requestedFields: ["id", "name"],
        fieldsValidator,
        read: mockRead,
      })
    ).rejects.toThrow(NotFoundError);
  });

  it("should throw ForbiddenError when entity exists but is not readable", async () => {
    const resource = { id: "1", name: "test" };
    const entity = { id: "1", name: "test", email: "test@example.com" };

    vi.mocked(mockAcl.filterReadableFields).mockReturnValue(["id", "name"]);
    vi.mocked(mockAcl.can).mockReturnValue(false);
    mockRead.mockResolvedValue(entity);

    await expect(
      readWithAcl({
        acl: mockAcl,
        resource,
        requestedFields: ["id", "name"],
        fieldsValidator,
        read: mockRead,
      })
    ).rejects.toThrow(ForbiddenError);
  });

  it("should merge mandatory columns with requested columns", async () => {
    const resource = { id: "1", name: "test" };
    const entity = { id: "1", name: "test", email: "test@example.com" };

    vi.mocked(mockAcl.filterReadableFields).mockReturnValue(["name"]);
    vi.mocked(mockAcl.can).mockReturnValue(true);
    mockRead.mockResolvedValue(entity);

    const result = await readWithAcl({
      acl: mockAcl,
      resource,
      requestedFields: ["name"],
      requiredFields: ["id"],
      fieldsValidator,
      read: mockRead,
    });

    expect(mockRead).toHaveBeenCalledWith(["name", "id"]);
    expect(result).toEqual({ name: "test" });
  });

  it("should use all columns when requestedColumns is undefined", async () => {
    const resource = { id: "1", name: "test" };
    const entity = { id: "1", name: "test", email: "test@example.com" };

    vi.mocked(mockAcl.filterReadableFields).mockReturnValue(["id", "name"]);
    vi.mocked(mockAcl.can).mockReturnValue(true);
    mockRead.mockResolvedValue(entity);

    const result = await readWithAcl({
      acl: mockAcl,
      resource,
      fieldsValidator,
      read: mockRead,
    });

    expect(mockAcl.filterReadableFields).toHaveBeenCalledWith(
      "read",
      resource,
      []
    );
    expect(result).toEqual({ id: "1", name: "test" });
  });

  it("should deduplicate mandatory and allowed columns", async () => {
    const resource = { id: "1", name: "test" };
    const entity = { id: "1", name: "test", email: "test@example.com" };

    vi.mocked(mockAcl.filterReadableFields).mockReturnValue(["id", "name"]);
    vi.mocked(mockAcl.can).mockReturnValue(true);
    mockRead.mockResolvedValue(entity);

    await readWithAcl({
      acl: mockAcl,
      resource,
      requestedFields: ["id", "name"],
      requiredFields: ["id"],
      fieldsValidator,
      read: mockRead,
    });

    const callArgs = mockRead.mock.calls[0][0];
    expect(callArgs).toEqual(["id", "name"]);
  });

  it("should include correct metadata in NotFoundError", async () => {
    const resource = { id: "123", name: "test" };

    vi.mocked(mockAcl.filterReadableFields).mockReturnValue(["id", "name"]);
    mockRead.mockResolvedValue(null);

    try {
      await readWithAcl({
        acl: mockAcl,
        resource,
        requestedFields: ["id", "name"],
        fieldsValidator,
        read: mockRead,
      });
      expect.fail("Should have thrown NotFoundError");
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
      expect((error as NotFoundError).meta.action).toBe("read");
      expect((error as NotFoundError).meta.subject).toBe("TestResource");
      expect((error as NotFoundError).meta.id).toBe("123");
      expect((error as NotFoundError).meta.fields).toEqual(["id", "name"]);
    }
  });

  it("should include correct metadata in ForbiddenError", async () => {
    const resource = { id: "123", name: "test" };
    const entity = { id: "123", name: "test" };

    vi.mocked(mockAcl.filterReadableFields).mockReturnValue(["id"]);
    vi.mocked(mockAcl.can).mockReturnValue(false);
    mockRead.mockResolvedValue(entity);

    try {
      await readWithAcl({
        acl: mockAcl,
        resource,
        requestedFields: ["id"],
        fieldsValidator,
        read: mockRead,
      });
      expect.fail("Should have thrown ForbiddenError");
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenError);
      expect((error as ForbiddenError).meta.action).toBe("read");
      expect((error as ForbiddenError).meta.subject).toBe("TestResource");
      expect((error as ForbiddenError).meta.id).toBe("123");
      expect((error as ForbiddenError).meta.fields).toEqual(["id"]);
    }
  });
});
