import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { validate } from "../../middleware/validate";
import * as statsController from "./stats.controller";
import { statsQuerySchema } from "./stats.schemas";

export const statsRouter = Router();

statsRouter.get(
  "/",
  validate({ query: statsQuerySchema }),
  asyncHandler(statsController.getStats)
);
