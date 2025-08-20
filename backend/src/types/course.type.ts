import type { Document } from "mongoose";

export interface ICourseVideo {
  title: string;
  url: string;
  description: string;
  duration: string;
  cover: string;
}

export interface ICourse extends Document {
  _id: string;
  title: string;
  description: string;
  category: string[];
  videos: ICourseVideo[];
  favoritedBy?: string[];
  watchedBy?: string[];
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
