import { Router } from "express";

import {
  isEmptyBody,
  isValidId,
  authenticateToken,
  authenticateAdmin,
  authenticateUser,
} from "../middlewares/index.js";
import { validateBody } from "../decorators/index.js";
import { shortsSchemas } from "../schemas/index.js";
import { shortController } from "../controllers/index.js";
const {
  getShortsList,
  getShortsCounts,
  getShortsById,
  createShorts,
  updateShorts,
  removeShorts,
  getTopTags,
  getBookmarkedShorts,
  toggleBookmarkedShort,
  getWatchedShorts,
  updateWatchedShort,
  toggleLikeShort,
} = shortController;

const { shortAddSchema, shortUpdateSchema } = shortsSchemas;

const shortsRouter = Router();

shortsRouter.use(authenticateToken);

shortsRouter.get("/", getShortsList); // GET /api/shorts
shortsRouter.get("/count", getShortsCounts);
shortsRouter.get("/tags/top", getTopTags); // GET /api/shorts/tags/top?limit=20

shortsRouter.get("/bookmarked", authenticateUser, getBookmarkedShorts);
shortsRouter.patch("/bookmarked/:id", authenticateUser, toggleBookmarkedShort);
shortsRouter.get("/watched", authenticateUser, getWatchedShorts);
shortsRouter.patch("/watched/:id", authenticateUser, updateWatchedShort);
shortsRouter.patch("/like/:id", isValidId, authenticateUser, toggleLikeShort);

shortsRouter.get("/:id", isValidId, getShortsById); // GET /api/shorts/:id

shortsRouter.use(authenticateAdmin);

shortsRouter.post("/", isEmptyBody, validateBody(shortAddSchema), createShorts); // POST /api/shorts

shortsRouter.patch(
  "/:id",
  isValidId,
  isEmptyBody,
  validateBody(shortUpdateSchema),
  updateShorts
); // PATCH /api/shorts/:id

shortsRouter.delete("/:id", removeShorts); // DELETE /api/shorts/:id

export default shortsRouter;
