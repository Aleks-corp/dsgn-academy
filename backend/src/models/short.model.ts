import { Schema, model } from "mongoose";
import type { IShort } from "../types/short.type";

const shortSchema = new Schema<IShort>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    tags: { type: [String], required: true, default: [], index: true },
    duration: { type: String, min: 0 },
    cover: { type: String },
    video: { type: String, required: true },
    originalVideo: { type: String },
    free: { type: Boolean, default: true, index: true },
    publishedAt: { type: Date, default: new Date() },
  },
  { timestamps: true }
);
shortSchema.index({ createdAt: -1, _id: -1 });

export default model<IShort>("short", shortSchema);
