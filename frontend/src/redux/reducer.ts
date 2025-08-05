// import persistReducer from "redux-persist/es/persistReducer";
// import { authReducer } from "./auth/authSlice";
// import { postsReducer } from "./posts/postSlice";
// import storage from "redux-persist/lib/storage";
// import { adminReducer } from "./admin/adminSlice";
import { testReducer } from "./test/testSlice";

// const persistConfig = {
//   key: "token",
//   storage,
//   whitelist: ["token"],
// };

// const persistedReducer = persistReducer(persistConfig, authReducer);

export const reducer = {
  // auth: persistedReducer,
  // posts: postsReducer,
  // admin: adminReducer,
  test: testReducer,
};
