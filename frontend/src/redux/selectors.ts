import { State } from "../types/state.types";

export const selectUser = (state: State) => state.auth.profile;

export const selectSubscription = (state: State) =>
  state.auth.profile?.subscription;

export const selectIsAdmin = (state: State) =>
  state.auth.profile?.subscription === "admin" ? true : false;

export const selectIsLoggedIn = (state: State) => state.auth.isLoggedIn;

export const selectIsLogining = (state: State) => state.auth.isLogining;

export const selectUserError = (state: State) => state.auth.error;

export const selectIsRefreshing = (state: State) => state.auth.isRefreshing;

export const selectToken = (state: State) => state.auth.token;

export const selectPosts = (state: State) => state.posts.posts;

export const selectTotalHits = (state: State) => state.posts.totalHits;

export const selectCurrentFilter = (state: State) => state.posts.currentFilter;

export const selectPost = (state: State) => state.posts.selectedPost;

export const selectPostToEdit = (state: State) => state.posts.postToEdit;

export const selectIsLoading = (state: State) => state.posts.isLoading;

export const selectPostsError = (state: State) => state.posts.error;

export const selectAdminUsers = (state: State) => state.admin.folowers;

export const selectTotalFolowers = (state: State) => state.admin.totalFolowers;

export const selectUnpublishedPosts = (state: State) => state.admin.unpublPosts;

export const selectTotalUnpublPosts = (state: State) => state.admin.totalPosts;

export const selectAdminError = (state: State) => state.admin.error;

export const selectAdminLoadingPost = (state: State) =>
  state.admin.isLoadingPost;

export const selectAdminLoadingMore = (state: State) =>
  state.admin.isLoadingMore;

export const selectAdminLoadingUpdate = (state: State) =>
  state.admin.isLoadingUpdate;

export const selectAdminLoadingCheck = (state: State) =>
  state.admin.isLoadingCheck;

export const selectIsLoadingTest = (state: State) => state.test.isLoading;

export const selectIsAlpha = (state: State) => state.test.isAlpha;

export const selectIsTester = (state: State) => state.test.isTester;

export const selectTimer = (state: State) => state.test.timer;
