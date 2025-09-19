import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./initialState";
import type {
  IShort,
  TopTagItem,
  ShortsListResponse,
} from "../../types/shorts.type";
import type { ShortState } from "../../types/state.types";
import {
  fetchShorts,
  fetchShortsCount,
  fetchShortById,
  fetchTopShortTags,
  addShort,
  editShort,
  deleteShort,
} from "./shorts.thunk";

const handlePending = (state: ShortState) => {
  state.isLoadingShorts = true;
  state.error = null;
};
const handleRejected = (
  state: ShortState,
  action: PayloadAction<string | undefined>
) => {
  state.isLoadingShorts = false;
  state.error = action.payload ?? "Unknown error";
};

const handleFetchShortsFulfilled = (
  state: ShortState,
  action: PayloadAction<ShortsListResponse>
): void => {
  state.isLoadingShorts = false;
  state.error = null;
  state.totalShorts = action.payload.total;
  if (action.payload.page === 1) {
    // перша сторінка → замінюємо
    state.shorts = action.payload.shorts;
  } else {
    // інші сторінки → додаємо
    const newShorts = action.payload.shorts.filter(
      (newShort) =>
        !state.shorts.some(
          (existingShort) => existingShort._id === newShort._id
        )
    );
    state.shorts = [...state.shorts, ...newShorts];
  }
};

const handlefetchShortsCountFulfilled = (
  state: ShortState,
  action: PayloadAction<{ totalShorts: number }>
): void => {
  state.isLoadingShorts = false;
  state.error = null;
  state.totalShorts = action.payload.totalShorts;
};

const handleFetchShortByIdFulfilled = (
  state: ShortState,
  action: PayloadAction<IShort>
): void => {
  state.isLoadingShorts = false;
  state.error = null;
  state.selected = action.payload;

  const idx = state.shorts.findIndex(
    (i: IShort) => i._id === action.payload._id
  );
  if (idx !== -1) {
    state.shorts[idx] = action.payload;
  } else {
    state.shorts.unshift(action.payload);
  }
};

const handleFetchTopShortTagsFulfilled = (
  state: ShortState,
  action: PayloadAction<{ tags: TopTagItem[] }>
): void => {
  state.isLoadingShorts = false;
  state.topTags = action.payload.tags;
  state.error = null;
};

const handleAddShortFulfilled = (
  state: ShortState,
  action: PayloadAction<IShort>
): void => {
  state.isLoadingShorts = false;
  state.shorts.unshift(action.payload);
};

const handleEditShortFulfilled = (
  state: ShortState,
  action: PayloadAction<IShort>
): void => {
  state.isLoadingShorts = false;
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
  state.isLoadingShorts = false;
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
      state.isLoadingShorts = false;
      state.error = null;
      state.selected = null;
      state.topTags = [];
      state.activeTags = [];
      state.tagsMode = "any";
      state.limit = 12;
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
      .addCase(fetchShortById.fulfilled, handleFetchShortByIdFulfilled)
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
