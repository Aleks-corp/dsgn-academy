import type { Request, Response } from "express";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import { shortService } from "../services/index.js";
import { HttpError } from "../utils/index.js";

const getShortsList = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { limit, cursor, tags, tagsMode } = req.query;
  const filtersQuery: Record<string, unknown> = {};

  if (typeof tags === "string" && tags.trim() !== "") {
    filtersQuery.tags = tags.trim(); // CSV або один тег — сервіс розбере
  }
  if (typeof cursor === "string" && cursor.trim() !== "") {
    filtersQuery.cursor = cursor.trim();
  }
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

export default {
  getShortsList: ctrlWrapper(getShortsList),
  sequence: ctrlWrapper(sequence),
  getShortsCounts: ctrlWrapper(getShortsCounts),
  getShortsById: ctrlWrapper(getShortsById),
  createShorts: ctrlWrapper(createShorts),
  updateShorts: ctrlWrapper(updateShorts),
  removeShorts: ctrlWrapper(removeShorts),
  getTopTags: ctrlWrapper(getTopTags),
};
