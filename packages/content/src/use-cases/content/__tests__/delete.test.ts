import type { ContentRepository } from "../../../repositories/content.js";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMongoAbility } from "@casl/ability";
import { deleteContent } from "../delete.js";
import { TEST_CONTENT_ID } from "./__mocks__";

const mockRepo = { delete: vi.fn() } as unknown as ContentRepository;

describe("deleteContent", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should validate and call repository.delete", async () => {
    const ability = createMongoAbility([
      { action: "delete", subject: "Content" },
    ]);

    await deleteContent(
      { id: TEST_CONTENT_ID } as any,
      mockRepo,
      ability as any
    );

    expect(mockRepo.delete).toHaveBeenCalledWith(TEST_CONTENT_ID);
  });
});
