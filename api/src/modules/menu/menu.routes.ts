import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import * as menuController from "./menu.controller";

export const menuRouter = Router();

menuRouter.get("/", asyncHandler(menuController.listMenuItems));
menuRouter.get("/:id", asyncHandler(menuController.getMenuItem));
menuRouter.post("/", asyncHandler(menuController.createMenuItem));
menuRouter.put("/:id", asyncHandler(menuController.updateMenuItem));
menuRouter.delete("/:id", asyncHandler(menuController.deleteMenuItem));
