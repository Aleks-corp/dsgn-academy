import type { FilterQuery, ObjectId } from "mongoose";

import { VideoModel, UserModel } from "../models/index.js";
import type { IVideo } from "../types/video.type.js";
import type { IUserFavWatched } from "../types/user.type.js";

const getVideosService = async (
  filter: FilterQuery<IVideo>,
  options: { limit: number; page: number }
): Promise<{
  videos: IVideo[];
  total: number;
  page: number;
  limit: number;
}> => {
  const { limit, page } = options;
  const skip = (page - 1) * limit;
  const [videos, total] = await Promise.all([
    VideoModel.find(filter, "-createdAt -updatedAt -video")
      .sort({ publishedAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .exec(),
    VideoModel.countDocuments(filter),
  ]);
  return { videos, total, page, limit };
};

export const getVideoByIdService = async (
  id: string
): Promise<IVideo | null> => {
  return await VideoModel.findById(id).exec();
};

export const getVideosCategoriesService = async (): Promise<
  { category: string; count: number }[]
> => {
  const categories = await VideoModel.aggregate([
    { $unwind: "$category" },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
    { $match: { _id: { $ne: "" } } },
    { $sort: { count: -1 } },
    {
      $project: {
        _id: 0,
        category: "$_id",
        count: 1,
      },
    },
  ]);
  return categories;
};

export const getVideosFiltersService = async (
  baseFilter: FilterQuery<IVideo> = {}
): Promise<{ filter: string; count: number }[]> => {
  const filters = await VideoModel.aggregate([
    { $match: baseFilter }, // 🟢 додаємо умову
    { $unwind: "$filter" },
    {
      $group: {
        _id: "$filter",
        count: { $sum: 1 },
      },
    },
    { $match: { _id: { $ne: "" } } },
    { $sort: { count: -1 } },
    {
      $project: {
        _id: 0,
        filter: "$_id",
        count: 1,
      },
    },
  ]);
  return filters;
};

export const getVideosTotalService = async (
  filter: FilterQuery<IVideo>
): Promise<number> => {
  const count = await VideoModel.countDocuments(filter);
  return count;
};

export const getFavoriteWatchedVideosService = async (
  videoIds: IUserFavWatched[],
  options: { limit: number; page: number }
): Promise<{
  videos: IVideo[];
  total: number;
  cleanIds: IUserFavWatched[];
}> => {
  const sorted = videoIds.sort(
    (a: IUserFavWatched, b: IUserFavWatched) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  const allIds = sorted.map((i) => i.id);
  const videos = await VideoModel.find({ _id: { $in: allIds } })
    .select("-video -updatedAt -createdAt")
    .lean();
  const videoMap = new Map(videos.map((v) => [v._id.toString(), v]));
  const valid = sorted.filter((y) => videoMap.has(y.id.toString()));
  const slice = valid.slice(
    (options.page - 1) * options.limit,
    options.page * options.limit
  );
  const ordered = slice
    .map((f) => videoMap.get(f.id.toString()))
    .filter(Boolean) as IVideo[];
  return { videos: ordered, total: valid.length, cleanIds: valid };
};

export const addVideoService = async (body: IVideo): Promise<IVideo> => {
  return VideoModel.create(body);
};

export const updateVideoService = async (
  id: string,
  data: Partial<IVideo>
): Promise<IVideo | null> => {
  return VideoModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).exec();
};

export const deleteVideoByIdService = async (
  id: string
): Promise<IVideo | null> => {
  return VideoModel.findByIdAndDelete(id).exec();
};

export const toggleFavoriteVideoService = async (
  userId: string | ObjectId,
  videoId: string
): Promise<{ action: "added to" | "removed from" }> => {
  const user = await UserModel.findById(userId);
  if (!user) throw new Error("User not found");

  const isFavorite = user.favoritesCourses?.some(
    (id) => id.toString() === videoId
  );

  const action = isFavorite ? "removed from" : "added to";

  await UserModel.findByIdAndUpdate(userId, {
    [isFavorite ? "$pull" : "$addToSet"]: { favoritesCourses: videoId },
  });

  await VideoModel.findByIdAndUpdate(videoId, {
    [isFavorite ? "$pull" : "$addToSet"]: { favoritedBy: userId },
  });

  return { action };
};

export default {
  getVideosService,
  getVideoByIdService,
  getVideosCategoriesService,
  getVideosFiltersService,
  getVideosTotalService,
  getFavoriteWatchedVideosService,
  addVideoService,
  updateVideoService,
  deleteVideoByIdService,
  toggleFavoriteVideoService,
};
