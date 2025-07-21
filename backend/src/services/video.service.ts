import type { FilterQuery, ObjectId } from "mongoose";

import { VideoModel, UserModel } from "../models/index.js";
import type { IVideo } from "../types/video.type.js";

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
    VideoModel.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
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
  return VideoModel.findById(id).exec();
};

export const addVideoService = async (
  data: Partial<IVideo>
): Promise<IVideo> => {
  return VideoModel.create(data);
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
  addVideoService,
  updateVideoService,
  deleteVideoByIdService,
  toggleFavoriteVideoService,
};
