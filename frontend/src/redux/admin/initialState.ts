import { AdminState } from "../../types/state.types";

export const initialState: AdminState = {
  folowers: [],
  totalFolowers: 0,
  isLoading: false,
  isLoadingUpdate: false,
  isLoadingCheck: false,
  isLoadingMore: false,
  error: "",
};
