import { Schema, model } from "mongoose";
import type { IVideo } from "../types/video.type.js";

const videoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: String },
    category: { type: [String] },
    level: { type: String, enum: ["beginner", "intermediate", "advanced"] },
    video: { type: String, required: true },
    cover: { type: String, required: true },
    favoritedBy: [{ type: Schema.Types.ObjectId, ref: "user" }],
    watchedBy: [{ type: Schema.Types.ObjectId, ref: "user" }],
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

export default model<IVideo>("video", videoSchema);
