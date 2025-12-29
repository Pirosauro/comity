import {
  TEST_CONTENT_ID,
  TEST_CHANNEL_ID,
  TEST_CONTENT_ID_2,
} from "./constants";

export const mockContentData = {
  id: TEST_CONTENT_ID,
  channelId: TEST_CHANNEL_ID,
  name: "Homepage",
  template: "default",
  meta: { layout: "default" },
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date("2025-01-02"),
};

export const mockContentsData = [
  mockContentData,
  {
    id: TEST_CONTENT_ID_2,
    channelId: TEST_CHANNEL_ID,
    name: "About",
    meta: { layout: "two-column" },
    createdAt: new Date("2025-01-03"),
    updatedAt: new Date("2025-01-04"),
  },
];

export const mockCreateContentData = {
  channelId: TEST_CHANNEL_ID,
  name: "Blog",
  meta: { postsPerPage: 10 },
};

export const mockUpdateContentData = {
  id: TEST_CONTENT_ID,
  name: "Homepage Updated",
};
