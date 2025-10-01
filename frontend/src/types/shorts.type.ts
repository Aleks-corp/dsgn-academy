export interface IShort {
  _id: string;
  title: string;
  description?: string;
  tags: string[];
  duration?: string;
  cover: string;
  video: string;
  files: { link: string; type: string };
  originalVideo?: string;
  free: boolean;
  likedBy?: {
    count: number;
    isLiked: boolean;
  };
  bookmarked?: boolean;
  watched?: { progress: number };
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export type TagsMode = "any" | "all";

export interface ShortsListResponse {
  shorts: IShort[];
  nextCursor: string | null;
  total: number;
  page: number;
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
  files: { link: string; type: string };
  originalVideo?: string;
  free: boolean;
  publishedAt: string;
}
