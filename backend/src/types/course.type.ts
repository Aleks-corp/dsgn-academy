import type { Document, Types } from "mongoose";

export interface ICourseVideo {
  title: string;
  url: string;
  originalUrl: string;
  description: string;
  duration: string;
  cover: string;
}

export interface ICourse extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  category: string[];
  videos: ICourseVideo[];
  likedBy?: Types.ObjectId[];
  bookmarked?: boolean;
  watched?: { progress: number };
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
