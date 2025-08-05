import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PostsState } from "../../types/state.types";
import {
  fetchPosts,
  fetchPostById,
  addPost,
  addRemoveFavorites,
  deletePost,
} from "./post.thunk";
import { GetPost } from "../../types/posts.types";
import { initialState } from "./initialState";

const handlePending = (state: PostsState) => {
  state.isLoading = true;
};
const handleRejected = (state: PostsState, action: PayloadAction<string>) => {
  state.isLoading = false;
  state.error = action.payload;
};

const handleFulfilled = (state: PostsState) => {
  state.error = "";
  state.isLoading = false;
};

export const handleFulfilledPosts = (
  state: PostsState,
  action: PayloadAction<{ posts: GetPost[]; totalHits: number }>
): void => {
  const newPosts = action.payload.posts.filter(
    (newPost) =>
      !state.posts.some((existingPost) => existingPost._id === newPost._id)
  );
  state.posts = [...state.posts, ...newPosts];

  state.totalHits = action.payload.totalHits;
};

export const handleFulfilledPostById = (
  state: PostsState,
  action: PayloadAction<GetPost>
): void => {
  state.selectedPost = action.payload;
};

export const handleFulfilledAddPost = (
  state: PostsState,
  action: PayloadAction<GetPost>
): void => {
  state.posts.push({ ...action.payload });
  state.selectedPost = { ...action.payload };
};

export const handleFulfilledAddFavorites = (
  state: PostsState,
  action: PayloadAction<GetPost>
): void => {
  const updatedPost = action.payload;
  const index = state.posts.findIndex((i) => i._id === updatedPost._id);
  if (index !== -1) {
    state.posts[index].favorites = updatedPost.favorites;
  }
  if (state.selectedPost) {
    state.selectedPost.favorites = updatedPost.favorites;
  }
};

export const handleFulfilledDeletePost = (
  state: PostsState,
  action: PayloadAction<string | undefined>
): void => {
  const postIndex = state.posts.findIndex(
    (item) => item._id === action.payload
  );
  if (postIndex !== -1) {
    state.posts.splice(postIndex, 1);
  }
  state.selectedPost = null;
};

const postsSlice = createSlice({
  name: "posts",
  initialState: initialState,
  reducers: {
    setPostToEdit: (state, action) => {
      state.postToEdit = action.payload;
    },
    clearPosts(state: PostsState) {
      state.posts = [];
      state.totalHits = 0;
    },
    setFilter(state: PostsState, action: PayloadAction<string>) {
      state.currentFilter = action.payload;
    },
    clearPost(state: PostsState) {
      state.selectedPost = null;
    },
    deletePostFavorites(state: PostsState, action: PayloadAction<string>) {
      const index = state.posts.findIndex((i) => i._id === action.payload);
      if (index !== -1) {
        state.posts.splice(index, 1);
        state.totalHits = state.totalHits - 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, handlePending)
      .addCase(fetchPosts.fulfilled, handleFulfilledPosts)
      .addCase(fetchPostById.pending, handlePending)
      .addCase(fetchPostById.fulfilled, handleFulfilledPostById)
      .addCase(addPost.pending, handlePending)
      .addCase(addPost.fulfilled, handleFulfilledAddPost)
      .addCase(addRemoveFavorites.fulfilled, handleFulfilledAddFavorites)
      .addCase(deletePost.pending, handlePending)
      .addCase(deletePost.fulfilled, handleFulfilledDeletePost)
      .addMatcher(
        ({ type }) => type.endsWith("/rejected") && type.startsWith("posts"),
        handleRejected
      )
      .addMatcher(
        (action) => action.type.endsWith("fulfilled"),
        handleFulfilled
      );
  },
});

export const {
  clearPosts,
  setFilter,
  clearPost,
  deletePostFavorites,
  setPostToEdit,
} = postsSlice.actions;
export const postsReducer = postsSlice.reducer;
