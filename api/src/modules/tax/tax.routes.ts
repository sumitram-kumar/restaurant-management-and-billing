import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { validate } from "../../middleware/validate";
import * as taxController from "./tax.controller";
import { taxRateBodySchema } from "./tax.schemas";

export const taxRouter = Router();

taxRouter.get("/", asyncHandler(taxController.getCurrentTaxRate));

taxRouter.post(
  "/",
  validate({ body: taxRateBodySchema }),
  asyncHandler(taxController.createTaxRate)
);
