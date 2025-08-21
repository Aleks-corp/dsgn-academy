import { ShortState } from "../../types/state.types";

export const initialState: ShortState = {
  shorts: [],
  totalShorts: undefined,
  selectedShort: null,
  isLoading: false,
  error: "",
  shortToEdit: null,
};
