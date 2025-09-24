import type { Document, Types } from "mongoose";

export interface IShort extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  tags: string[];
  duration?: string;
  cover: string;
  video: string;
  files: { link: string; type: string };
  originalVideo?: string;
  free: boolean;
  likedBy?: Types.ObjectId[];
  bookmarked?: boolean;
  watched?: { progress: number };
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
