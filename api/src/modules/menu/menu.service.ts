import { prisma } from "../../lib/prisma";

export interface MenuItemInput {
  name: string;
  category: string;
  halfPrice: number;
  fullPrice: number;
}

export const listMenuItems = () =>
  prisma.menuItem.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

export const getMenuItemById = (id: number) =>
  prisma.menuItem.findUniqueOrThrow({ where: { id } });

export const createMenuItem = (data: MenuItemInput) => prisma.menuItem.create({ data });

export const updateMenuItem = (id: number, data: MenuItemInput) =>
  prisma.menuItem.update({ where: { id }, data });

export const softDeleteMenuItem = (id: number) =>
  prisma.menuItem.update({ where: { id }, data: { isActive: false } });
