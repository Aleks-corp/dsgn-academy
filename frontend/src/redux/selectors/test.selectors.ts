import { State } from "../../types/state.types";

export const selectIsLoadingTest = (state: State) => state.test.isLoading;

export const selectIsAlpha = (state: State) => state.test.isAlpha;

export const selectIsTester = (state: State) => state.test.isTester;

export const selectTimer = (state: State) => state.test.timer;
