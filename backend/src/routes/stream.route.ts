import { Router } from "express";

import { streamController } from "../controllers/index.js";

const { fetchStreamData, setStreamData } = streamController;

const streamRouter = Router();

streamRouter.get("/data", fetchStreamData);
streamRouter.post("/set", setStreamData);

export default streamRouter;
