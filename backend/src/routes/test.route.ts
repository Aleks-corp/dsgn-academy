import { Router } from "express";

import { testController } from "../controllers/index.js";

const { isAlpha, isTester } = testController;

const testRouter = Router();

testRouter.get("/", isAlpha);

testRouter.get("/login", isTester);

export default testRouter;
