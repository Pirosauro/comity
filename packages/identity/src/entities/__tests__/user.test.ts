import { describe, expect, it, beforeEach } from "vitest";
import { Instant } from "@comity/primitives/time";
import { User } from "../user.js";
import { UserId } from "../../value-objects/user-id.js";

const id = new UserId("usr-1");

const fields = {
  displayName: "John Doe",
  givenName: "John",
  familyName: "Doe",
};

function createUser(overrides?: Partial<typeof fields>) {
  return new User({ ...fields, ...overrides }, new UserId("test-id"));
}

describe("User", () => {
  describe("creation", () => {
    it("should initialize all fields correctly", () => {
      const user = new User(fields, id);

      expect(user.id?.toString()).toBe("usr-1");
      expect(user.displayName).toBe("John Doe");
      expect(user.givenName).toBe("John");
      expect(user.familyName).toBe("Doe");
      expect(user.status).toBe("active");
      expect(user.createdAt).toBeInstanceOf(Instant);
    });

    it("should allow creation without id", () => {
      const user = new User(fields);

      expect(user.id).toBeUndefined();
    });

    it("should default status to active", () => {
      const user = new User(fields);

      expect(user.status).toBe("active");
    });

    it("should allow creation with all null name fields", () => {
      const user = new User({
        displayName: null,
        givenName: null,
        familyName: null,
      });

      expect(user.displayName).toBeNull();
      expect(user.givenName).toBeNull();
      expect(user.familyName).toBeNull();
    });

    it("should allow creation with partial name fields", () => {
      const user = new User({
        displayName: "User",
        givenName: null,
        familyName: null,
      });

      expect(user.displayName).toBe("User");
      expect(user.givenName).toBeNull();
    });
  });

  describe("update", () => {
    let user: User;

    beforeEach(() => {
      user = new User(fields, id);
    });

    it("should update display name", () => {
      user.update({ displayName: "Jane Doe" });

      expect(user.displayName).toBe("Jane Doe");
    });

    it("should update display name to null", () => {
      user.update({ displayName: null });

      expect(user.displayName).toBeNull();
    });

    it("should update given name", () => {
      user.update({ givenName: "Jane" });

      expect(user.givenName).toBe("Jane");
    });

    it("should update given name to null", () => {
      user.update({ givenName: null });

      expect(user.givenName).toBeNull();
    });

    it("should update family name", () => {
      user.update({ familyName: "Smith" });

      expect(user.familyName).toBe("Smith");
    });

    it("should update family name to null", () => {
      user.update({ familyName: null });

      expect(user.familyName).toBeNull();
    });

    it("should update multiple fields at once", () => {
      user.update({ displayName: "Jane D.", givenName: "Jane" });

      expect(user.displayName).toBe("Jane D.");
      expect(user.givenName).toBe("Jane");
      expect(user.familyName).toBe("Doe");
    });

    it("should not change fields that are not updated", () => {
      user.update({});

      expect(user.displayName).toBe("John Doe");
      expect(user.familyName).toBe("Doe");
    });

    it("should not allow updating status through update", () => {
      user.update({});

      expect(user.status).toBe("active");
    });
  });

  describe("snapshot", () => {
    it("should capture current state with id", () => {
      const user = new User(fields, id);
      const snapshot = user.snapshot();

      expect(snapshot.id.toString()).toBe("usr-1");
      expect(snapshot.displayName).toBe("John Doe");
      expect(snapshot.status).toBe("active");
      expect(snapshot.capturedAt).toBeInstanceOf(Instant);
    });

    it("should include all name fields and status in snapshot", () => {
      const user = new User(fields, id);
      const snapshot = user.snapshot();

      expect(snapshot.displayName).toBe("John Doe");
      expect(snapshot.givenName).toBe("John");
      expect(snapshot.familyName).toBe("Doe");
      expect(snapshot.status).toBe("active");
    });

    it("should capture null name fields in snapshot", () => {
      const user = new User(
        {
          displayName: null,
          givenName: null,
          familyName: null,
        },
        id
      );
      const snapshot = user.snapshot();

      expect(snapshot.displayName).toBeNull();
      expect(snapshot.givenName).toBeNull();
      expect(snapshot.familyName).toBeNull();
    });

    it("should be immutable after mutation of source", () => {
      const user = createUser();
      const snapshot = user.snapshot();

      user.update({ displayName: "Jane Doe" });

      expect(snapshot.displayName).toBe("John Doe");
    });

    it("should return a new object each call", () => {
      const user = createUser();

      expect(user.snapshot()).not.toBe(user.snapshot());
    });
  });
});