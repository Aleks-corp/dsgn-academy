import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { VideoState } from "../../types/state.types";
import {
  fetchVideos,
  fetchVideoById,
  fetchVideosCount,
  // addVideo,
  addRemoveFavoritesVideo,
  deleteVideo,
} from "./video.thunk";
import { IVideo } from "../../types/videos.type";
import { initialState } from "./initialState";

const handlePending = (state: VideoState) => {
  state.isLoading = true;
};
const handleRejected = (state: VideoState, action: PayloadAction<string>) => {
  state.isLoading = false;
  state.error = action.payload;
  if (action.payload === "Not authorized") {
  }
};

const handleFulfilled = (state: VideoState) => {
  state.error = "";
  state.isLoading = false;
};

export const handleFulfilledVideos = (
  state: VideoState,
  action: PayloadAction<{
    videos: IVideo[];
    total: number;
    page: number;
  }>
): void => {
  if (action.payload.page === 1) {
    state.videos = action.payload.videos;
  } else {
    const newVideos = action.payload.videos.filter(
      (newVideo) =>
        !state.videos.some(
          (existingVideo) => existingVideo._id === newVideo._id
        )
    );
    state.videos = [...state.videos, ...newVideos];
  }
  state.totalHits = action.payload.total;
};

export const handleFulfilledVideosCount = (
  state: VideoState,
  action: PayloadAction<{
    categories: {
      category: string;
      count: number;
    }[];
    filters: {
      filter: string;
      count: number;
    }[];
    totalFree: number;
    totalVideos: number;
  }>
): void => {
  state.totalVideos = action.payload.totalVideos;
  state.totalFree = action.payload.totalFree;
  state.categories = action.payload.categories;
  state.filters = action.payload.filters;
};

export const handleFulfilledVideoById = (
  state: VideoState,
  action: PayloadAction<IVideo>
): void => {
  state.selectedVideo = action.payload;
};

export const handleFulfilledAddVideo = (
  state: VideoState,
  action: PayloadAction<IVideo>
): void => {
  state.videos.push({ ...action.payload });
  state.selectedVideo = { ...action.payload };
};

export const handleFulfilledAddFavorites = (
  state: VideoState,
  action: PayloadAction<IVideo>
): void => {
  const updatedVideo = action.payload;
  const index = state.videos.findIndex((i) => i._id === updatedVideo._id);
  if (index !== -1) {
    state.videos[index].favoritedBy = updatedVideo.favoritedBy;
  }
  if (state.selectedVideo) {
    state.selectedVideo.favoritedBy = updatedVideo.favoritedBy;
  }
};

export const handleFulfilledDeleteVideo = (
  state: VideoState,
  action: PayloadAction<string | undefined>
): void => {
  const postIndex = state.videos.findIndex(
    (item) => item._id === action.payload
  );
  if (postIndex !== -1) {
    state.videos.splice(postIndex, 1);
  }
  state.selectedVideo = null;
};

const videoSlice = createSlice({
  name: "videos",
  initialState: initialState,
  reducers: {
    clearVideos(state: VideoState) {
      state.videos = [];
      state.totalVideos = 0;
    },
    setFilter(state: VideoState, action: PayloadAction<string>) {
      state.selectedCategory = action.payload;
    },
    clearVideo(state: VideoState) {
      state.selectedVideo = null;
    },
    deleteVideoFavorites(state: VideoState, action: PayloadAction<string>) {
      const index = state.videos.findIndex((i) => i._id === action.payload);
      if (index !== -1) {
        state.videos.splice(index, 1);
        if (state.totalVideos) {
          state.totalVideos = state.totalVideos - 1;
        }
      }
    },
    setVideoToEdit: (state, action) => {
      state.videoToEdit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, handlePending)
      .addCase(fetchVideos.fulfilled, handleFulfilledVideos)
      .addCase(fetchVideoById.pending, handlePending)
      .addCase(fetchVideoById.fulfilled, handleFulfilledVideoById)
      .addCase(fetchVideosCount.fulfilled, handleFulfilledVideosCount)
      // .addCase(addVideo.pending, handlePending)
      // .addCase(addVideo.fulfilled, handleFulfilledAddVideo)
      .addCase(addRemoveFavoritesVideo.fulfilled, handleFulfilledAddFavorites)
      .addCase(deleteVideo.pending, handlePending)
      .addCase(deleteVideo.fulfilled, handleFulfilledDeleteVideo)
      .addMatcher(
        ({ type }) => type.endsWith("/rejected") && type.startsWith("videos"),
        handleRejected
      )
      .addMatcher(
        (action) =>
          action.type.endsWith("/fulfilled") &&
          action.type.startsWith("videos"),
        handleFulfilled
      );
  },
});

export const {
  clearVideos,
  setFilter,
  clearVideo,
  deleteVideoFavorites,
  setVideoToEdit,
} = videoSlice.actions;
export const videoReducer = videoSlice.reducer;
