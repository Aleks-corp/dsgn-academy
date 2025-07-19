import { Schema, model } from "mongoose";
import type { ICourseVideo, ICourse } from "../types/course.type.js";

const videoSchema = new Schema<ICourseVideo>(
  {
    url: { type: String, required: true },
    description: { type: String },
  },
  { _id: false }
);

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: String },
    category: { type: [String] },
    level: { type: String, enum: ["beginner", "intermediate", "advanced"] },
    videos: { type: [videoSchema], required: true },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

export default model<ICourse>("course", courseSchema);
