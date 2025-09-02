import { Router } from "express";

import {
  isEmptyBody,
  isValidId,
  authenticateToken,
  authenticateAdmin,
  //   authenticateUser,
} from "../middlewares/index.js";
import { validateBody } from "../decorators/index.js";
import { shortsSchemas } from "../schemas/index.js";
import { shortController } from "../controllers/index.js";
const {
  getShortsList,
  getShortsCounts,
  sequence,
  getShortsById,
  createShorts,
  updateShorts,
  removeShorts,
  getTopTags,
} = shortController;

const { shortAddSchema, shortUpdateSchema } = shortsSchemas;

const shortsRouter = Router();

shortsRouter.use(authenticateToken);

shortsRouter.get("/", getShortsList); // GET /api/shorts
shortsRouter.get("/count", getShortsCounts);
shortsRouter.get("/sequence", sequence); // GET /api/shorts/sequence
shortsRouter.get("/tags/top", getTopTags); // GET /api/shorts/tags/top?limit=20
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
