import { Router } from "express";
import { isEmptyBody, isValidId } from "../middlewares/index.js";
import { validateBody } from "../decorators/index.js";
import { coursesSchemas } from "../schemas/index.js";
import { courseController } from "../controllers/index.js";
const {
  getCourses,
  getCourseById,
  addCourse,
  deleteCourseById,
  // updateStatusPost,
  updateCourse,
} = courseController;

const { courseAddSchema, courseUpdateSchema } = coursesSchemas;

const coursesRouter = Router();

coursesRouter.get("/", getCourses);

coursesRouter.get("/:id", isValidId, getCourseById);

coursesRouter.post("/", isEmptyBody, validateBody(courseAddSchema), addCourse);

coursesRouter.patch(
  "/:id",
  isValidId,
  isEmptyBody,
  validateBody(courseUpdateSchema),
  updateCourse
);

coursesRouter.delete("/:id", isValidId, deleteCourseById);

export default coursesRouter;
