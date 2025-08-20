import { Router } from "express";
import {
  isEmptyBody,
  isValidId,
  authenticateToken,
  authenticateAdmin,
} from "../middlewares/index.js";
import { validateBody } from "../decorators/index.js";
import { coursesSchemas } from "../schemas/index.js";
import { courseController } from "../controllers/index.js";
const {
  getCourses,
  getCoursesCounts,
  getCourseById,
  addCourse,
  updateCourse,
  deleteCourseById,
  toggleFavoriteCourse,
} = courseController;

const { courseAddSchema, courseUpdateSchema } = coursesSchemas;

const coursesRouter = Router();

coursesRouter.use(authenticateToken);

coursesRouter.get("/", getCourses);

coursesRouter.get("/counts", getCoursesCounts);

coursesRouter.get("/:id", isValidId, getCourseById);

coursesRouter.post(
  "/",
  authenticateAdmin,
  isEmptyBody,
  validateBody(courseAddSchema),
  addCourse
);

coursesRouter.patch(
  "/:id",
  isValidId,
  isEmptyBody,
  validateBody(courseUpdateSchema),
  updateCourse
);

coursesRouter.patch(
  "/:id/favorite",

  isValidId,
  toggleFavoriteCourse
);

coursesRouter.delete("/:id", isValidId, deleteCourseById);

export default coursesRouter;
