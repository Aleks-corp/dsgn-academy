import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { VideoState } from "../../types/state.types";
import {
  fetchVideos,
  fetchVideoById,
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
};

const handleFulfilled = (state: VideoState) => {
  state.error = "";
  state.isLoading = false;
};

export const handleFulfilledVideos = (
  state: VideoState,
  action: PayloadAction<{ videos: IVideo[]; totalHits: number }>
): void => {
  const newVideos = action.payload.videos.filter(
    (newVideo) =>
      !state.videos.some((existingPost) => existingPost._id === newVideo._id)
  );
  state.videos = [...state.videos, ...newVideos];

  state.totalHits = action.payload.totalHits;
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
  name: "video",
  initialState: initialState,
  reducers: {
    clearVideos(state: VideoState) {
      state.videos = [];
      state.totalHits = 0;
    },
    setFilter(state: VideoState, action: PayloadAction<string>) {
      state.currentFilter = action.payload;
    },
    clearVideo(state: VideoState) {
      state.selectedVideo = null;
    },
    deleteVideoFavorites(state: VideoState, action: PayloadAction<string>) {
      const index = state.videos.findIndex((i) => i._id === action.payload);
      if (index !== -1) {
        state.videos.splice(index, 1);
        state.totalHits = state.totalHits - 1;
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
      // .addCase(addVideo.pending, handlePending)
      // .addCase(addVideo.fulfilled, handleFulfilledAddVideo)
      .addCase(addRemoveFavoritesVideo.fulfilled, handleFulfilledAddFavorites)
      .addCase(deleteVideo.pending, handlePending)
      .addCase(deleteVideo.fulfilled, handleFulfilledDeleteVideo)
      .addMatcher(
        ({ type }) => type.endsWith("/rejected") && type.startsWith("posts"),
        handleRejected
      )
      .addMatcher(
        (action) => action.type.endsWith("fulfilled"),
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
