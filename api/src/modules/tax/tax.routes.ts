import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import * as taxController from "./tax.controller";

export const taxRouter = Router();

taxRouter.get("/", asyncHandler(taxController.getCurrentTaxRate));
taxRouter.post("/", asyncHandler(taxController.createTaxRate));
