import type { ErrorMessage } from "../types/error.type.js";

const errorMessage: ErrorMessage = {
  400: "Bad Request",
  401: "Not authorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
};

export class CustomError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const HttpError = (
  status: number,
  message: string = errorMessage[status]
): CustomError => {
  const error = new CustomError(status, message);
  return error;
};

export default HttpError;
