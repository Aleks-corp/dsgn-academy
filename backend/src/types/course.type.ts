import type { Document, Types } from "mongoose";

export interface ICourseVideo extends Document {
  _id: Types.ObjectId;
  title: string;
  url: string;
  originalUrl: string;
  description: string;
  duration: string;
  cover: string;
  watched?: { progress: number };
}

export interface ICourse extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  category: string[];
  videos: ICourseVideo[];
  likedBy?: Types.ObjectId[];
  bookmarked?: boolean;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
