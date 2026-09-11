import { Request, Response } from "express";
import * as menuService from "./menu.service";
import { MenuItemInput } from "./menu.service";

export const listMenuItems = async (_req: Request, res: Response) => {
  const items = await menuService.listMenuItems();
  res.json(items);
};

export const getMenuItem = async (
  req: Request<{ id: number }>,
  res: Response
) => {
  const item = await menuService.getMenuItemById(req.params.id);
  res.json(item);
};

export const createMenuItem = async (
  req: Request<unknown, unknown, MenuItemInput>,
  res: Response
) => {
  const item = await menuService.createMenuItem(req.body);
  res.status(201).json(item);
};

export const updateMenuItem = async (
  req: Request<{ id: number }, unknown, MenuItemInput>,
  res: Response
) => {
  const item = await menuService.updateMenuItem(req.params.id, req.body);
  res.json(item);
};

export const deleteMenuItem = async (
  req: Request<{ id: number }>,
  res: Response
) => {
  await menuService.softDeleteMenuItem(req.params.id);
  res.status(204).send();
};
