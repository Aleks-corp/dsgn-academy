import type { Request, Response } from "express";
import type { FilterQuery } from "mongoose";
import type { IVideo } from "../types/video.type.js";
import { videoServices } from "../services/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import { HttpError, fetchVideoDataById } from "../utils/index.js";
import {
  toggleBookmarkedVideoService,
  updateBookmarkedVideosService,
  updateWatchedVideosService,
  syncWatchedVideosService,
} from "../services/user.service.js";

const {
  getVideosService,
  getVideoByIdService,
  getVideosCategoriesService,
  getVideosFiltersService,
  getVideosTotalService,
  addVideoService,
  updateVideoService,
  deleteVideoByIdService,
  getBookmarkedVideosService,
  getWatchedVideosService,
  toggleLikeVideoService,
} = videoServices;

/**
 * GET /video
 * Query: ?q=searchText&category=Figma&filter=props&free=true&recommended=true&page=1&limit=12
 */
export const getVideos = async (req: Request, res: Response): Promise<void> => {
  const { q, category, filter, limit = 3, page = 1 } = req.query;
  const free = req.query.free === "true";
  const recommended = req.query.recommended === "true";
  const currentTime = new Date();

  const filtersQuery: Record<string, unknown> = {};
  filtersQuery.publishedAt = { $lte: currentTime };
  if (typeof category === "string" && category.trim() !== "") {
    filtersQuery.category = { $in: [category.trim()] };
  }
  if (typeof filter === "string" && filter.trim() !== "") {
    filtersQuery.filter = { $in: [filter.trim()] };
  }
  if (typeof q === "string" && q.trim() !== "") {
    const regex = new RegExp(q.trim(), "i");
    filtersQuery.title = regex;
  }
  if (free) filtersQuery.free = true;
  if (recommended) filtersQuery.recommended = true;

  const perPage = Math.max(1, Number(limit));
  const currentPage = Math.max(1, Number(page));
  const { videos, total } = await getVideosService(filtersQuery, {
    limit: perPage,
    page: currentPage,
  });
  if (videos.length === 0 || total === 0) {
    throw HttpError(404, "Відео не знайдено");
  }
  let patchedVideos = videos;
  if (req.user) {
    patchedVideos = videos.map((video) => {
      const isBookmarked = req.user?.bookmarkedVideos?.some(
        (b) => b.toString() === video._id.toString()
      );
      const progress = req.user?.watchedVideos?.find(
        (w) => w.id.toString() === video._id.toString()
      );
      return {
        ...video.toObject(),
        bookmarked: isBookmarked || false,
        watched: { progress: progress?.currentTime || 0 },
      };
    });
  }
  res.json({
    videos: patchedVideos,
    total,
    page: currentPage,
    limit: perPage,
    hasMore: (currentPage - 1) * perPage + videos.length < total,
  });
};

export const getVideosCounts = async (
  req: Request,
  res: Response
): Promise<void> => {
  const category = req.params.category || "";
  // фільтр тільки для filters
  let filterForFilters: FilterQuery<IVideo> = {};

  if (category === "free") {
    filterForFilters = { free: true };
  } else if (category && category !== "all") {
    filterForFilters = { category };
  }

  const categories = await getVideosCategoriesService(); // як було
  const filters = await getVideosFiltersService(filterForFilters); // сюди підставляємо
  const totalFree = await getVideosTotalService({ free: true }); // глобально
  const totalVideos = await getVideosTotalService({}); // глобально

  res.json({
    categories,
    filters,
    totalFree,
    totalVideos,
  });
};

export const getVideoById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const user = req.user;
  const video = await getVideoByIdService(id);
  if (!video) {
    throw HttpError(404, "Video not found");
  }
  const bookmarked =
    user?.bookmarkedVideos?.some(
      (b) => b.toString() === video._id.toString()
    ) || false;
  const progress = user?.watchedVideos?.find(
    (w) => w.id.toString() === video._id.toString()
  );
  res.json({
    ...video.toObject(),
    bookmarked,
    watched: { progress: progress?.currentTime || 0 },
  });
};

export const getCategoriesVideos = async (
  _: Request,
  res: Response
): Promise<void> => {
  const categories = await getVideosCategoriesService();
  if (!categories || categories.length === 0) {
    throw HttpError(404, "No categories found");
  }
  res.json(categories);
};

export const getFiltersVideos = async (
  _: Request,
  res: Response
): Promise<void> => {
  const filters = await getVideosFiltersService();
  if (!filters || filters.length === 0) {
    throw HttpError(404, "No categories found");
  }
  res.json(filters);
};

