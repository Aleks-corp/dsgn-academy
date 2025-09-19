import type { Document, Types } from "mongoose";

export interface IShort extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  tags: string[];
  duration?: string;
  cover: string;
  video: string;
  originalVideo?: string;
  free: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type AroundArgs = { id: string; before: number; after: number };
export type PageArgs = { cursor: string; limit: number };

export type AroundResult = {
  center: IShort;
  before: IShort[];
  after: IShort[];
  prevCursor?: string;
  nextCursor?: string;
};

export type PageResult = {
  items: IShort[];
  nextCursor?: string;
  prevCursor?: string;
};
