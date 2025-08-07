import type { Document } from "mongoose";

export interface IVideo extends Document {
  _id: string;
  title: string;
  description: string;
  category: string[];
  video: string;
  cover?: string;
  author?: string;
  level?: string;
  favoritedBy?: string[];
  watchedBy?: string[];
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
