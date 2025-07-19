import type { Document } from "mongoose";

export interface ICourseVideo {
  url: string;
  description?: string;
}

export interface ICourse extends Document {
  title: string;
  description: string;
  category: string[];
  author?: string;
  level?: string;
  videos: ICourseVideo[];
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
