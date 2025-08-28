import type { Document, Types } from "mongoose";

export interface IVideo extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  filter: string[];
  category: string[];
  video: string;
  originalVideo?: string;
  cover: string;
  duration: string;
  free: boolean;
  recommended: boolean;
  favoritedBy?: string[];
  watchedBy?: string[];
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
