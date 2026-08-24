import type { UserCreate, UserState } from "../../contracts/user.js";

import { isFailure } from "@comity/primitives/result";
import { Instant } from "@comity/primitives/time";
import { beforeEach, describe, expect, it } from "vitest";
import { UserId } from "../../value-objects/user-id.js";
import { User } from "../user.js";

function makeUserId(value: string): UserId {
  const result = UserId.create(value);

  if (isFailure(result)) {
    throw new Error("Unexpected failure");
  }

  return result.value;
}

const id = makeUserId("usr-1");

const createdInstant = Instant.fromEpochMilliseconds(1_700_000_000_000);
const updatedInstant = Instant.fromEpochMilliseconds(1_700_000_500_000);
const hydratedCreatedAt = Instant.fromEpochMilliseconds(1_500_000_000_000);
const hydratedUpdatedAt = Instant.fromEpochMilliseconds(1_600_000_000_000);

const createFields: UserCreate = {
  displayName: "John Doe",
  givenName: "John",
  familyName: "Doe",
  createdAt: createdInstant,
};

function createUser(overrides?: Partial<UserCreate>) {
  return new User({ ...createFields, ...overrides }, makeUserId("test-id"));
}

/**
 * Construct a User from a persistence-like State.
 * The state provides the lifecycle metadata, id, and UserData fields.
 */
function hydrate(state: UserState) {
  return new User(
    {
      displayName: state.displayName,
      givenName: state.givenName,
      familyName: state.familyName,
      createdAt: state.createdAt,
      updatedAt: state.updatedAt,
      status: state.status,
    },
    state.id
  );
}

