import type { Document, Types } from "mongoose";

export interface IStream extends Document {
  _id: Types.ObjectId;
  title: string;
  videoId: string;
  startShowBannerAt: Date;
  startStreamAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
