import { Router } from "express";

import {
  isEmptyBody,
  isValidId,
  authenticateToken,
  authenticateAdmin,
  authenticateUser,
} from "../middlewares/index.js";
import { validateBody } from "../decorators/index.js";
import { videosSchemas } from "../schemas/index.js";
import { videoController } from "../controllers/index.js";
const {
  getVideos,
  getVideoById,
  getCategoriesVideos,
  getVideosCounts,
  getFavoriteVideos,
  getWatchedVideos,
  getVideoDataFromVimeo,
  addVideo,
  deleteVideoById,
  updateVideo,
  toggleFavoriteVideo,
} = videoController;

const videosRouter = Router();

const { videoAddSchema, videoUpdateSchema } = videosSchemas;

videosRouter.use(authenticateToken);

videosRouter.get("/", getVideos);

videosRouter.get("/categories", getCategoriesVideos);

videosRouter.get("/counts", getVideosCounts);

videosRouter.get("/favorites", authenticateUser, getFavoriteVideos);

videosRouter.get("/watched", authenticateUser, getWatchedVideos);

videosRouter.get(
  "/data/vimeo/:vimeoId",
  authenticateAdmin,
  getVideoDataFromVimeo
);

videosRouter.get("/:id", isValidId, getVideoById);

videosRouter.post(
  "/",
  authenticateAdmin,
  isEmptyBody,
  validateBody(videoAddSchema),
  addVideo
);

videosRouter.patch(
  "/:id",
  isValidId,
  isEmptyBody,
  validateBody(videoUpdateSchema),
  authenticateUser,
  updateVideo
);

videosRouter.patch(
  "/:id/favorite",
  isValidId,
  authenticateUser,
  toggleFavoriteVideo
);

videosRouter.delete("/:id", isValidId, authenticateUser, deleteVideoById);

export default videosRouter;
