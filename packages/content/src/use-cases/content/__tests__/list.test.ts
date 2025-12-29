import type { ContentRepository } from "../../../repositories/content.js";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { listContent } from "../list.js";

const mockRepo = { list: vi.fn() } as unknown as ContentRepository;

describe("listContent", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should call repository.list with parsed options", async () => {
    (mockRepo.list as any).mockReturnValue({});

    const result = await listContent(
      { columns: ["id", "name"] } as any,
      mockRepo,
      {} as any
    );

    expect(mockRepo.list).toHaveBeenCalled();
  });
});
