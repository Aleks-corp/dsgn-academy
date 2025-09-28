import { IShort } from "@/types/shorts.type";
import { State } from "../../types/state.types";

export const selectShorts = (state: State) => state.shorts.shorts;

export const selectBookmarkedShorts = (state: State) =>
  state.shorts.bookmarkedShorts;

export const selectShort = (state: State) => state.shorts.selected;

export const selectShortsTopTags = (state: State) => state.shorts.topTags;

export const selectShortsActiveTags = (state: State) => state.shorts.activeTags;

export const selectShortsTagsMode = (state: State) => state.shorts.tagsMode;

export const selectShortById = (id: string) => (state: State) => {
  const sel = state.shorts.selected;
  if (sel && sel._id === id) return sel;
  return state.shorts.shorts.find((v) => v._id === id) ?? null;
};

export const selectIsLoadingShorts = (state: State) =>
  state.shorts.isLoadingShorts;

export const selectShortsError = (state: State) => state.shorts.error;

export const selectTotalShorts = (state: State) => state.shorts.totalShorts;

export const selectShortByIdFromCache = (state: State, id: string) =>
  state.shorts.shorts.find((x) => x._id === id) ||
  (state.shorts.selected && state.shorts.selected._id === id
    ? state.shorts.selected
    : undefined);

export const selectDocsMap = (s: State) => {
  const map: Record<string, IShort> = {};
  for (const d of s.shorts.shorts) map[d._id] = d;
  if (s.shorts.selected) map[s.shorts.selected._id] = s.shorts.selected;
  return map;
};
