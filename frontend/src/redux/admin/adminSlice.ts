import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./initialState";
import {
  getAllUsers,
  patchUser,
  patchUsers,
  banUsers,
  patchCheckSub,
  sendMessageSpt,
} from "./admin.thunk";
import { AdminState } from "../../types/state.types";
import { IUser } from "@/types/users.type";
import toast from "react-hot-toast";

const handleGetAllUsersPending = (
  state: AdminState,
  action: { meta: { arg: { page?: number; search?: string } } }
) => {
  state.isLoadingMore = true;
  state.error = "";
  // новий пошук (page 1) замінює список; пагінація (page > 1) його доповнює
  if ((action.meta.arg.page ?? 1) === 1) {
    state.currentSearch = action.meta.arg.search ?? "";
  }
};

const handlePatchUsersPending = (state: AdminState) => {
  state.isLoadingUpdate = true;
  state.error = "";
};

const handlePatchCheckSubPending = (state: AdminState) => {
  state.isLoadingCheck = true;
  state.error = "";
};

const handleGetAllUsersFulfilled = (
  state: AdminState,
  action: PayloadAction<
    { users: IUser[]; totalHits: number },
    string,
    { arg: { page?: number; search?: string } }
  >
) => {
  state.isLoadingMore = false;
  // відповідь на застарілий пошук ігноруємо
  if ((action.meta.arg.search ?? "") !== state.currentSearch) return;
  if ((action.meta.arg.page ?? 1) === 1) {
    state.folowers = action.payload.users;
  } else {
    const newUsers = action.payload.users.filter(
      (newUser) =>
        !state.folowers.some((existingUser) => existingUser._id === newUser._id)
    );
    state.folowers = [...state.folowers, ...newUsers];
  }
  state.totalFolowers = action.payload.totalHits;
};

const handlePatchUserFulfilled = (
  state: AdminState,
  action: PayloadAction<IUser>
) => {
  state.isLoadingUpdate = false;
  const index = state.folowers.findIndex((i) => action.payload._id === i._id);
  state.folowers.splice(index, 1, action.payload);
};

const mergeUsers = (state: AdminState, users: IUser[]) => {
  const byId = new Map(users.map((u) => [u._id, u]));
  state.folowers = state.folowers.map((u) => byId.get(u._id) ?? u);
};

const handlePatchUsersFulfilled = (
  state: AdminState,
  action: PayloadAction<{ users: IUser[]; usersId: string[] }>
) => {
  state.isLoadingUpdate = false;
  mergeUsers(state, action.payload.users);
};

const handlePatchCheckSubFulfilled = (
  state: AdminState,
  action: PayloadAction<{ users: IUser[]; usersId: string[] }>
) => {
  state.isLoadingCheck = false;
  mergeUsers(state, action.payload.users);
};

const handleSendMessageSptPending = (state: AdminState) => {
  state.error = "";
};
const handleSendMessageSptFulfilled = (
  state: AdminState,
  action: PayloadAction<string>
) => {
  if (action.payload === "Message sent") {
    toast.success(action.payload);
  } else {
    toast.error("Message not sent, please try again");
  }
  state.error = "";
};

const handleRejected = (state: AdminState, action: PayloadAction<string>) => {
  state.isLoading = false;
  state.isLoadingCheck = false;
  state.isLoadingUpdate = false;
  state.isLoadingMore = false;
  state.error = action.payload;
};

const adminSlice = createSlice({
  name: "admin",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(getAllUsers.pending, handleGetAllUsersPending)
      .addCase(getAllUsers.fulfilled, handleGetAllUsersFulfilled)
      .addCase(patchUser.pending, handlePatchUsersPending)
      .addCase(patchUser.fulfilled, handlePatchUserFulfilled)
      .addCase(patchUsers.pending, handlePatchUsersPending)
      .addCase(patchUsers.fulfilled, handlePatchUsersFulfilled)
      .addCase(banUsers.pending, handlePatchUsersPending)
      .addCase(banUsers.fulfilled, handlePatchUsersFulfilled)
      .addCase(patchCheckSub.pending, handlePatchCheckSubPending)
      .addCase(patchCheckSub.fulfilled, handlePatchCheckSubFulfilled)
      .addCase(sendMessageSpt.pending, handleSendMessageSptPending)
      .addCase(sendMessageSpt.fulfilled, handleSendMessageSptFulfilled)
      .addMatcher(
        ({ type }) => type.endsWith("/rejected") && type.startsWith("admin"),
        handleRejected
      ),
});

export const adminReducer = adminSlice.reducer;
