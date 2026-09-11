import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import * as billsController from "./bills.controller";

export const billsRouter = Router();

billsRouter.post("/", asyncHandler(billsController.createBill));
