import { Types } from "mongoose";
import { ShortModel } from "../models/index.js";
import { encodeCursor, decodeCursor } from "../utils/cursor.utils.js";
import type { IShort } from "../types/short.type.js";

type TagsMode = "any" | "all";

export type FiltersQuery = {
  limit?: unknown;
  cursor?: unknown;
  tags?: unknown;
  tagsMode?: unknown;
};

type ListResult = Promise<{ shorts: IShort[]; nextCursor: string | null }>;
type SeqResult = Promise<{ ids: string[]; nextCursor: string | null }>;

function parseParams(q: FiltersQuery): {
  limit: number;
  cursor?: string;
  tags?: string[];
  tagsMode: TagsMode;
} {
  // limit
  const limitNum =
    typeof q.limit === "number"
      ? q.limit
      : typeof q.limit === "string"
      ? Number(q.limit)
      : undefined;
  const limit = Number.isFinite(limitNum as number) ? (limitNum as number) : 18;

  // cursor
  const cursor =
    typeof q.cursor === "string" && q.cursor.trim() !== ""
      ? q.cursor.trim()
      : undefined;

  // tags
  let tagsArr: string[] | undefined;
  if (typeof q.tags === "string" && q.tags.trim() !== "") {
    tagsArr = q.tags
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  // tagsMode
  const tagsMode: TagsMode =
    q.tagsMode === "all" || q.tagsMode === "any" ? q.tagsMode : "any";

  return { limit, cursor, tags: tagsArr, tagsMode };
}

function buildFilter(params: {
  cursor?: string;
  tags?: string[];
  tagsMode: TagsMode;
}): Record<string, unknown> {
  const { cursor, tags, tagsMode } = params;
  const now = new Date();

  const filter: Record<string, unknown> = {
    publishedAt: { $lte: now },
  };

  if (tags && tags.length) {
    filter.tags = tagsMode === "all" ? { $all: tags } : { $in: tags };
  }

  if (cursor) {
    const cur = decodeCursor(cursor);
    if (cur) {
      filter.$or = [
        { createdAt: { $lt: new Date(cur.createdAt) } },
        {
          createdAt: new Date(cur.createdAt),
          _id: { $lt: new Types.ObjectId(cur.id) },
        },
      ];
    }
  }

  return filter;
}

export const listShorts = async (q: FiltersQuery): ListResult => {
  const { limit, cursor, tags, tagsMode } = parseParams(q);
  const filter = buildFilter({ cursor, tags, tagsMode });

  const docs = await ShortModel.find(filter)
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit + 1)
    .lean<IShort[]>();

  const hasMore = docs.length > limit;
  const shorts = hasMore ? docs.slice(0, limit) : docs;

  const nextCursor = hasMore
    ? encodeCursor(
        shorts[shorts.length - 1].createdAt,
        String(shorts[shorts.length - 1]._id)
      )
    : null;

  return { shorts, nextCursor };
};

export const getShortsTotalService = async (): Promise<number> => {
  const count = await ShortModel.countDocuments();
  return count;
};

export const getShortById = async (id: string): Promise<IShort | null> => {
  const now = new Date();
  return ShortModel.findOne({
    _id: id,
    publishedAt: { $lte: now },
  }).lean<IShort | null>();
};

export const getSequence = async (q: FiltersQuery): SeqResult => {
  const { limit, cursor, tags, tagsMode } = parseParams(q);
  const filter = buildFilter({ cursor, tags, tagsMode });

  const docs = await ShortModel.find(filter)
    .select({ _id: 1, createdAt: 1 })
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit + 1)
    .lean<{ _id: Types.ObjectId; createdAt: Date }[]>();

  const hasMore = docs.length > limit;
  const items = hasMore ? docs.slice(0, limit) : docs;

  const nextCursor = hasMore
    ? encodeCursor(
        items[items.length - 1].createdAt,
        String(items[items.length - 1]._id)
      )
    : null;

  return { ids: items.map((d) => String(d._id)), nextCursor };
};

export const createShort = async (
  payload: Partial<IShort>
): Promise<IShort> => {
  return ShortModel.create(payload);
};

export const updateShort = async (
  id: string,
  payload: Partial<IShort>
): Promise<IShort | null> => {
  return ShortModel.findByIdAndUpdate(id, payload, {
    new: true,
  }).lean<IShort | null>();
};

export const deleteShort = async (id: string): Promise<{ ok: true }> => {
  await ShortModel.findByIdAndDelete(id);
  return { ok: true };
};

export const topTags = async (
  limit = 20
): Promise<{ tag: string; count: number }[]> => {
  const now = new Date();
  const agg = await ShortModel.aggregate([
    { $match: { publishedAt: { $lte: now } } },
    { $unwind: "$tags" },
    { $group: { _id: "$tags", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
    { $project: { tag: "$_id", count: 1, _id: 0 } },
  ]);
  return agg as { tag: string; count: number }[];
};

export default {
  listShorts,
  getShortsTotalService,
  getShortById,
  getSequence,
  createShort,
  updateShort,
  deleteShort,
  topTags,
};
