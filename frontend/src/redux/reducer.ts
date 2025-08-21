import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";

// import { adminReducer } from "./admin/adminSlice";
import { authReducer } from "./auth/authSlice";
import { courseReducer } from "./courses/courseSlice";
import { testReducer } from "./test/testSlice";
import { videoReducer } from "./videos/videoSlice";
import { shortReducer } from "./shorts/shortsSlice";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["token"], // зберігати тільки token
};

const testPersistConfig = {
  key: "test",
  storage,
  whitelist: ["isTester"], // зберігати тільки isTester
};

export const reducer = {
  auth: persistReducer(authPersistConfig, authReducer),
  courses: courseReducer,
  videos: videoReducer,
  shorts: shortReducer,
  // admin: adminReducer,
  test: persistReducer(testPersistConfig, testReducer),
};
