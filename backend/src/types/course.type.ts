import type { Document } from "mongoose";

export interface ICourseVideo {
  url: string;
  description?: string;
}

export interface ICourse extends Document {
  _id: string;
  title: string;
  description: string;
  category: string[];
  author?: string;
  level?: string;
  videos: ICourseVideo[];
  favoritedBy: string[];
  watchedBy: string[];
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
