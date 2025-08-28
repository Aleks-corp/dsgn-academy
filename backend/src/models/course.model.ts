import { Schema, model } from "mongoose";
import type { ICourseVideo, ICourse } from "../types/course.type.js";

const videoSchema = new Schema<ICourseVideo>(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    originalUrl: { type: String },
    description: { type: String, required: true },
    cover: { type: String, required: true },
    duration: { type: String, required: true },
  },
  { _id: false }
);

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: [String], required: true },
    videos: { type: [videoSchema], required: true },
    favoritedBy: [{ type: Schema.Types.ObjectId, ref: "user" }],
    watchedBy: [{ type: Schema.Types.ObjectId, ref: "user" }],
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

export default model<ICourse>("course", courseSchema);
