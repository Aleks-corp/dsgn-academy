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
  getBookmarkedVideos,
  toggleBookmarkedVideo,
  getWatchedVideos,
  updateWatchedVideo,
  toggleLikeVideo,
  getVideoDataFromVimeo,
  addVideo,
  deleteVideoById,
  updateVideo,
} = videoController;

const videosRouter = Router();

const { videoAddSchema, videoUpdateSchema } = videosSchemas;

videosRouter.get("/", authenticateToken, getVideos);
videosRouter.get("/categories", authenticateToken, getCategoriesVideos);
videosRouter.get("/counts/category", authenticateToken, getVideosCounts);
videosRouter.get(
  "/counts/category/:category",
  authenticateToken,
  getVideosCounts
);

videosRouter.get("/bookmarked", authenticateUser, getBookmarkedVideos);
videosRouter.patch("/bookmarked/:id", authenticateUser, toggleBookmarkedVideo);
videosRouter.get("/watched", authenticateUser, getWatchedVideos);
videosRouter.patch(
  "/watched/:id",
  isValidId,
  authenticateUser,
  updateWatchedVideo
);
videosRouter.patch("/like/:id", isValidId, authenticateUser, toggleLikeVideo);

videosRouter.get("/:id", authenticateToken, isValidId, getVideoById);

videosRouter.use(authenticateAdmin);

videosRouter.get("/data/vimeo/:vimeoId", getVideoDataFromVimeo);

videosRouter.post(
  "/",

  isEmptyBody,
  validateBody(videoAddSchema),
  addVideo
);

videosRouter.patch(
  "/:id",
  isValidId,
  isEmptyBody,
  validateBody(videoUpdateSchema),

  updateVideo
);

videosRouter.delete("/:id", isValidId, deleteVideoById);

export default videosRouter;
