import { State } from "../../types/state.types";

export const selectShorts = (state: State) => state.shorts.shorts;

export const selectVideoCategories = (state: State) => state.videos.categories;

export const selectVideoFilters = (state: State) => state.videos.filters;

export const selectVideo = (state: State) => state.videos.selectedVideo;

export const selectVideoToEdit = (state: State) => state.videos.videoToEdit;

export const selectIsLoadingVideos = (state: State) => state.videos.isLoading;

export const selectVideosError = (state: State) => state.videos.error;

export const selectTotalShorts = (state: State) => state.shorts.totalShorts;
