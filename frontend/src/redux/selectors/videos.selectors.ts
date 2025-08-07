import { State } from "../../types/state.types";

export const selectVideos = (state: State) => state.videos.videos;

export const selectTotalHits = (state: State) => state.videos.totalHits;

export const selectCurrentFilter = (state: State) => state.videos.currentFilter;

export const selectVideo = (state: State) => state.videos.selectedVideo;

export const selectVideoToEdit = (state: State) => state.videos.videoToEdit;

export const selectIsLoading = (state: State) => state.videos.isLoading;

export const selectVideosError = (state: State) => state.videos.error;
