export interface IShort {
  _id: string;
  title: string;
  description?: string;
  tags: string[];
  duration?: string;
  cover: string;
  video: string;
  originalVideo?: string;
  free: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export type TagsMode = "any" | "all";

export interface ShortsListResponse {
  shorts: IShort[];
  nextCursor: string | null;
}

export interface ShortsSequenceResponse {
  ids: string[];
  nextCursor: string | null;
}

export interface TopTagItem {
  tag: string;
  count: number;
}
export interface TopTagsResponse {
  tags: TopTagItem[];
}

export interface AddShort {
  title: string;
  description?: string;
  tags: string[];
  duration?: string;
  cover: string;
  video: string;
  originalVideo?: string;
  free: boolean;
  publishedAt: string;
}
