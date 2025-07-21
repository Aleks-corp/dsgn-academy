import type { IUser } from "./user.type.js";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

export {};
