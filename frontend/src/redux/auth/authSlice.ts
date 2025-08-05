import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./initialState";
import {
  signUp,
  logIn,
  logOut,
  refreshUser,
  verifyUser,
  resendVerifyUser,
  setNewPassword,
  forgotPassword,
  changePassword,
  checkPaymentStatus,
  unsubscribe,
} from "./auth.thunk";
import { AuthState } from "../../types/state.types";
import { GetUser, UserProfile } from "../../types/auth.types";

const handleFulfilled = (state: AuthState) => {
  state.isLogining = false;
};

const handleLoginFulfilled = (
  state: AuthState,
  action: PayloadAction<GetUser>
) => {
  state.isLoggedIn = true;
  state.token = action.payload.token;
  state.profile = action.payload.user;
  state.isLogining = false;
};

const handleLogOutFulfilled = (state: AuthState) => {
  state.isLoggedIn = false;
  state.profile = null;
  state.token = "";
  state.isLogining = false;
};

const handleCheckPaymentFulfilled = (
  state: AuthState,
  action: PayloadAction<{ subscription: string }>
) => {
  state.isLogining = false;
  if (state.profile) {
    state.profile.subscription = action.payload.subscription;
  }
};

const handleUnsubscribeFulfilled = (
  state: AuthState,
  action: PayloadAction<UserProfile>
) => {
  state.isLogining = false;
  state.profile = action.payload;
};

const handleRefreshPending = (state: AuthState) => {
  state.isRefreshing = true;
};

const handleRefreshFulfilled = (
  state: AuthState,
  action: PayloadAction<UserProfile>
) => {
  state.profile = action.payload;
  state.isLoggedIn = true;
  state.isLogining = false;
  state.isRefreshing = false;
};

const handleRefreshRejected = (
  state: AuthState,
  action: PayloadAction<unknown, string>
) => {
  if (action.payload !== "Network Error") {
    state.token = "";
  }
  state.isRefreshing = false;
  state.isLogining = false;
  state.isLoggedIn = false;
};

const handleRejected = (state: AuthState, action: PayloadAction<string>) => {
  state.error = action.payload;
  state.isLogining = false;
};

const handlePending = (state: AuthState) => {
  state.isLogining = true;
  state.error = "";
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setDailyDownloadCount(state: AuthState, action: PayloadAction<number>) {
      if (state.profile) {
        state.profile.dailyDownloadCount = action.payload;
      }
    },
    localLogOut(state: AuthState) {
      state.isLoggedIn = false;
      state.profile = null;
      state.token = "";
      state.isLogining = false;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(signUp.fulfilled, handleFulfilled)
      .addCase(logIn.fulfilled, handleLoginFulfilled)
      .addCase(logOut.fulfilled, handleLogOutFulfilled)
      .addCase(verifyUser.fulfilled, handleFulfilled)
      .addCase(resendVerifyUser.fulfilled, handleFulfilled)
      .addCase(setNewPassword.fulfilled, handleFulfilled)
      .addCase(forgotPassword.fulfilled, handleFulfilled)
      .addCase(changePassword.fulfilled, handleFulfilled)
      .addCase(checkPaymentStatus.fulfilled, handleCheckPaymentFulfilled)
      .addCase(refreshUser.fulfilled, handleRefreshFulfilled)
      .addCase(refreshUser.pending, handleRefreshPending)
      .addCase(refreshUser.rejected, handleRefreshRejected)
      .addCase(unsubscribe.fulfilled, handleUnsubscribeFulfilled)

      .addMatcher(
        ({ type }) => type.endsWith("/rejected") && type.startsWith("auth"),
        handleRejected
      )
      .addMatcher(
        ({ type }) => type.endsWith("/pending") && type.startsWith("auth"),
        handlePending
      ),
});

export const { setDailyDownloadCount, localLogOut } = authSlice.actions;
export const authReducer = authSlice.reducer;
