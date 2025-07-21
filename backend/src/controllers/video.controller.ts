import type { Request, Response } from "express";
import { videoServices } from "../services/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import { HttpError } from "../utils/index.js";
const {
  getVideosService,
  getVideoByIdService,
  addVideoService,
  updateVideoService,
  deleteVideoByIdService,
  toggleFavoriteVideoService,
} = videoServices;

/**
 * GET /video
 * Query: ?q=searchText&category=Figma&limit=12&page=1
 */
export const getVideos = async (req: Request, res: Response): Promise<void> => {
  const { q, category, limit = 3, page = 1 } = req.query;

  const filter: Record<string, unknown> = {};
  if (typeof category === "string" && category.trim() !== "") {
    filter.category = category.trim();
  }
  if (typeof q === "string" && q.trim() !== "") {
    const regex = new RegExp(q.trim(), "i");
    filter.title = regex;
  }

  const perPage = Math.max(1, Number(limit));
  const currentPage = Math.max(1, Number(page));

  const { videos, total } = await getVideosService(filter, {
    limit: perPage,
    page: currentPage,
  });

  res.json({
    data: videos,
    total,
    page: currentPage,
    limit: perPage,
    hasMore: (currentPage - 1) * perPage + videos.length < total,
  });
};

export const getVideoById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const video = await getVideoByIdService(id);
  if (!video) {
    res.status(404).json({ error: "Video not found" });
    return;
  }
  res.json(video);
};

export const addVideo = async (req: Request, res: Response): Promise<void> => {
  const video = await addVideoService(req.body);
  res.status(201).json(video);
};

export const updateVideo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const video = await updateVideoService(id, req.body);
  if (!video) {
    res.status(404).json({ error: "Video not found" });
    return;
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
    res.status(404).json({ error: "Video not found" });
    return;
  }
  res.json({ message: "Video deleted" });
};

export const toggleFavoriteVideo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id: videoId } = req.params;
  const { _id: userId } = req.user;
  if (!userId) {
    throw HttpError(404, "User not found");
  }

  const { action } = await toggleFavoriteVideoService(userId, videoId);

  res.json({ message: `Video ${action} favorites` });
};

export default {
  getVideos: ctrlWrapper(getVideos),
  getVideoById: ctrlWrapper(getVideoById),
  addVideo: ctrlWrapper(addVideo),
  updateVideo: ctrlWrapper(updateVideo),
  deleteVideoById: ctrlWrapper(deleteVideoById),
  toggleFavoriteVideo: ctrlWrapper(toggleFavoriteVideo),
};
