// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { initialState } from "./initialState";
// import { isAlpha, isTester } from "./test.thunk";
// import { TestState } from "@/types/state.types";

// const handleAlphaFulfilled = (
//   state: TestState,
//   action: PayloadAction<{ isAlpha: boolean; timer: number }>
// ) => {
//   state.isLoading = false;
//   state.isAlpha = action.payload.isAlpha;
//   state.timer = action.payload.timer;
// };

// const handleTesterFulfilled = (
//   state: TestState,
//   action: PayloadAction<{ isTester: boolean }>
// ) => {
//   state.isLoading = false;
//   state.isTester = action.payload.isTester;
// };

// const handleRejected = (state: TestState, action: PayloadAction<string>) => {
//   state.error = action.payload;
//   state.isLoading = false;
// };

// const handlePending = (state: TestState) => {
//   state.isLoading = true;
//   state.error = "";
// };

// const testSlice = createSlice({
//   name: "test",
//   initialState: initialState,
//   reducers: {},
//   extraReducers: (builder) =>
//     builder
//       .addCase(isAlpha.fulfilled, handleAlphaFulfilled)
//       .addCase(isTester.fulfilled, handleTesterFulfilled)
//       .addMatcher(
//         ({ type }) => type.endsWith("/rejected") && type.startsWith("test"),
//         handleRejected
//       )
//       .addMatcher(
//         ({ type }) => type.endsWith("/pending") && type.startsWith("test"),
//         handlePending
//       ),
// });

// export const testReducer = testSlice.reducer;
