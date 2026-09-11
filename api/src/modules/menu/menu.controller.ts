import { Request, Response } from "express";
import * as menuService from "./menu.service";

const toMenuItemInput = (body: Request["body"]) => ({
  name: String(body.name),
  category: String(body.category),
  halfPrice: Number(body.halfPrice),
  fullPrice: Number(body.fullPrice),
});

export const listMenuItems = async (_req: Request, res: Response) => {
  const items = await menuService.listMenuItems();
  res.json(items);
};

export const getMenuItem = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const item = await menuService.getMenuItemById(Number(req.params.id));
  res.json(item);
};

export const createMenuItem = async (req: Request, res: Response) => {
  const item = await menuService.createMenuItem(toMenuItemInput(req.body));
  res.status(201).json(item);
};

export const updateMenuItem = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const item = await menuService.updateMenuItem(
    Number(req.params.id),
    toMenuItemInput(req.body)
  );
  res.json(item);
};

export const deleteMenuItem = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  await menuService.softDeleteMenuItem(Number(req.params.id));
  res.status(204).send();
};
