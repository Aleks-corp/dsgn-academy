import type { FilterQuery, Types } from "mongoose";
import { VideoModel } from "../models/index.js";
import type { IVideo } from "../types/video.type.js";
import type { IUserWatched } from "../types/user.type.js";

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
    VideoModel.find(
      filter,
      "-createdAt -updatedAt -video -likedBy -favoritedBy -watchedBy"
    )
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
    { $match: baseFilter },
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

export const checkBookmarkedVideosService = async (
  videoIds: Types.ObjectId[]
): Promise<{ cleanIds: Types.ObjectId[] }> => {
  const cleanVideo = await VideoModel.find({ _id: { $in: videoIds } }, "_id");
  const cleanIds = cleanVideo.map((v) => v._id);
  return { cleanIds };
};

export const getBookmarkedVideosService = async (
  videoIds: Types.ObjectId[],
  options: { limit: number; page: number }
): Promise<{ videos: IVideo[]; total: number }> => {
  const { limit, page } = options;
  const skip = (page - 1) * limit;

  const [videos, total] = await Promise.all([
    VideoModel.find(
      { _id: { $in: videoIds } },
      "-createdAt -updatedAt -video -likedBy -favoritedBy -watchedBy"
    )
      .sort({ publishedAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .exec(),
    VideoModel.countDocuments({ _id: { $in: videoIds } }),
  ]);

  return { videos, total };
};

export const getWatchedVideosService = async (
  watched: IUserWatched[],
  options: { limit: number; page: number }
): Promise<{ videos: IVideo[]; total: number; cleanIds: Types.ObjectId[] }> => {
  const { limit, page } = options;
  const skip = (page - 1) * limit;

  const ids = watched.map((w) => w.id);

  const [videos, total] = await Promise.all([
    VideoModel.find(
      { _id: { $in: ids } },
      "-createdAt -updatedAt -video -likedBy -favoritedBy -watchedBy"
    )
      .sort({ publishedAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .exec(),
    VideoModel.countDocuments({ _id: { $in: ids } }),
  ]);

  const cleanIds = videos.map((v) => v._id);

  return { videos, total, cleanIds };
};

export const toggleLikeVideoService = async (
  userId: Types.ObjectId | string,
  videoId: Types.ObjectId | string
): Promise<{ action: "liked" | "unliked" }> => {
  const video = await VideoModel.findById(videoId);
  if (!video) throw new Error("Video not found");

  const hasLiked = video.likedBy?.some(
    (id) => id.toString() === userId.toString()
  );

  if (hasLiked) {
    await VideoModel.findByIdAndUpdate(videoId, {
      $pull: { likedBy: userId },
    });
    return { action: "unliked" };
  } else {
    await VideoModel.findByIdAndUpdate(videoId, {
      $addToSet: { likedBy: userId },
    });
    return { action: "liked" };
  }
};

export default {
  getVideosService,
  getVideoByIdService,
  getVideosCategoriesService,
  getVideosFiltersService,
  getVideosTotalService,
  addVideoService,
  updateVideoService,
  deleteVideoByIdService,
  checkBookmarkedVideosService,
  getBookmarkedVideosService,
  getWatchedVideosService,
  toggleLikeVideoService,
};