export const getBookmarkedVideos = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.user;
  if (!user) {
    throw HttpError(401);
  }
  const { limit = "9", page = "1" } = req.query;
  const perPage = Math.max(1, Number(limit));
  const currentPage = Math.max(1, Number(page));
  const videoIds = user.bookmarkedVideos || [];
  if (videoIds.length === 0) {
    throw HttpError(404, "No videos found");
  }
  const { videos, total, cleanIds } = await getBookmarkedVideosService(
    videoIds,
    {
      limit: perPage,
      page: currentPage,
    }
  );
  if (cleanIds.length !== (user.bookmarkedVideos?.length || 0)) {
    await updateBookmarkedVideosService(cleanIds, user._id);
  }
  if (!videos || videos.length === 0) {
    throw HttpError(404, "No videos found");
  }
  res.json({
    videos: videos.map((v: IVideo) => ({
      ...v.toObject(),
      bookmarked: true,
      watched: {
        progress:
          user.watchedVideos?.find((w) => w.id.toString() === v._id.toString())
            ?.currentTime || 0,
      },
    })),
    total,
    page: currentPage,
    limit: perPage,
    hasMore: currentPage * perPage < videoIds.length,
  });
};

export const getWatchedVideos = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.user;
  if (!user) {
    throw HttpError(401);
  }
  const { limit = "9", page = "1" } = req.query;
  const perPage = Math.max(1, Number(limit));
  const currentPage = Math.max(1, Number(page));
  const videoIds = user.watchedVideos || [];
  if (videoIds.length === 0) {
    throw HttpError(404, "No videos found");
  }
  const { videos, total, cleanIds } = await getWatchedVideosService(videoIds, {
    limit: perPage,
    page: currentPage,
  });
  if (cleanIds.length !== (user.watchedVideos?.length || 0)) {
    await syncWatchedVideosService(cleanIds, user._id);
  }
  if (!videos || videos.length === 0) {
    throw HttpError(404, "No videos found");
  }
  res.json({
    videos: videos.map((v: IVideo) => {
      const progress = user.watchedVideos?.find(
        (w) => w.id.toString() === v._id.toString()
      );
      return {
        ...v.toObject(),
        watched: { progress: progress?.currentTime || 0 },
        bookmarked: user.bookmarkedVideos?.some(
          (b) => b.toString() === v._id.toString()
        ),
      };
    }),
    total,
    page: currentPage,
    limit: perPage,
    hasMore: currentPage * perPage < videoIds.length,
  });
};

export const getVideoDataFromVimeo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { vimeoId } = req.params;
  const data = await fetchVideoDataById(vimeoId);
  res.json(data);
};

export const addVideo = async (req: Request, res: Response): Promise<void> => {
  const response = await addVideoService(req.body);
  res.status(201).json(response);
};

export const updateVideo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const video = await updateVideoService(id, req.body);
  if (!video) {
    throw HttpError(404, "Video not found");
  }
  res.json(video);
};

export const deleteVideoById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const video = await deleteVideoByIdService(id);
  if (!video) {
    throw HttpError(404, "Video not found");
  }
  res.json({ message: "Video deleted" });
};

export const toggleBookmarkedVideo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id: videoId } = req.params;
  const userId = req.user?._id;

  const { action } = await toggleBookmarkedVideoService(userId, videoId);

  res.json({ message: `Video ${action} bookmark` });
};

export const updateWatchedVideo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id: videoId } = req.params;
  const userId = req.user?._id;
  const { currentTime } = req.body;

  if (typeof currentTime !== "number") {
    throw HttpError(400, "currentTime must be a number");
  }

  const updated = await updateWatchedVideosService(
    userId,
    videoId,
    currentTime
  );

  res.json({ message: "Progress updated", watched: updated });
};

export const toggleLikeVideo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id: videoId } = req.params;
  const userId = req.user?._id;

  const { action } = await toggleLikeVideoService(userId, videoId);

  res.json({ message: `Video ${action} like` });
};

export default {
  getVideos: ctrlWrapper(getVideos),
  getVideosCounts: ctrlWrapper(getVideosCounts),
  getVideoById: ctrlWrapper(getVideoById),
  getCategoriesVideos: ctrlWrapper(getCategoriesVideos),
  getFiltersVideos: ctrlWrapper(getFiltersVideos), //
  getBookmarkedVideos: ctrlWrapper(getBookmarkedVideos),
  toggleBookmarkedVideo: ctrlWrapper(toggleBookmarkedVideo),
  getWatchedVideos: ctrlWrapper(getWatchedVideos),
  updateWatchedVideo: ctrlWrapper(updateWatchedVideo),
  getVideoDataFromVimeo: ctrlWrapper(getVideoDataFromVimeo),
  addVideo: ctrlWrapper(addVideo),
  updateVideo: ctrlWrapper(updateVideo),
  deleteVideoById: ctrlWrapper(deleteVideoById),
  toggleLikeVideo: ctrlWrapper(toggleLikeVideo),
};
