import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./initialState";
import type {
  IShort,
  TopTagItem,
  ShortsListResponse,
  ShortsSequenceResponse,
} from "../../types/shorts.type";
import type { ShortState } from "../../types/state.types";
import {
  fetchShorts,
  fetchShortsCount,
  fetchShortsNext,
  fetchShortById,
  fetchSequence,
  fetchTopShortTags,
  addShort,
  editShort,
  deleteShort,
} from "./shorts.thunk";

const handlePending = (state: ShortState) => {
  state.isLoading = true;
  state.error = null;
};
const handleRejected = (
  state: ShortState,
  action: PayloadAction<string | undefined>
) => {
  state.isLoading = false;
  state.error = action.payload ?? "Unknown error";
};

const handleFetchShortsFulfilled = (
  state: ShortState,
  action: PayloadAction<ShortsListResponse>
): void => {
  state.isLoading = false;
  state.error = null;
  // state.shorts = action.payload.shorts;
  state.nextCursor = action.payload.nextCursor;
};

const handlefetchShortsCountFulfilled = (
  state: ShortState,
  action: PayloadAction<{ totalShorts: number }>
): void => {
  state.isLoading = false;
  state.error = null;
  state.totalShorts = action.payload.totalShorts - action.payload.totalShorts; // clear
};

const handleFetchShortsNextFulfilled = (
  state: ShortState,
  action: PayloadAction<ShortsListResponse>
): void => {
  state.isLoading = false;
  state.error = null;
  if (action.payload.shorts.length) {
    const existingIds = new Set(state.shorts.map((v: IShort) => v._id));
    const merged = state.shorts.concat(
      action.payload.shorts.filter((v: IShort) => !existingIds.has(v._id))
    );
    state.shorts = merged;
  }
  state.nextCursor = action.payload.nextCursor;
};
const handleFetchShortByIdFulfilled = (
  state: ShortState,
  action: PayloadAction<IShort>
): void => {
  state.isLoading = false;
  state.error = null;
  state.selected = action.payload;

  const idx = state.shorts.findIndex(
    (i: IShort) => i._id === action.payload._id
  );
  if (idx !== -1) state.shorts[idx] = action.payload;
};
const handleFetchSequenceFulfilled = (
  state: ShortState,
  action: PayloadAction<ShortsSequenceResponse>
): void => {
  state.isLoading = false;
  state.error = null;
  state.sequence = action.payload.ids;
  state.seqCursor = action.payload.nextCursor;
};
const handleFetchTopShortTagsFulfilled = (
  state: ShortState,
  action: PayloadAction<{ tags: TopTagItem[] }>
): void => {
  state.isLoading = false;
  state.topTags = action.payload.tags;
  state.error = null;
};
const handleAddShortFulfilled = (
  state: ShortState,
  action: PayloadAction<IShort>
): void => {
  state.isLoading = false;
  state.shorts.unshift(action.payload);
};
const handleEditShortFulfilled = (
  state: ShortState,
  action: PayloadAction<IShort>
): void => {
  state.isLoading = false;
  const idx = state.shorts.findIndex(
    (i: IShort) => i._id === action.payload._id
  );
  if (idx !== -1) state.shorts[idx] = action.payload;
  if (state.selected && state.selected._id === action.payload._id)
    state.selected = action.payload;
};
const handleDeleteShortFulfilled = (
  state: ShortState,
  action: PayloadAction<string>
): void => {
  state.isLoading = false;
  state.shorts = state.shorts.filter((i: IShort) => i._id !== action.payload);
  if (state.selected && state.selected._id === action.payload)
    state.selected = null;
};

export const shortSlice = createSlice({
  name: "shorts",
  initialState,
  reducers: {
    resetFeed(state: ShortState) {
      state.shorts = [];
      state.nextCursor = null;
      state.isLoading = false;
      state.error = null;
      state.selected = null;
      state.sequence = [];
      state.seqCursor = null;
      state.topTags = [];
      state.activeTags = [];
      state.tagsMode = "any";
      state.limit = 18;
    },
    setActiveTags(state: ShortState, action: PayloadAction<string[]>) {
      state.activeTags = action.payload;
    },
    setTagsMode(state: ShortState, action: PayloadAction<"any" | "all">) {
      state.tagsMode = action.payload;
    },
    setLimit(state: ShortState, action: PayloadAction<number>) {
      state.limit = action.payload;
    },
    clearSelected(state: ShortState) {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShorts.fulfilled, handleFetchShortsFulfilled)
      .addCase(fetchShortsCount.fulfilled, handlefetchShortsCountFulfilled)
      .addCase(fetchShortsNext.fulfilled, handleFetchShortsNextFulfilled)
      .addCase(fetchShortById.fulfilled, handleFetchShortByIdFulfilled)
      .addCase(fetchSequence.fulfilled, handleFetchSequenceFulfilled)
      .addCase(fetchTopShortTags.fulfilled, handleFetchTopShortTagsFulfilled)
      .addCase(addShort.fulfilled, handleAddShortFulfilled)
      .addCase(editShort.fulfilled, handleEditShortFulfilled)
      .addCase(deleteShort.fulfilled, handleDeleteShortFulfilled)
      .addMatcher(
        ({ type }) => type.endsWith("/pending") && type.startsWith("shorts"),
        handlePending
      )
      .addMatcher(
        ({ type }) => type.endsWith("/rejected") && type.startsWith("shorts"),
        handleRejected
      );
  },
});

export const {
  resetFeed,
  setActiveTags,
  setTagsMode,
  setLimit,
  clearSelected,
} = shortSlice.actions;
export const shortReducer = shortSlice.reducer;
