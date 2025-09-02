import { ShortState } from "../../types/state.types";

export const initialState: ShortState = {
  shorts: [],
  totalShorts: 0,
  nextCursor: null,
  isLoading: false,
  error: null,
  selected: null,
  sequence: [],
  seqCursor: null,
  topTags: [],
  activeTags: [],
  tagsMode: "any",
  limit: 18,
};
