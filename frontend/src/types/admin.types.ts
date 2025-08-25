import { IUser } from "./users.type";

export interface UserList {
  _id?: string;
  name: string;
  email: string;
  subscription: string;
}

export type ColumnId =
  | "name"
  | "email"
  | "subscription"
  | "status"
  | "lastPayedStatus"
  | "lastPayedDate"
  | "orderReference"
  | "substart"
  | "subend"
  | "regularDateEnd"
  | "phone"
  | "amount"
  | "mode"
  | "isBlocked";

export type ColumnState = "full" | "collapsed" | "hidden";

export type ColumnConfig = {
  id: ColumnId;
  label: string;
  icon: React.ReactNode;
  render: (u: IUser) => React.ReactNode;
  sortKey?: keyof UserList | "";
};
