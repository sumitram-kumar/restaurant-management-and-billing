import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { validate } from "../../middleware/validate";
import * as billsController from "./bills.controller";
import { createBillBodySchema } from "./bills.schemas";

export const billsRouter = Router();

billsRouter.post(
  "/",
  validate({ body: createBillBodySchema }),
  asyncHandler(billsController.createBill)
);
