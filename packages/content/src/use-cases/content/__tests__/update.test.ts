import type { ContentRepository } from "../../../repositories/content.js";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMongoAbility } from "@casl/ability";
import { updateContent } from "../update.js";
import { mockUpdateContentData } from "./__mocks__";

const mockRepo = { update: vi.fn() } as unknown as ContentRepository;

describe("updateContent", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should validate and call repository.update", async () => {
    const ability = createMongoAbility([
      { action: "update", subject: "Content" },
    ]);

    await updateContent(mockUpdateContentData as any, mockRepo, ability as any);

    expect(mockRepo.update).toHaveBeenCalledWith(
      mockUpdateContentData.id,
      mockUpdateContentData
    );
  });
});
