import { Types } from "mongoose";
import { ShortModel } from "../models/index.js";
import {
  encodeCursor,
  decodeCursor,
  encodeCur,
  decodeCur,
} from "../utils/cursor.utils.js";
import type {
  PageResult,
  AroundArgs,
  AroundResult,
  IShort,
  PageArgs,
} from "../types/short.type.js";
import HttpError from "../utils/httperror.utils.js";

type TagsMode = "any" | "all";

export type FiltersQuery = {
  limit?: unknown;
  cursor?: unknown;
  tags?: unknown;
  tagsMode?: unknown;
  page?: unknown;
};

type SeqResult = Promise<{ ids: string[]; nextCursor: string | null }>;

function parseParams(q: FiltersQuery): {
  limit: number;
  cursor?: string;
  tags?: string[];
  tagsMode: TagsMode;
  page?: number;
} {
  // limit
  const limitNum =
    typeof q.limit === "number"
      ? q.limit
      : typeof q.limit === "string"
      ? Number(q.limit)
      : undefined;
  const limit = Number.isFinite(limitNum as number) ? (limitNum as number) : 18;

  // limit
  const pageNum =
    typeof q.page === "number"
      ? q.page
      : typeof q.page === "string"
      ? Number(q.page)
      : undefined;
  const page = Number.isFinite(pageNum as number) ? (pageNum as number) : 1;

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

  return { limit, page, cursor, tags: tagsArr, tagsMode };
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

export const listShorts = async (
  q: FiltersQuery
): Promise<{
  shorts: IShort[];
  total: number;
  page: number;
  limit: number;
}> => {
  const { limit = 20, page = 1, tags, tagsMode } = parseParams(q);
  const filter = buildFilter({ tags, tagsMode });

  const skip = (page - 1) * limit;
  const [docs, total] = await Promise.all([
    ShortModel.find(filter)
      .sort({ publishedAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean<IShort[]>(),
    ShortModel.countDocuments(filter),
  ]);
  return { shorts: docs, total, page, limit };
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
    .select({ _id: 1, publishedAt: 1 })
    .sort({ publishedAt: -1, _id: -1 })
    .limit(limit + 1)
    .lean<{ _id: Types.ObjectId; publishedAt: Date }[]>();

  const hasMore = docs.length > limit;
  const items = hasMore ? docs.slice(0, limit) : docs;

  const nextCursor = hasMore
    ? encodeCursor(
        items[items.length - 1].publishedAt,
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

export const shortsAroundService = async ({
  id,
  before,
  after,
}: AroundArgs): Promise<AroundResult> => {
  if (!Types.ObjectId.isValid(id)) throw HttpError(400, "Invalid id");

  const center = await ShortModel.findOne({ _id: id /* , published: true */ })
    .lean()
    .exec();
  if (!center) throw HttpError(404, "Short not found");

  // новіші за центр (йдуть "вище" у фіді)
  const newerQuery = {
    $or: [
      { publishedAt: { $gt: center.publishedAt } },
      {
        $and: [
          { publishedAt: center.publishedAt },
          { _id: { $gt: center._id } },
        ],
      },
    ],
    // + будь-які додаткові фільтри (наприклад, isPublished)
  };

  // старіші за центр (йдуть "нижче" у фіді)
  const olderQuery = {
    $or: [
      { publishedAt: { $lt: center.publishedAt } },
      {
        $and: [
          { publishedAt: center.publishedAt },
          { _id: { $lt: center._id } },
        ],
      },
    ],
  };

  const [beforeDocs, afterDocs] = await Promise.all([
    ShortModel.find(newerQuery)
      .sort({ publishedAt: 1, _id: 1 })
      .limit(before)
      .lean()
      .exec(),
    ShortModel.find(olderQuery)
      .sort({ publishedAt: -1, _id: -1 })
      .limit(after)
      .lean()
      .exec(),
  ]);

  // курсори
  let prevCursor: string | undefined;
  let nextCursor: string | undefined;

  if (beforeDocs.length === before && beforeDocs.length > 0) {
    // ще є "новіші" за поточну голову
    prevCursor = encodeCur(beforeDocs[beforeDocs.length - 1], "prev");
  } else if (beforeDocs.length === 0) {
    // якщо зовсім нема новіших, можна лишити undefined
  }

  if (afterDocs.length === after && afterDocs.length > 0) {
    // ще є "старіші" за поточний хвіст
    nextCursor = encodeCur(afterDocs[afterDocs.length - 1], "next");
  }
  console.log(">>> around prevCursor", prevCursor);
  console.log(">>> around nextCursor", nextCursor);
  return {
    center,
    before: beforeDocs.reverse(),
    after: afterDocs,
    prevCursor,
    nextCursor,
  };
};

export const shortsPageService = async ({
  cursor,
  limit,
}: PageArgs): Promise<PageResult> => {
  if (!cursor) throw HttpError(400, "Cursor is required");
  const { t, id, d } = decodeCur(cursor);

  const cmp =
    d === "next"
      ? {
          // старіші (рух вниз)
          $or: [
            { publishedAt: { $lt: t } },
            { $and: [{ publishedAt: t }, { _id: { $lt: id } }] },
          ],
        }
      : {
          // новіші (рух вгору)
          $or: [
            { publishedAt: { $gt: t } },
            { $and: [{ publishedAt: t }, { _id: { $gt: id } }] },
          ],
        };

  const items = await ShortModel.find(cmp)
    .sort(
      d === "next" ? { publishedAt: -1, _id: -1 } : { publishedAt: 1, _id: 1 }
    )
    .limit(limit)
    .lean()
    .exec();

  if (!items.length) {
    return { items: [], nextCursor: undefined, prevCursor: undefined };
  }

  // завжди повертаємо обидва курсори
  const nextCursor = encodeCur(items[items.length - 1], "next");
  const prevCursor = encodeCur(items[0], "prev");

  return { items, nextCursor, prevCursor };
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
  shortsAroundService,
  shortsPageService,
};
