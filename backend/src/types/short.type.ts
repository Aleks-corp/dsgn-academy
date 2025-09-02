import type { Document, Types } from "mongoose";

export interface IShort extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  tags: string[];
  duration?: string;
  cover: string;
  video: string;
  originalVideo?: string;
  free: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
