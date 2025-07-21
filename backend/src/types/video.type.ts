import type { Document } from "mongoose";

export interface IVideo extends Document {
  _id: string;
  title: string;
  description: string;
  category: string[];
  author?: string;
  level?: string;
  video: string;
  favoritedBy: string[];
  watchedBy: string[];
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
