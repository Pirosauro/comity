import { describe, it, expect, vi, beforeEach } from "vitest";
import { createWithAcl } from "../create.js";
import type { AclAdapter } from "../types.js";
import { ForbiddenError } from "@comity/core/errors";

describe("createWithAcl", () => {
  const mockAcl: AclAdapter<any> = {
    resourceType: "TestResource",
    filterReadableFields: vi.fn(),
    filterWritableFields: vi.fn(),
    can: vi.fn(),
  };

  const mockCreate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create resource when acl allows", async () => {
    const data = { id: "1", name: "test" };
    const createdData = { id: "1", name: "test", createdAt: new Date() };

    vi.mocked(mockAcl.can).mockReturnValue(true);
    mockCreate.mockResolvedValue(createdData);

    const result = await createWithAcl({
      acl: mockAcl,
      data,
      create: mockCreate,
    });

    expect(mockAcl.can).toHaveBeenCalledWith("create", data);
    expect(mockCreate).toHaveBeenCalledWith(data);
    expect(result).toEqual(createdData);
  });

  it("should throw ForbiddenError when acl denies", async () => {
    const data = { id: "1", name: "test" };

    vi.mocked(mockAcl.can).mockReturnValue(false);

    await expect(
      createWithAcl({
        acl: mockAcl,
        data,
        create: mockCreate,
      })
    ).rejects.toThrow(ForbiddenError);

    expect(mockAcl.can).toHaveBeenCalledWith("create", data);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("should include correct error metadata when forbidden", async () => {
    const data = { id: "1", name: "test" };

    vi.mocked(mockAcl.can).mockReturnValue(false);

    try {
      await createWithAcl({
        acl: mockAcl,
        data,
        create: mockCreate,
      });
      expect.fail("Should have thrown ForbiddenError");
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenError);
      expect((error as ForbiddenError).meta.action).toBe("create");
      expect((error as ForbiddenError).meta.subject).toBe("TestResource");
    }
  });

  it("should pass through create function errors", async () => {
    const data = { id: "1", name: "test" };
    const createError = new Error("Database error");

    vi.mocked(mockAcl.can).mockReturnValue(true);
    mockCreate.mockRejectedValue(createError);

    await expect(
      createWithAcl({
        acl: mockAcl,
        data,
        create: mockCreate,
      })
    ).rejects.toThrow("Database error");
  });

  it("should work with different data types", async () => {
    const data = { id: "1", value: 123, active: true };

    vi.mocked(mockAcl.can).mockReturnValue(true);
    mockCreate.mockResolvedValue(data);

    const result = await createWithAcl({
      acl: mockAcl,
      data,
      create: mockCreate,
    });

    expect(result).toEqual(data);
  });
});
