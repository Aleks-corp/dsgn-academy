import type { Document } from "mongoose";

export interface ICourseVideo {
  url: string;
  description: string;
  cover?: string;
}

export interface ICourse extends Document {
  _id: string;
  title: string;
  description: string;
  category: string[];
  videos: ICourseVideo[];
  author?: string;
  level?: string;
  favoritedBy?: string[];
  watchedBy?: string[];
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
