import { describe, it, expect, vi, beforeEach } from "vitest";
import { deleteWithAcl } from "../delete.js";
import type { AclAdapter } from "../types.js";
import { ForbiddenError, NotFoundError } from "@comity/core/errors";

describe("deleteWithAcl", () => {
  const mockAcl: AclAdapter<any> = {
    resourceType: "TestResource",
    filterReadableFields: vi.fn(),
    filterWritableFields: vi.fn(),
    can: vi.fn(),
  };

  const mockDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should delete resource when acl allows and resource exists", async () => {
    const resource = { id: "1", name: "test" };

    vi.mocked(mockAcl.can).mockReturnValue(true);
    mockDelete.mockResolvedValue(true);

    await deleteWithAcl({
      acl: mockAcl,
      resource,
      delete: mockDelete,
    });

    expect(mockAcl.can).toHaveBeenCalledWith("delete", resource);
    expect(mockDelete).toHaveBeenCalledWith("1");
  });

  it("should throw ForbiddenError when acl denies", async () => {
    const resource = { id: "1", name: "test" };

    vi.mocked(mockAcl.can).mockReturnValue(false);

    await expect(
      deleteWithAcl({
        acl: mockAcl,
        resource,
        delete: mockDelete,
      })
    ).rejects.toThrow(ForbiddenError);

    expect(mockAcl.can).toHaveBeenCalledWith("delete", resource);
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it("should throw NotFoundError when delete returns false", async () => {
    const resource = { id: "1", name: "test" };

    vi.mocked(mockAcl.can).mockReturnValue(true);
    mockDelete.mockResolvedValue(false);

    await expect(
      deleteWithAcl({
        acl: mockAcl,
        resource,
        delete: mockDelete,
      })
    ).rejects.toThrow(NotFoundError);

    expect(mockAcl.can).toHaveBeenCalledWith("delete", resource);
    expect(mockDelete).toHaveBeenCalledWith("1");
  });

  it("should include correct error metadata for ForbiddenError", async () => {
    const resource = { id: "123", name: "test" };

    vi.mocked(mockAcl.can).mockReturnValue(false);

    try {
      await deleteWithAcl({
        acl: mockAcl,
        resource,
        delete: mockDelete,
      });
      expect.fail("Should have thrown ForbiddenError");
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenError);
      expect((error as ForbiddenError).meta.action).toBe("delete");
      expect((error as ForbiddenError).meta.subject).toBe("TestResource");
      expect((error as ForbiddenError).meta.id).toBe("123");
    }
  });

  it("should include correct error metadata for NotFoundError", async () => {
    const resource = { id: "123", name: "test" };

    vi.mocked(mockAcl.can).mockReturnValue(true);
    mockDelete.mockResolvedValue(false);

    try {
      await deleteWithAcl({
        acl: mockAcl,
        resource,
        delete: mockDelete,
      });
      expect.fail("Should have thrown NotFoundError");
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
      expect((error as NotFoundError).meta.action).toBe("delete");
      expect((error as NotFoundError).meta.subject).toBe("TestResource");
      expect((error as NotFoundError).meta.id).toBe("123");
    }
  });

  it("should pass through delete function errors", async () => {
    const resource = { id: "1", name: "test" };
    const deleteError = new Error("Database error");

    vi.mocked(mockAcl.can).mockReturnValue(true);
    mockDelete.mockRejectedValue(deleteError);

    await expect(
      deleteWithAcl({
        acl: mockAcl,
        resource,
        delete: mockDelete,
      })
    ).rejects.toThrow("Database error");
  });

  it("should work with different resource types", async () => {
    const resource = { id: "uuid-123", active: true, count: 42 };

    vi.mocked(mockAcl.can).mockReturnValue(true);
    mockDelete.mockResolvedValue(true);

    await deleteWithAcl({
      acl: mockAcl,
      resource,
      delete: mockDelete,
    });

    expect(mockDelete).toHaveBeenCalledWith("uuid-123");
  });
});
