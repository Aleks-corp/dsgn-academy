import { VideoState } from "../../types/state.types";

export const initialState: VideoState = {
  videos: [],
  totalHits: 0,
  currentFilter: "",
  selectedVideo: null,
  isLoading: false,
  error: "",
  videoToEdit: null,
};
