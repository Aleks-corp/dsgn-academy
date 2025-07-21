import { Router } from "express";

import {
  isEmptyBody,
  isValidId,
  authenticateToken,
} from "../middlewares/index.js";
import { validateBody } from "../decorators/index.js";
import { videosSchemas } from "../schemas/index.js";
import { videoController } from "../controllers/index.js";
const {
  getVideos,
  getVideoById,
  addVideo,
  deleteVideoById,
  updateVideo,
  toggleFavoriteVideo,
} = videoController;

const videosRouter = Router();

const { videoAddSchema, videoUpdateSchema } = videosSchemas;

videosRouter.use(authenticateToken);

videosRouter.get("/", getVideos);

videosRouter.get("/:id", isValidId, getVideoById);

videosRouter.post("/", isEmptyBody, validateBody(videoAddSchema), addVideo);

videosRouter.patch(
  "/:id",
  isValidId,
  isEmptyBody,
  validateBody(videoUpdateSchema),
  updateVideo
);

videosRouter.patch(
  "/:id/favorite",

  isValidId,
  toggleFavoriteVideo
);

videosRouter.delete("/:id", isValidId, deleteVideoById);

export default videosRouter;
