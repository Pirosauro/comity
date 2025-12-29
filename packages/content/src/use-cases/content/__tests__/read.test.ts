import type { ContentRepository } from "../../../repositories/content.js";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMongoAbility } from "@casl/ability";
import { NotFoundError } from "@comity/core/errors";
import { readContentBy } from "../read.js";
import {
  TEST_CONTENT_ID,
  mockContentData,
  DEFAULT_CONTENT_COLUMNS,
} from "./__mocks__";

const mockRepo = {
  read: vi.fn(),
  readByName: vi.fn(),
} as unknown as ContentRepository;

describe("readContentBy (core)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should fetch by id and return row", async () => {
    (mockRepo.read as any).mockResolvedValue([mockContentData]);

    const ability = createMongoAbility([
      { action: "read", subject: "Content" },
      { action: "read", subject: "id" },
      { action: "read", subject: "channelId" },
      { action: "read", subject: "name" },
      { action: "read", subject: "meta" },
    ]);

    const result = await readContentBy(TEST_CONTENT_ID, mockRepo, ability);

    expect(result).toEqual(mockContentData);
    expect(mockRepo.read).toHaveBeenCalledWith(
      TEST_CONTENT_ID,
      DEFAULT_CONTENT_COLUMNS
    );
  });

  it("should throw NotFoundError when not found", async () => {
    (mockRepo.read as any).mockResolvedValue([]);

    const ability = createMongoAbility([
      { action: "read", subject: "Content" },
      { action: "read", subject: "id" },
    ]);

    await expect(
      readContentBy(TEST_CONTENT_ID, mockRepo, ability)
    ).rejects.toThrow(NotFoundError);
  });
});
