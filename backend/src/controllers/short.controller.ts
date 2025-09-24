import type { Request, Response } from "express";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import { shortService } from "../services/index.js";
import { HttpError } from "../utils/index.js";
import {
  toggleBookmarkedShortService,
  updateBookmarkedShortsService,
  updateWatchedShortsService,
  syncWatchedShortsService,
} from "../services/user.service.js";
import type { IShort } from "../types/short.type.js";

const getShortsList = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { limit, page, tags, tagsMode } = req.query;
  const filtersQuery: Record<string, unknown> = {};

  if (typeof tags === "string" && tags.trim() !== "") {
    filtersQuery.tags = tags.trim(); // CSV або один тег — сервіс розбере
  }
  if (
    typeof tagsMode === "string" &&
    (tagsMode === "any" || tagsMode === "all")
  ) {
    filtersQuery.tagsMode = tagsMode;
  }
  if (typeof page === "string" && page.trim() !== "") {
    const parsed = parseInt(page, 10);
    if (!isNaN(parsed) && parsed > 0) {
      filtersQuery.page = parsed;
    }
  }
  if (typeof limit === "string" && limit.trim() !== "") {
    const parsed = parseInt(limit, 10);
    if (!isNaN(parsed) && parsed > 0) {
      filtersQuery.limit = parsed;
    }
  }
  const data = await shortService.listShorts(filtersQuery);
  return res.json(data);
};

export const getShortsCounts = async (
  req: Request,
  res: Response
): Promise<void> => {
  const totalShorts = await shortService.getShortsTotalService();

  res.json({
    totalShorts,
  });
};

const getShortsById = async (req: Request, res: Response): Promise<void> => {
  const doc = await shortService.getShortById(req.params.id);
  if (!doc) throw HttpError(404, "NotFound");
  res.json(doc);
};

const createShorts = async (req: Request, res: Response): Promise<void> => {
  const doc = await shortService.createShort(req.body);
  res.status(201).json(doc);
};

const updateShorts = async (req: Request, res: Response): Promise<void> => {
  const doc = await shortService.updateShort(req.params.id, req.body);
  if (!doc) throw HttpError(404, "NotFound");
  res.json(doc);
};

const removeShorts = async (req: Request, res: Response): Promise<void> => {
  await shortService.deleteShort(req.params.id);
  res.status(204).json(req.params.id);
};

const getTopTags = async (
  req: Request<unknown, unknown, unknown, { limit?: string }>,
  res: Response
): Promise<void> => {
  const limit = Number(req.query.limit ?? 20);
  const data = await shortService.topTags(limit);
  res.json({ tags: data });
};

const getBookmarkedShorts = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.user;
  if (!user) throw HttpError(401);

  const { limit = "9", page = "1" } = req.query;
  const perPage = Math.max(1, Number(limit));
  const currentPage = Math.max(1, Number(page));
  const shortIds = user.bookmarkedShorts || [];
  if (shortIds.length === 0) throw HttpError(404, "No shorts found");

  const { shorts, total, cleanIds } =
    await shortService.getBookmarkedShortsService(shortIds, {
      limit: perPage,
      page: currentPage,
    });

  if (cleanIds.length !== (user.bookmarkedShorts?.length || 0)) {
    await updateBookmarkedShortsService(cleanIds, user._id);
  }

  res.json({
    shorts: shorts.map((s: IShort) => ({
      ...s.toObject(),
      bookmarked: true,
      watched: {
        progress:
          user.watchedShorts?.find((w) => w.id.toString() === s._id.toString())
            ?.currentTime || 0,
      },
    })),
    total,
    page: currentPage,
    limit: perPage,
    hasMore: currentPage * perPage < shortIds.length,
  });
};

const toggleBookmarkedShort = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id: shortId } = req.params;
  const userId = req.user?._id;
  if (!userId) throw HttpError(401);

  const { action } = await toggleBookmarkedShortService(userId, shortId);

  res.json({ message: `Short ${action} bookmark` });
};

const getWatchedShorts = async (req: Request, res: Response): Promise<void> => {
  const user = req.user;
  if (!user) throw HttpError(401);

  const { limit = "9", page = "1" } = req.query;
  const perPage = Math.max(1, Number(limit));
  const currentPage = Math.max(1, Number(page));
  const shortIds = user.watchedShorts || [];
  if (shortIds.length === 0) throw HttpError(404, "No shorts found");

  const { shorts, total, cleanIds } =
    await shortService.getWatchedShortsService(shortIds, {
      limit: perPage,
      page: currentPage,
    });

  if (cleanIds.length !== (user.watchedShorts?.length || 0)) {
    await syncWatchedShortsService(cleanIds, user._id);
  }

  res.json({
    shorts: shorts.map((s: IShort) => {
      const progress = user.watchedShorts?.find(
        (w) => w.id.toString() === s._id.toString()
      );
      return {
        ...s.toObject(),
        watched: { progress: progress?.currentTime || 0 },
        bookmarked: user.bookmarkedShorts?.some(
          (b) => b.toString() === s._id.toString()
        ),
      };
    }),
    total,
    page: currentPage,
    limit: perPage,
    hasMore: currentPage * perPage < shortIds.length,
  });
};

const updateWatchedShort = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id: shortId } = req.params;
  const userId = req.user?._id;
  const { currentTime } = req.body;

  if (!userId) throw HttpError(401);
  if (typeof currentTime !== "number") {
    throw HttpError(400, "currentTime must be a number");
  }

  const updated = await updateWatchedShortsService(
    userId,
    shortId,
    currentTime
  );

  res.json({ message: "Progress updated", watched: updated });
};

const toggleLikeShort = async (req: Request, res: Response): Promise<void> => {
  const { id: shortId } = req.params;
  const userId = req.user?._id;
  if (!userId) throw HttpError(401);

  const { action } = await shortService.toggleLikeShortService(userId, shortId);

  res.json({ message: `Short ${action} like` });
};

export default {
  getShortsList: ctrlWrapper(getShortsList),
  getShortsCounts: ctrlWrapper(getShortsCounts),
  getShortsById: ctrlWrapper(getShortsById),
  createShorts: ctrlWrapper(createShorts),
  updateShorts: ctrlWrapper(updateShorts),
  removeShorts: ctrlWrapper(removeShorts),
  getTopTags: ctrlWrapper(getTopTags),
  getBookmarkedShorts: ctrlWrapper(getBookmarkedShorts),
  toggleBookmarkedShort: ctrlWrapper(toggleBookmarkedShort),
  getWatchedShorts: ctrlWrapper(getWatchedShorts),
  updateWatchedShort: ctrlWrapper(updateWatchedShort),
  toggleLikeShort: ctrlWrapper(toggleLikeShort),
};
