import { ShortState } from "../../types/state.types";

export const initialState: ShortState = {
  shorts: [],
  totalShorts: 0,
  isLoadingShorts: false,
  error: null,
  selected: null,
  topTags: [],
  activeTags: [],
  tagsMode: "any",
  limit: 18,
};
