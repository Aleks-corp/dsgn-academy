import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { VideoState } from "../../types/state.types";
import {
  fetchVideos,
  fetchVideoById,
  fetchVideosCount,
  addVideo,
  deleteVideo,
  fetchBookMarkedVideos,
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

const handleFetchVideosPending = (state: VideoState) => {
  state.isLoading = true;
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
  state.error = "";
  state.isLoading = false;
};

export const handleFulfilledBookmarkedVideos = (
  state: VideoState,
  action: PayloadAction<{
    videos: IVideo[];
    total: number;
    page: number;
  }>
): void => {
  if (action.payload.page === 1) {
    state.bookmarkedVideo = action.payload.videos;
  } else {
    const newVideos = action.payload.videos.filter(
      (newVideo) =>
        !state.bookmarkedVideo.some(
          (existingVideo) => existingVideo._id === newVideo._id
        )
    );
    state.bookmarkedVideo = [...state.bookmarkedVideo, ...newVideos];
  }
  state.totalHits = action.payload.total;
  state.error = "";
  state.isLoading = false;
};

export const handleRejectVideos = (
  state: VideoState,
  action: PayloadAction<unknown>
): void => {
  if (action.payload === "Відео не знайдено") {
    state.videos = [];
    state.totalHits = 0;
  }
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
  state.error = "";
  state.isLoading = false;
};

export const handleFulfilledAddVideo = (
  state: VideoState,
  action: PayloadAction<IVideo>
): void => {
  state.videos.push({ ...action.payload });
  state.selectedVideo = { ...action.payload };
  state.error = "";
  state.isLoading = false;
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
  state.error = "";
  state.isLoading = false;
};

const videoSlice = createSlice({
  name: "videos",
  initialState: initialState,
  reducers: {
    clearVideos(state: VideoState) {
      state.videos = [];
      state.totalHits = 0;
    },
    clearBookmarkedVideos(state: VideoState) {
      state.bookmarkedVideo = [];
      state.totalHits = 0;
    },
    setFilter(state: VideoState, action: PayloadAction<string>) {
      state.selectedCategory = action.payload;
    },
    clearVideo(state: VideoState) {
      state.selectedVideo = null;
    },
    toggleVideoBookMarked(state: VideoState, action: PayloadAction<string>) {
      const index = state.videos.findIndex((i) => i._id === action.payload);
      if (index !== -1) {
        state.videos[index].bookmarked = !state.videos[index].bookmarked;
      }
      if (state.bookmarkedVideo.length !== 0) {
        state.totalHits = state.totalHits - 1;
        state.bookmarkedVideo = state.bookmarkedVideo.filter(
          (video) => video._id !== action.payload
        );
      }
      if (state.selectedVideo && state.selectedVideo._id === action.payload) {
        state.selectedVideo.bookmarked = !state.selectedVideo.bookmarked;
      }
    },
    setVideoToEdit: (state, action) => {
      state.videoToEdit = action.payload;
    },
    setVideoProgress: (
      state,
      action: PayloadAction<{ videoId: string; currentTime: number }>
    ) => {
      const { videoId, currentTime } = action.payload;

      if (state.selectedVideo && state.selectedVideo._id === videoId) {
        state.selectedVideo = {
          ...state.selectedVideo,
          watched: { progress: currentTime },
        };
      }

      const idx = state.videos.findIndex((v) => v._id === videoId);
      if (idx !== -1) {
        state.videos[idx] = {
          ...state.videos[idx],
          watched: { progress: currentTime },
        };
      }
    },
    toggleVideoLiked(state: VideoState, action: PayloadAction<string>) {
      if (state.selectedVideo && state.selectedVideo._id === action.payload) {
        const isLiked = state.selectedVideo.likedBy?.isLiked ?? false;
        const count = state.selectedVideo.likedBy?.count ?? 0;
        state.selectedVideo.likedBy = {
          isLiked: !isLiked,
          count: isLiked ? Math.max(0, count - 1) : count + 1,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, handleFetchVideosPending)
      .addCase(fetchVideos.fulfilled, handleFulfilledVideos)
      .addCase(fetchVideos.rejected, handleRejectVideos)
      .addCase(fetchBookMarkedVideos.pending, handlePending)
      .addCase(fetchBookMarkedVideos.fulfilled, handleFulfilledBookmarkedVideos)
      .addCase(fetchVideoById.pending, handlePending)
      .addCase(fetchVideoById.fulfilled, handleFulfilledVideoById)
      .addCase(fetchVideosCount.fulfilled, handleFulfilledVideosCount)
      .addCase(addVideo.pending, handlePending)
      .addCase(addVideo.fulfilled, handleFulfilledAddVideo)
      .addCase(deleteVideo.pending, handlePending)
      .addCase(deleteVideo.fulfilled, handleFulfilledDeleteVideo)
      .addMatcher(
        ({ type }) => type.endsWith("/rejected") && type.startsWith("videos"),
        handleRejected
      );
  },
});

export const {
  clearVideos,
  clearBookmarkedVideos,
  setFilter,
  clearVideo,
  toggleVideoBookMarked,
  setVideoToEdit,
  setVideoProgress,
  toggleVideoLiked,
} = videoSlice.actions;
export const videoReducer = videoSlice.reducer;
