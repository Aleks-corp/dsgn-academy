import { State } from "../../types/state.types";

export const selectShorts = (state: State) => state.shorts.shorts;

export const selectShortsNextCursor = (state: State) => state.shorts.nextCursor;

export const selectShortsSequence = (state: State) => state.shorts.sequence;

export const selectShort = (state: State) => state.shorts.selected;

export const selectShortsSeqCursor = (state: State) => state.shorts.seqCursor;

export const selectShortsTopTags = (state: State) => state.shorts.topTags;

export const selectShortsActiveTags = (state: State) => state.shorts.activeTags;

export const selectShortsTagsMode = (state: State) => state.shorts.tagsMode;

export const selectIsLoadingShorts = (state: State) => state.shorts.isLoading;

export const selectShortsError = (state: State) => state.shorts.error;

export const selectTotalShorts = (state: State) => state.shorts.totalShorts;

export const selectShortByIdFromCache = (state: State, id: string) =>
  state.shorts.shorts.find((x) => x._id === id) ||
  (state.shorts.selected && state.shorts.selected._id === id
    ? state.shorts.selected
    : undefined);
