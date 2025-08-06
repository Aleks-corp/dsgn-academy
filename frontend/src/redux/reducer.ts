import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";

// import { adminReducer } from "./admin/adminSlice";
import { authReducer } from "./auth/authSlice";
import { courseReducer } from "./courses/courseSlice";
import { testReducer } from "./test/testSlice";
import { videoReducer } from "./videos/videoSlice";

const persistConfig = {
  key: "token",
  storage,
  whitelist: ["token"],
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const reducer = {
  auth: persistedReducer,
  courses: courseReducer,
  videos: videoReducer,
  // admin: adminReducer,
  test: testReducer,
};
