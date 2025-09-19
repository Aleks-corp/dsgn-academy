import type { Request, Response } from "express";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import { shortService } from "../services/index.js";
import { HttpError } from "../utils/index.js";

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

const sequence = async (req: Request, res: Response): Promise<void> => {
  const { limit, cursor, tags, tagsMode } = req.query;

  const filtersQuery: Record<string, unknown> = {};
  if (typeof tags === "string" && tags.trim() !== "")
    filtersQuery.tags = tags.trim();
  if (typeof cursor === "string" && cursor.trim() !== "")
    filtersQuery.cursor = cursor.trim();
  if (
    typeof tagsMode === "string" &&
    (tagsMode === "any" || tagsMode === "all")
  ) {
    filtersQuery.tagsMode = tagsMode;
  }
  if (
    typeof limit === "string" &&
    limit.trim() !== "" &&
    Number.isFinite(Number(limit))
  ) {
    filtersQuery.limit = Number(limit);
  }
  const data = await shortService.getSequence(filtersQuery);
  res.json(data);
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

const getShortsAround = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const before = Math.max(0, Number(req.query.before) || 3);
  const after = Math.max(0, Number(req.query.after) || 3);

  const data = await shortService.shortsAroundService({ id, before, after });
  res.json(data); // { center, before, after, prevCursor?, nextCursor? }
};

const getShortsPage = async (req: Request, res: Response): Promise<void> => {
  const cursor = String(req.query.cursor || "");
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));

  const data = await shortService.shortsPageService({ cursor, limit });
  res.json(data); // { items, nextCursor? }
};

export default {
  getShortsList: ctrlWrapper(getShortsList),
  sequence: ctrlWrapper(sequence),
  getShortsCounts: ctrlWrapper(getShortsCounts),
  getShortsById: ctrlWrapper(getShortsById),
  createShorts: ctrlWrapper(createShorts),
  updateShorts: ctrlWrapper(updateShorts),
  removeShorts: ctrlWrapper(removeShorts),
  getTopTags: ctrlWrapper(getTopTags),
  getShortsAround: ctrlWrapper(getShortsAround),
  getShortsPage: ctrlWrapper(getShortsPage),
};
