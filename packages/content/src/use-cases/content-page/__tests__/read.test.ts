import type { ContentPageRepository } from "../../../repositories/content-page.js";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMongoAbility } from "@casl/ability";
import { NotFoundError } from "@comity/core/errors";
import { readContentPageBy } from "../read.js";
import { TEST_PAGE_ID, mockPageData } from "./__mocks__";

const mockRepo = { read: vi.fn() } as unknown as ContentPageRepository;

describe("readContentPageBy", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return page when found and permitted", async () => {
    (mockRepo.read as any).mockResolvedValue([mockPageData]);

    const ability = createMongoAbility([
      { action: "read", subject: "ContentPage" },
      { action: "read", subject: "id" },
    ]);

    const result = await readContentPageBy(
      TEST_PAGE_ID,
      mockRepo,
      ability as any
    );

    expect(result).toEqual(mockPageData);
    expect(mockRepo.read).toHaveBeenCalledWith(TEST_PAGE_ID, [
      "id",
      "contentId",
      "meta",
    ]);
  });

  it("should throw NotFoundError when missing", async () => {
    (mockRepo.read as any).mockResolvedValue([]);

    const ability = createMongoAbility([
      { action: "read", subject: "ContentPage" },
    ]);

    await expect(
      readContentPageBy(TEST_PAGE_ID, mockRepo, ability as any)
    ).rejects.toThrow(NotFoundError);
  });
});
