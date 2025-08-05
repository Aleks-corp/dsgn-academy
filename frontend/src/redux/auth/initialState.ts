import { AuthState } from "../../types/state.types";

export const initialState: AuthState = {
  token: "",
  isLoggedIn: false,
  isRefreshing: true,
  isLogining: false,
  error: "",
  profile: null,
};
