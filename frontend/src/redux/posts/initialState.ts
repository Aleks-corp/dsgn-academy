import { PostsState } from "../../types/state.types";

export const initialState: PostsState = {
  posts: [],
  totalHits: 0,
  currentFilter: "",
  selectedPost: null,
  isLoading: false,
  error: "",
  postToEdit: null,
};
