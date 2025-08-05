import { AdminState } from "../../types/state.types";

export const initialState: AdminState = {
  folowers: [],
  totalFolowers: 0,
  totalPosts: 0,
  unpublPost: null,
  unpublPosts: [],
  isLoadingPost: false,
  isLoadingUpdate: false,
  isLoadingCheck: false,
  isLoadingMore: false,
  error: "",
};
