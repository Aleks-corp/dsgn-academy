import type {
  Query,
  CallbackError,
  CallbackWithoutResultAndOptionalError,
  HydratedDocument,
  Model,
} from "mongoose";
import type { IUser } from "../types/user.type.js";

type IUserModelType = Model<IUser>;

export const handlerSaveError = (
  error: CallbackError & { code?: number; name?: string; status?: number },
  doc: HydratedDocument<IUser>,
  next: CallbackWithoutResultAndOptionalError
): void => {
  if (error.code === 11000 && error.name === "MongoServerError") {
    error.status = 409; // Конфлікт — дублювання запису
  } else {
    error.status = 400; // Інші помилки
  }
  next();
};

export const handleUpdateValidator = function (
  this: Query<IUser, IUserModelType> & { options: { runValidators: boolean } },
  next: CallbackWithoutResultAndOptionalError
): void {
  this.options.runValidators = true;
  next();
};

export default { handlerSaveError, handleUpdateValidator };
