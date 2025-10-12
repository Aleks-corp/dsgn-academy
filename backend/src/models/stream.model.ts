import { Schema, model } from "mongoose";
import type { IStream } from "../types/stream.type.js";

const streamSchema = new Schema<IStream>(
  {
    title: { type: String, required: true },
    videoId: { type: String, required: true },
    startShowBannerAt: { type: Date, required: true },
    startStreamAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default model<IStream>("stream", streamSchema);
