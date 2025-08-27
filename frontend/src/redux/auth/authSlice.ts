import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./initialState";
import {
  signUp,
  signIn,
  signOut,
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
import { IUser, GetUser, UserSubscription } from "../../types/users.type";
import { delToken } from "@/lib/api/axios";

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
  action: PayloadAction<{ subscription: UserSubscription }>
) => {
  state.isLogining = false;
  if (state.profile) {
    state.profile.subscription = action.payload.subscription;
  }
};

const handleUnsubscribeFulfilled = (
  state: AuthState,
  action: PayloadAction<{ user: IUser | null; message: string }>
) => {
  state.isLogining = false;
  if (state.profile && action.payload.user) {
    state.profile.status = action.payload.user.status;
    state.profile.regularDateEnd = action.payload.user.regularDateEnd;
  }
};

const handleRefreshPending = (state: AuthState) => {
  state.isRefreshing = true;
};

const handleRefreshFulfilled = (
  state: AuthState,
  action: PayloadAction<IUser>
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
    delToken();
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
    localLogOut(state: AuthState) {
      state.isLoggedIn = false;
      state.profile = null;
      state.token = "";
      state.isLogining = false;
    },
    localLogIn(state: AuthState, action: PayloadAction<GetUser>) {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.profile = action.payload.user;
      state.isLogining = false;
    },
    setNewName(state: AuthState, action: PayloadAction<{ name: string }>) {
      if (state.profile) state.profile.name = action.payload.name;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(signUp.fulfilled, handleFulfilled)
      .addCase(signIn.fulfilled, handleLoginFulfilled)
      .addCase(signOut.fulfilled, handleLogOutFulfilled)
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

export const { localLogOut, localLogIn, setNewName } = authSlice.actions;
export const authReducer = authSlice.reducer;
