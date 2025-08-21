import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ShortState } from "../../types/state.types";
import {
  fetchShorts,
  fetchShortById,
  // addShort,
  addRemoveFavoritesShort,
  deleteShort,
} from "./shorts.thunk";
import { IShort } from "../../types/shorts.type";
import { initialState } from "./initialState";

const handlePending = (state: ShortState) => {
  state.isLoading = true;
};
const handleRejected = (state: ShortState, action: PayloadAction<string>) => {
  state.isLoading = false;
  state.error = action.payload;
};

const handleFulfilled = (state: ShortState) => {
  state.error = "";
  state.isLoading = false;
};

export const handleFulfilledShorts = (
  state: ShortState,
  action: PayloadAction<{
    shorts: IShort[];
    total: number;
    page: number;
    categories: {
      category: string;
      count: number;
    }[];
    filters: {
      filter: string;
      count: number;
    }[];
  }>
): void => {
  if (action.payload.page === 1) {
    state.shorts = action.payload.shorts;
  } else {
    const newShorts = action.payload.shorts.filter(
      (newShort) =>
        !state.shorts.some(
          (existingShort) => existingShort._id === newShort._id
        )
    );
    state.shorts = [...state.shorts, ...newShorts];
  }
  state.totalShorts = action.payload.total;
  // state.categories = action.payload.categories;
  // state.filters = action.payload.filters;
};

export const handleFulfilledShortById = (
  state: ShortState,
  action: PayloadAction<IShort>
): void => {
  state.selectedShort = action.payload;
};

export const handleFulfilledAddShort = (
  state: ShortState,
  action: PayloadAction<IShort>
): void => {
  state.shorts.push({ ...action.payload });
  state.selectedShort = { ...action.payload };
};

export const handleFulfilledAddFavorites = (
  state: ShortState,
  action: PayloadAction<IShort>
): void => {
  const updatedShort = action.payload;
  const index = state.shorts.findIndex((i) => i._id === updatedShort._id);
  if (index !== -1) {
    state.shorts[index].favoritedBy = updatedShort.favoritedBy;
  }
  if (state.selectedShort) {
    state.selectedShort.favoritedBy = updatedShort.favoritedBy;
  }
};

export const handleFulfilledDeleteShort = (
  state: ShortState,
  action: PayloadAction<string | undefined>
): void => {
  const postIndex = state.shorts.findIndex(
    (item) => item._id === action.payload
  );
  if (postIndex !== -1) {
    state.shorts.splice(postIndex, 1);
  }
  state.selectedShort = null;
};

const shortSlice = createSlice({
  name: "shorts",
  initialState: initialState,
  reducers: {
    clearShorts(state: ShortState) {
      state.shorts = [];
      state.totalShorts = 0;
    },
    // setFilter(state: ShortState, action: PayloadAction<string>) {
    //   state.selectedCategory = action.payload;
    // },
    clearShort(state: ShortState) {
      state.selectedShort = null;
    },
    deleteShortFavorites(state: ShortState, action: PayloadAction<string>) {
      const index = state.shorts.findIndex((i) => i._id === action.payload);
      if (index !== -1) {
        state.shorts.splice(index, 1);
        if (state.totalShorts) {
          state.totalShorts = state.totalShorts - 1;
        }
      }
    },
    setShortToEdit: (state, action) => {
      state.shortToEdit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShorts.pending, handlePending)
      .addCase(fetchShorts.fulfilled, handleFulfilledShorts)
      .addCase(fetchShortById.pending, handlePending)
      .addCase(fetchShortById.fulfilled, handleFulfilledShortById)
      // .addCase(addShort.pending, handlePending)
      // .addCase(addShort.fulfilled, handleFulfilledAddShort)
      .addCase(addRemoveFavoritesShort.fulfilled, handleFulfilledAddFavorites)
      .addCase(deleteShort.pending, handlePending)
      .addCase(deleteShort.fulfilled, handleFulfilledDeleteShort)
      .addMatcher(
        ({ type }) => type.endsWith("/rejected") && type.startsWith("shorts"),
        handleRejected
      )
      .addMatcher(
        (action) =>
          action.type.endsWith("/fulfilled") &&
          action.type.startsWith("shorts"),
        handleFulfilled
      );
  },
});

export const {
  clearShorts,
  // setFilter,
  clearShort,
  deleteShortFavorites,
  setShortToEdit,
} = shortSlice.actions;
export const shortReducer = shortSlice.reducer;
