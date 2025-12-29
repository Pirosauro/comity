import type { ContentRepository } from "../../../repositories/content.js";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMongoAbility } from "@casl/ability";
import { createContent } from "../create.js";
import { mockCreateContentData, TEST_CHANNEL_ID } from "./__mocks__";

const mockRepo = { create: vi.fn() } as unknown as ContentRepository;

describe("createContent", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should validate and call repository.create", async () => {
    const ability = createMongoAbility([
      { action: "create", subject: "Content" },
    ]);

    await createContent(
      { ...mockCreateContentData, channelId: TEST_CHANNEL_ID },
      mockRepo,
      ability as any
    );

    expect(mockRepo.create).toHaveBeenCalled();
  });
});
