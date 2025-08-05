import type { IUser } from "../types/user.type.js";
// import type {
//   PaymentData,
//   RequestData,
//   ResponseData,
// } from "../types/data.types.js";
import { UserModel } from "../models/index.js";

export const isTesterService = async (id: string): Promise<IUser | null> => {
  return UserModel.findById(id).exec();
};

export default {
  isTesterService,
};