describe("User", () => {
  describe("creation", () => {
    it("should initialize all fields correctly", () => {
      const user = new User(createFields, id);

      expect(user.id?.toString()).toBe("usr-1");
      expect(user.displayName).toBe("John Doe");
      expect(user.givenName).toBe("John");
      expect(user.familyName).toBe("Doe");
      expect(user.status).toBe("inactive");
      expect(user.createdAt).toBeInstanceOf(Instant);
      expect(user.updatedAt).toBeInstanceOf(Instant);
    });

    it("should allow creation without id", () => {
      const user = new User(createFields);

      expect(user.id).toBeUndefined();
    });

    it("should default status to inactive when not supplied", () => {
      const user = new User(createFields);

      expect(user.status).toBe("inactive");
    });

    it("should generate createdAt at construction when not supplied", () => {
      const fieldsWithoutTimestamp = {
        displayName: "Jane",
        givenName: "Jane",
        familyName: "Doe",
      } as unknown as UserCreate;

      const user = new User(fieldsWithoutTimestamp);

      expect(user.createdAt).toBeInstanceOf(Instant);
    });

    it("should default updatedAt to createdAt when neither is supplied", () => {
      const fieldsWithoutTimestamp = {
        displayName: "Jane",
        givenName: "Jane",
        familyName: "Doe",
      } as unknown as UserCreate;

      const user = new User(fieldsWithoutTimestamp);

      expect(user.updatedAt.epochMilliseconds).toBe(user.createdAt.epochMilliseconds);
    });

    it("should default updatedAt to createdAt when only createdAt is supplied", () => {
      const user = new User({
        displayName: "Bob",
        givenName: "Bob",
        familyName: "Smith",
        createdAt: createdInstant,
      });

      expect(user.updatedAt.epochMilliseconds).toBe(createdInstant.epochMilliseconds);
    });

    it("should preserve a supplied createdAt exactly", () => {
      const user = new User({
        displayName: "Bob",
        givenName: "Bob",
        familyName: "Smith",
        createdAt: createdInstant,
      });

      expect(user.createdAt.epochMilliseconds).toBe(createdInstant.epochMilliseconds);
    });

    it("should preserve a supplied updatedAt exactly", () => {
      const user = new User({
        displayName: "Bob",
        givenName: "Bob",
        familyName: "Smith",
        createdAt: createdInstant,
        updatedAt: updatedInstant,
      });

      expect(user.updatedAt.epochMilliseconds).toBe(updatedInstant.epochMilliseconds);
    });

    it("should preserve a supplied status exactly", () => {
      const user = new User({
        displayName: "Bob",
        givenName: "Bob",
        familyName: "Smith",
        createdAt: createdInstant,
        updatedAt: updatedInstant,
        status: "active",
      });

      expect(user.status).toBe("active");
    });

    it("should allow creation with all null name fields", () => {
      const user = new User({
        displayName: null,
        givenName: null,
        familyName: null,
        createdAt: createdInstant,
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
        createdAt: createdInstant,
      });

      expect(user.displayName).toBe("User");
      expect(user.givenName).toBeNull();
    });
  });

  describe("hydration", () => {
    it("should preserve a supplied createdAt during hydration", () => {
      const user = new User(
        { ...createFields, createdAt: hydratedCreatedAt },
        makeUserId("id")
      );

      expect(user.createdAt.epochMilliseconds).toBe(hydratedCreatedAt.epochMilliseconds);
    });

    it("should preserve a supplied updatedAt during hydration", () => {
      const user = new User(
        {
          ...createFields,
          createdAt: hydratedCreatedAt,
          updatedAt: hydratedUpdatedAt,
        },
        makeUserId("id")
      );

      expect(user.updatedAt.epochMilliseconds).toBe(hydratedUpdatedAt.epochMilliseconds);
    });

    it("should preserve status 'inactive' during hydration", () => {
      const state: UserState = {
        id: makeUserId("usr-inactive"),
        displayName: "Old User",
        givenName: null,
        familyName: null,
        createdAt: hydratedCreatedAt,
        updatedAt: hydratedUpdatedAt,
        status: "inactive",
      };

      const user = hydrate(state);

      expect(user.status).toBe("inactive");
    });

    it("should preserve status 'revoked' during hydration", () => {
      const state: UserState = {
        id: makeUserId("usr-revoked"),
        displayName: "Old User",
        givenName: null,
        familyName: null,
        createdAt: hydratedCreatedAt,
        updatedAt: hydratedUpdatedAt,
        status: "revoked",
      };

      const user = hydrate(state);

      expect(user.status).toBe("revoked");
    });

    it("should preserve status 'active' during hydration", () => {
      const state: UserState = {
        id: makeUserId("usr-active"),
        displayName: "Old User",
        givenName: null,
        familyName: null,
        createdAt: hydratedCreatedAt,
        updatedAt: hydratedUpdatedAt,
        status: "active",
      };

      const user = hydrate(state);

      expect(user.status).toBe("active");
    });

    it("should preserve all persisted lifecycle metadata during hydration", () => {
      const state: UserState = {
        id: makeUserId("usr-hydrated"),
        displayName: "Jane",
        givenName: "Jane",
        familyName: "Doe",
        createdAt: hydratedCreatedAt,
        updatedAt: hydratedUpdatedAt,
        status: "revoked",
      };

      const user = hydrate(state);

      expect(user.id?.toString()).toBe("usr-hydrated");
      expect(user.displayName).toBe("Jane");
      expect(user.givenName).toBe("Jane");
      expect(user.familyName).toBe("Doe");
      expect(user.createdAt.epochMilliseconds).toBe(hydratedCreatedAt.epochMilliseconds);
      expect(user.updatedAt.epochMilliseconds).toBe(hydratedUpdatedAt.epochMilliseconds);
      expect(user.status).toBe("revoked");
    });

    it("should not regenerate persisted status when status !== 'inactive'", () => {
      const state: UserState = {
        id: makeUserId("usr-revoked"),
        displayName: "Old User",
        givenName: null,
        familyName: null,
        createdAt: hydratedCreatedAt,
        updatedAt: hydratedUpdatedAt,
        status: "revoked",
      };

      const user = hydrate(state);

      expect(user.status).not.toBe("inactive");
      expect(user.status).toBe("revoked");
    });
  });

  describe("update", () => {
    let user: User;

    beforeEach(() => {
      user = createUser();
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
  });

  describe("snapshot", () => {
    it("should capture current state with id", () => {
      const user = new User(createFields, id);
      const snapshot = user.snapshot();

      expect(snapshot.id.toString()).toBe("usr-1");
      expect(snapshot.displayName).toBe("John Doe");
      expect(snapshot.status).toBe("inactive");
      expect(snapshot.createdAt).toBeInstanceOf(Instant);
      expect(snapshot.updatedAt).toBeInstanceOf(Instant);
      expect(snapshot.capturedAt).toBeInstanceOf(Instant);
    });

    it("should expose the entity createdAt in the snapshot", () => {
      const user = new User(createFields, id);
      const snapshot = user.snapshot();

      expect(snapshot.createdAt.epochMilliseconds).toBe(createdInstant.epochMilliseconds);
      expect(snapshot.createdAt).not.toBe(snapshot.capturedAt);
    });

    it("should expose the entity updatedAt in the snapshot", () => {
      const user = new User(
        { ...createFields, updatedAt: updatedInstant },
        id
      );
      const snapshot = user.snapshot();

      expect(snapshot.updatedAt.epochMilliseconds).toBe(updatedInstant.epochMilliseconds);
    });

    it("should expose the persisted status in the snapshot", () => {
      const state: UserState = {
        id: makeUserId("usr-revoked"),
        displayName: "Old User",
        givenName: null,
        familyName: null,
        createdAt: hydratedCreatedAt,
        updatedAt: hydratedUpdatedAt,
        status: "revoked",
      };

      const user = hydrate(state);
      const snapshot = user.snapshot();

      expect(snapshot.status).toBe("revoked");
    });

    it("should include all name fields and status in snapshot", () => {
      const user = new User(createFields, id);
      const snapshot = user.snapshot();

      expect(snapshot.displayName).toBe("John Doe");
      expect(snapshot.givenName).toBe("John");
      expect(snapshot.familyName).toBe("Doe");
      expect(snapshot.status).toBe("inactive");
    });

    it("should capture null name fields in snapshot", () => {
      const user = new User(
        {
          displayName: null,
          givenName: null,
          familyName: null,
          createdAt: createdInstant,
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
