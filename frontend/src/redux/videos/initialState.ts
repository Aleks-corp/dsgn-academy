import { VideoState } from "../../types/state.types";

export const initialState: VideoState = {
  videos: [],
  bookmarkedVideo: [],
  totalHits: 0,
  categories: [],
  filters: [],
  selectedCategory: null,
  totalVideos: undefined,
  totalFree: undefined,
  currentFreeFilter: false,
  selectedVideo: null,
  isLoading: false,
  error: "",
  videoToEdit: null,
};
