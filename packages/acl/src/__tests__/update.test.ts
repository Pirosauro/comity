import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateWithAcl } from "../update.js";
import type { AclAdapter, AclFieldListValidator } from "../types.js";
import { ForbiddenError } from "@comity/core/errors";

describe("updateWithAcl", () => {
  const mockAcl: AclAdapter<any> = {
    resourceType: "TestResource",
    filterReadableFields: vi.fn(),
    filterWritableFields: vi.fn(),
    can: vi.fn(),
  };

  const mockUpdate = vi.fn();
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

  it("should update resource with allowed fields", async () => {
    const resource = { id: "1", name: "old", email: "old@example.com" };
    const patch = { name: "new", email: "new@example.com" };

    vi.mocked(mockAcl.can).mockReturnValue(true);
    vi.mocked(mockAcl.filterWritableFields).mockReturnValue(["name", "email"]);
    mockUpdate.mockResolvedValue(undefined);

    await updateWithAcl({
      acl: mockAcl,
      resource,
      patch,
      fieldsValidator,
      update: mockUpdate,
    });

    expect(mockAcl.can).toHaveBeenCalledWith("update", resource);
    expect(mockAcl.filterWritableFields).toHaveBeenCalledWith(
      "update",
      resource,
      ["name", "email"]
    );
    expect(mockUpdate).toHaveBeenCalledWith({
      name: "new",
      email: "new@example.com",
    });
  });

  it("should throw ForbiddenError when subject-level check fails", async () => {
    const resource = { id: "1", name: "test" };
    const patch = { name: "new" };

    vi.mocked(mockAcl.can).mockReturnValue(false);

    await expect(
      updateWithAcl({
        acl: mockAcl,
        resource,
        patch,
        fieldsValidator,
        update: mockUpdate,
      })
    ).rejects.toThrow(ForbiddenError);

    expect(mockAcl.can).toHaveBeenCalledWith("update", resource);
    expect(mockAcl.filterWritableFields).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("should throw ForbiddenError when no writable fields", async () => {
    const resource = { id: "1", name: "test" };
    const patch = { name: "new" };

    vi.mocked(mockAcl.can).mockReturnValue(true);
    vi.mocked(mockAcl.filterWritableFields).mockReturnValue([]);

    await expect(
      updateWithAcl({
        acl: mockAcl,
        resource,
        patch,
        fieldsValidator,
        update: mockUpdate,
      })
    ).rejects.toThrow(ForbiddenError);

    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("should filter out non-writable fields from patch", async () => {
    const resource = { id: "1", name: "test", email: "test@example.com" };
    const patch = { name: "new", email: "new@example.com", password: "secret" };

    vi.mocked(mockAcl.can).mockReturnValue(true);
    vi.mocked(mockAcl.filterWritableFields).mockReturnValue(["name"]);
    mockUpdate.mockResolvedValue(undefined);

    await updateWithAcl({
      acl: mockAcl,
      resource,
      patch,
      fieldsValidator,
      update: mockUpdate,
    });

    expect(mockUpdate).toHaveBeenCalledWith({ name: "new" });
  });

  it("should validate patch keys using columnsSchema", async () => {
    const resource = { id: "1", name: "test" };
    const invalidPatch = { invalidField: "value" } as any;

    vi.mocked(mockAcl.can).mockReturnValue(true);

    await expect(
      updateWithAcl({
        acl: mockAcl,
        resource,
        patch: invalidPatch,
        fieldsValidator,
        update: mockUpdate,
      })
    ).rejects.toThrow();

    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("should include correct error metadata for subject-level forbidden", async () => {
    const resource = { id: "123", name: "test" };
    const patch = { name: "new" };

    vi.mocked(mockAcl.can).mockReturnValue(false);

    try {
      await updateWithAcl({
        acl: mockAcl,
        resource,
        patch,
        fieldsValidator,
        update: mockUpdate,
      });
      expect.fail("Should have thrown ForbiddenError");
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenError);
      expect((error as ForbiddenError).meta.action).toBe("update");
      expect((error as ForbiddenError).meta.subject).toBe("TestResource");
      expect((error as ForbiddenError).meta.id).toBe("123");
    }
  });

  it("should include correct error metadata for no writable fields", async () => {
    const resource = { id: "123", name: "test" };
    const patch = { name: "new" };

    vi.mocked(mockAcl.can).mockReturnValue(true);
    vi.mocked(mockAcl.filterWritableFields).mockReturnValue([]);

    try {
      await updateWithAcl({
        acl: mockAcl,
        resource,
        patch,
        fieldsValidator,
        update: mockUpdate,
      });
      expect.fail("Should have thrown ForbiddenError");
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenError);
      expect((error as ForbiddenError).message).toBe("No writable fields");
      expect((error as ForbiddenError).meta.action).toBe("update");
      expect((error as ForbiddenError).meta.subject).toBe("TestResource");
      expect((error as ForbiddenError).meta.id).toBe("123");
    }
  });

  it("should handle empty patch object", async () => {
    const resource = { id: "1", name: "test" };
    const patch = {};

    vi.mocked(mockAcl.can).mockReturnValue(true);
    vi.mocked(mockAcl.filterWritableFields).mockReturnValue([]);

    await expect(
      updateWithAcl({
        acl: mockAcl,
        resource,
        patch,
        fieldsValidator,
        update: mockUpdate,
      })
    ).rejects.toThrow(ForbiddenError);
  });

  it("should pass through update function errors", async () => {
    const resource = { id: "1", name: "test" };
    const patch = { name: "new" };
    const updateError = new Error("Database error");

    vi.mocked(mockAcl.can).mockReturnValue(true);
    vi.mocked(mockAcl.filterWritableFields).mockReturnValue(["name"]);
    mockUpdate.mockRejectedValue(updateError);

    await expect(
      updateWithAcl({
        acl: mockAcl,
        resource,
        patch,
        fieldsValidator,
        update: mockUpdate,
      })
    ).rejects.toThrow("Database error");
  });
});
