// import { UserProfile } from "./auth.types";
// import { GetPost } from "./posts.types";

export interface State {
  //   posts: PostsState;
  //   auth: AuthState;
  //     admin: AdminState;
  test: TestState;
}

// export interface PostsState {
//   posts: GetPost[];
//   totalHits: number;
//   currentFilter: string;
//   selectedPost: GetPost | null;
//   isLoading: boolean;
//   error: string;
//   postToEdit: GetPost | null;
// }

// export interface AuthState {
//   token: string;
//   isLoggedIn: boolean;
//   isRefreshing: boolean;
//   isLogining: boolean;
//   error: string;
//   profile: UserProfile | null;
// }

// export interface AdminState {
//   folowers: UserProfile[];
//   totalFolowers: number;
//   totalPosts: number;
//   unpublPosts: GetPost[];
//   unpublPost: GetPost | null;
//   isLoadingPost: boolean;
//   isLoadingUpdate: boolean;
//   isLoadingCheck: boolean;
//   isLoadingMore: boolean;
//   error: string;
// }

export interface TestState {
  isAlpha: boolean;
  isTester: boolean;
  error: string;
  isLoading: boolean;
  timer: number | null;
}
