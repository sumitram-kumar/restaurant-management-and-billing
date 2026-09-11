import { Request, Response } from "express";
import * as menuService from "./menu.service";
import { MenuItemInput } from "./menu.service";

export const listMenuItems = async (_req: Request, res: Response) => {
  const items = await menuService.listMenuItems();
  res.json(items);
};

export const getMenuItem = async (req: Request, res: Response) => {
  const item = await menuService.getMenuItemById(Number(req.params.id));
  res.json(item);
};

export const createMenuItem = async (req: Request, res: Response) => {
  const item = await menuService.createMenuItem(req.body as MenuItemInput);
  res.status(201).json(item);
};

export const updateMenuItem = async (req: Request, res: Response) => {
  const item = await menuService.updateMenuItem(
    Number(req.params.id),
    req.body as MenuItemInput
  );
  res.json(item);
};

export const deleteMenuItem = async (req: Request, res: Response) => {
  await menuService.softDeleteMenuItem(Number(req.params.id));
  res.status(204).send();
};
