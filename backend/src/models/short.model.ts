import { Schema, model } from "mongoose";
import type { IShort } from "../types/short.type";

const fileSchema = new Schema(
  {
    link: { type: String, required: true },
    type: { type: String, required: true },
  },
  { _id: false }
);

const shortSchema = new Schema<IShort>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    tags: { type: [String], required: true, default: [], index: true },
    duration: { type: String, min: 0 },
    cover: { type: String },
    video: { type: String, required: true },
    files: { type: fileSchema, required: true },
    originalVideo: { type: String },
    free: { type: Boolean, default: true, index: true },
    likedBy: [{ type: Schema.Types.ObjectId, ref: "user" }],
    publishedAt: { type: Date, default: new Date() },
  },
  { timestamps: true }
);
shortSchema.index({ publishedAt: -1, _id: -1 });

export default model<IShort>("short", shortSchema);
