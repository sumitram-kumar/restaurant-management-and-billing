import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { validate } from "../../middleware/validate";
import * as menuController from "./menu.controller";
import { menuItemBodySchema, menuItemParamsSchema } from "./menu.schemas";

export const menuRouter = Router();

menuRouter.get("/", asyncHandler(menuController.listMenuItems));

menuRouter.get(
  "/:id",
  validate({ params: menuItemParamsSchema }),
  asyncHandler(menuController.getMenuItem)
);

menuRouter.post(
  "/",
  validate({ body: menuItemBodySchema }),
  asyncHandler(menuController.createMenuItem)
);

menuRouter.put(
  "/:id",
  validate({ params: menuItemParamsSchema, body: menuItemBodySchema }),
  asyncHandler(menuController.updateMenuItem)
);

menuRouter.delete(
  "/:id",
  validate({ params: menuItemParamsSchema }),
  asyncHandler(menuController.deleteMenuItem)
);
