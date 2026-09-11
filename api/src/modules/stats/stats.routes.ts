import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import * as statsController from "./stats.controller";

export const statsRouter = Router();

statsRouter.get("/", asyncHandler(statsController.getStats));
