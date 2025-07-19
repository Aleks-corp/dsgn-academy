export interface Err extends Error {
  status: number;
}

export type ErrorMessage = {
  [key: number]: string;
};
