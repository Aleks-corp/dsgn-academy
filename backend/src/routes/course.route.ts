import { Router } from "express";
import {
  isEmptyBody,
  isValidId,
  authenticateToken,
  authenticateAdmin,
  authenticateUser,
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
  getBookmarkedCourses,
  toggleBookmarkCourse,
  getWatchedCourses,
  updateWatchedCourse,
  toggleLikeCourse,
} = courseController;

const { courseAddSchema, courseUpdateSchema } = coursesSchemas;

const coursesRouter = Router();

coursesRouter.get("/", authenticateToken, getCourses);
coursesRouter.get("/counts", authenticateToken, getCoursesCounts);

coursesRouter.get("/bookmarked", authenticateUser, getBookmarkedCourses);
coursesRouter.patch("/bookmarked/:id", authenticateUser, toggleBookmarkCourse);
coursesRouter.get("/watched", authenticateUser, getWatchedCourses);
coursesRouter.patch("/watched/:id", authenticateUser, updateWatchedCourse);
coursesRouter.patch("/like/:id", isValidId, authenticateUser, toggleLikeCourse);

coursesRouter.get("/:id", authenticateToken, isValidId, getCourseById);

coursesRouter.use(authenticateAdmin);

coursesRouter.post(
  "/",

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

coursesRouter.delete("/:id", isValidId, deleteCourseById);

export default coursesRouter;
