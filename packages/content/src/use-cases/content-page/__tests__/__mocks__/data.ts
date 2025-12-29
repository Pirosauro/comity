import { TEST_PAGE_ID, TEST_CONTENT_ID } from "./constants";

export const mockPageData = {
  id: TEST_PAGE_ID,
  contentId: TEST_CONTENT_ID,
  meta: { title: "Home" },
  createdAt: new Date("2025-02-01"),
  updatedAt: new Date("2025-02-02"),
};

export const mockCreatePageData = {
  contentId: TEST_CONTENT_ID,
  meta: { title: "New Page" },
};
