import { AdminState } from "../../types/state.types";

export const initialState: AdminState = {
  folowers: [],
  totalFolowers: 0,
  totalVideos: 0,
  unpublVideo: null,
  unpublVideos: [],
  totalCources: 0,
  unpublCource: null,
  unpublCources: [],
  isLoading: false,
  isLoadingUpdate: false,
  isLoadingCheck: false,
  isLoadingMore: false,
  error: "",
};
