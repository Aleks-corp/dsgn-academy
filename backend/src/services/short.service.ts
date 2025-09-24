import type { Types } from "mongoose";
import { ShortModel } from "../models/index.js";
import type { IShort } from "../types/short.type.js";
import type { IUserWatched } from "../types/user.type.js";

type TagsMode = "any" | "all";

export type FiltersQuery = {
  limit?: unknown;
  cursor?: unknown;
  tags?: unknown;
  tagsMode?: unknown;
  page?: unknown;
};

function parseParams(q: FiltersQuery): {
  limit: number;
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

  return { limit, page, tags: tagsArr, tagsMode };
}

function buildFilter(params: {
  tags?: string[];
  tagsMode: TagsMode;
}): Record<string, unknown> {
  const { tags, tagsMode } = params;
  const now = new Date();

  const filter: Record<string, unknown> = {
    publishedAt: { $lte: now },
  };

  if (tags && tags.length) {
    filter.tags = tagsMode === "all" ? { $all: tags } : { $in: tags };
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

export const getBookmarkedShortsService = async (
  shortIds: (Types.ObjectId | string)[],
  options: { limit: number; page: number }
): Promise<{ shorts: IShort[]; total: number; cleanIds: Types.ObjectId[] }> => {
  const { limit, page } = options;
  const skip = (page - 1) * limit;

  const [shorts, total] = await Promise.all([
    ShortModel.find({ _id: { $in: shortIds } }, "-updatedAt")
      .sort({ publishedAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .exec(),
    ShortModel.countDocuments({ _id: { $in: shortIds } }),
  ]);

  // чистимо ті id, яких вже немає в базі
  const cleanIds = shorts.map((s) => s._id);

  return { shorts, total, cleanIds };
};

export const getWatchedShortsService = async (
  watched: IUserWatched[],
  options: { limit: number; page: number }
): Promise<{ shorts: IShort[]; total: number; cleanIds: Types.ObjectId[] }> => {
  const { limit, page } = options;
  const skip = (page - 1) * limit;

  const ids = watched.map((w) => w.id);

  const [shorts, total] = await Promise.all([
    ShortModel.find({ _id: { $in: ids } }, "-updatedAt")
      .sort({ publishedAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .exec(),
    ShortModel.countDocuments({ _id: { $in: ids } }),
  ]);

  const cleanIds = shorts.map((s) => s._id);

  return { shorts, total, cleanIds };
};

export const toggleLikeShortService = async (
  userId: Types.ObjectId | string,
  shortId: Types.ObjectId | string
): Promise<{ action: "liked" | "unliked" }> => {
  const short = await ShortModel.findById(shortId);
  if (!short) throw new Error("Short not found");

  const hasLiked = short.likedBy?.some(
    (id) => id.toString() === userId.toString()
  );

  if (hasLiked) {
    await ShortModel.findByIdAndUpdate(shortId, {
      $pull: { likedBy: userId },
    });
    return { action: "unliked" };
  } else {
    await ShortModel.findByIdAndUpdate(shortId, {
      $addToSet: { likedBy: userId },
    });
    return { action: "liked" };
  }
};

export default {
  listShorts,
  getShortsTotalService,
  getShortById,
  createShort,
  updateShort,
  deleteShort,
  topTags,
  getBookmarkedShortsService,
  getWatchedShortsService,
  toggleLikeShortService,
};
