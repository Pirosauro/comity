import { describe, it, expect, vi, beforeEach } from "vitest";
import { createCaslAclAdapter } from "../casl.js";
import type { AnyAbility } from "@casl/ability";
import { subject } from "@casl/ability";

vi.mock("@casl/ability", async () => {
  const actual = await vi.importActual("@casl/ability");
  return {
    ...actual,
    subject: vi.fn((type, resource) => ({
      __caslSubjectType__: type,
      ...resource,
    })),
  };
});

describe("createCaslAclAdapter", () => {
  const mockAbility: AnyAbility = {
    can: vi.fn(),
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("adapter creation", () => {
    it("should create adapter with correct resourceType", () => {
      const adapter = createCaslAclAdapter({
        ability: mockAbility,
        subject: "User",
      });

      expect(adapter.resourceType).toBe("User");
    });

    it("should create adapter with all required methods", () => {
      const adapter = createCaslAclAdapter({
        ability: mockAbility,
        subject: "User",
      });

      expect(adapter).toHaveProperty("resourceType");
      expect(adapter).toHaveProperty("filterReadableFields");
      expect(adapter).toHaveProperty("filterWritableFields");
      expect(adapter).toHaveProperty("can");
      expect(typeof adapter.filterReadableFields).toBe("function");
      expect(typeof adapter.filterWritableFields).toBe("function");
      expect(typeof adapter.can).toBe("function");
    });
  });

  describe("filterReadableFields", () => {
    it("should filter fields based on ability permissions", () => {
      vi.mocked(mockAbility.can).mockImplementation((action, subj, field) => {
        return field !== "password";
      });

      const adapter = createCaslAclAdapter({
        ability: mockAbility,
        subject: "User",
      });

      const resource = { id: "1", name: "test" };
      const fields = ["id", "name", "email", "password"];
      const result = adapter.filterReadableFields("read", resource, fields);

      expect(result).toEqual(["id", "name", "email"]);
    });

    it("should call ability.can with correct arguments", () => {
      const adapter = createCaslAclAdapter({
        ability: mockAbility,
        subject: "User",
      });

      const resource = { id: "1", name: "test" };
      const fields = ["id", "name"];
      adapter.filterReadableFields("read", resource, fields);

      expect(subject).toHaveBeenCalledWith("User", resource);
      expect(mockAbility.can).toHaveBeenCalledTimes(2);
    });

    it("should return empty array when no fields are allowed", () => {
      vi.mocked(mockAbility.can).mockReturnValue(false);

      const adapter = createCaslAclAdapter({
        ability: mockAbility,
        subject: "User",
      });

      const resource = { id: "1" };
      const fields = ["id", "name", "email"];
      const result = adapter.filterReadableFields("read", resource, fields);

      expect(result).toEqual([]);
    });

    it("should return all fields when all are allowed", () => {
      vi.mocked(mockAbility.can).mockReturnValue(true);

      const adapter = createCaslAclAdapter({
        ability: mockAbility,
        subject: "User",
      });

      const resource = { id: "1" };
      const fields = ["id", "name", "email"];
      const result = adapter.filterReadableFields("read", resource, fields);

      expect(result).toEqual(["id", "name", "email"]);
    });

    it("should handle empty fields array", () => {
      const adapter = createCaslAclAdapter({
        ability: mockAbility,
        subject: "User",
      });

      const resource = { id: "1" };
      const result = adapter.filterReadableFields("read", resource, []);

      expect(result).toEqual([]);
      expect(mockAbility.can).not.toHaveBeenCalled();
    });
  });

  describe("filterWritableFields", () => {
    it("should filter fields based on ability permissions", () => {
      vi.mocked(mockAbility.can).mockImplementation((action, subj, field) => {
        return field !== "id";
      });

      const adapter = createCaslAclAdapter({
        ability: mockAbility,
        subject: "User",
      });

      const resource = { id: "1", name: "test" };
      const fields = ["id", "name", "email"];
      const result = adapter.filterWritableFields("update", resource, fields);

      expect(result).toEqual(["name", "email"]);
    });

    it("should work with create action", () => {
      vi.mocked(mockAbility.can).mockReturnValue(true);

      const adapter = createCaslAclAdapter({
        ability: mockAbility,
        subject: "User",
      });

      const resource = { id: "1" };
      const fields = ["name", "email"];
      const result = adapter.filterWritableFields("create", resource, fields);

      expect(result).toEqual(["name", "email"]);
    });

    it("should call ability.can with correct arguments", () => {
      const adapter = createCaslAclAdapter({
        ability: mockAbility,
        subject: "User",
      });

      const resource = { id: "1", name: "test" };
      const fields = ["name"];
      adapter.filterWritableFields("update", resource, fields);

      expect(subject).toHaveBeenCalledWith("User", resource);
      expect(mockAbility.can).toHaveBeenCalledTimes(1);
    });

    it("should return empty array when no fields are allowed", () => {
      vi.mocked(mockAbility.can).mockReturnValue(false);

      const adapter = createCaslAclAdapter({
        ability: mockAbility,
        subject: "User",
      });

      const resource = { id: "1" };
      const fields = ["name", "email"];
      const result = adapter.filterWritableFields("update", resource, fields);

      expect(result).toEqual([]);
    });

    it("should handle empty fields array", () => {
      const adapter = createCaslAclAdapter({
        ability: mockAbility,
        subject: "User",
      });

      const resource = { id: "1" };
      const result = adapter.filterWritableFields("update", resource, []);

      expect(result).toEqual([]);
      expect(mockAbility.can).not.toHaveBeenCalled();
    });
  });

  describe("can", () => {
    it("should check permission for action on resource", () => {
      vi.mocked(mockAbility.can).mockReturnValue(true);

      const adapter = createCaslAclAdapter({
        ability: mockAbility,
        subject: "User",
      });

      const resource = { id: "1", name: "test" };
      const result = adapter.can("read", resource);

      expect(result).toBe(true);
      expect(subject).toHaveBeenCalledWith("User", resource);
      expect(mockAbility.can).toHaveBeenCalledWith("read", expect.any(Object));
    });

    it("should return false when permission denied", () => {
      vi.mocked(mockAbility.can).mockReturnValue(false);

      const adapter = createCaslAclAdapter({
        ability: mockAbility,
        subject: "User",
      });

      const resource = { id: "1", name: "test" };
      const result = adapter.can("delete", resource);

      expect(result).toBe(false);
    });

    it("should work with all ACL actions", () => {
      vi.mocked(mockAbility.can).mockReturnValue(true);

      const adapter = createCaslAclAdapter({
        ability: mockAbility,
        subject: "User",
      });

      const resource = { id: "1" };

      expect(adapter.can("read", resource)).toBe(true);
      expect(adapter.can("create", resource)).toBe(true);
      expect(adapter.can("update", resource)).toBe(true);
      expect(adapter.can("delete", resource)).toBe(true);
    });

    it("should call ability.can with wrapped subject", () => {
      const adapter = createCaslAclAdapter({
        ability: mockAbility,
        subject: "User",
      });

      const resource = { id: "1", email: "test@example.com" };
      adapter.can("read", resource);

      expect(subject).toHaveBeenCalledWith("User", resource);
    });
  });

  describe("integration scenarios", () => {
    it("should handle complex resource objects", () => {
      vi.mocked(mockAbility.can).mockReturnValue(true);

      const adapter = createCaslAclAdapter({
        ability: mockAbility,
        subject: "Post",
      });

      const resource = {
        id: "post-1",
        title: "Test Post",
        authorId: "user-1",
        published: true,
        tags: ["test", "example"],
      };

      const fields = ["id", "title", "published"];
      const result = adapter.filterReadableFields("read", resource, fields);

      expect(result).toEqual(["id", "title", "published"]);
    });

    it("should work with different subject types", () => {
      const postAdapter = createCaslAclAdapter({
        ability: mockAbility,
        subject: "Post",
      });

      const commentAdapter = createCaslAclAdapter({
        ability: mockAbility,
        subject: "Comment",
      });

      expect(postAdapter.resourceType).toBe("Post");
      expect(commentAdapter.resourceType).toBe("Comment");
    });
  });
});
