import { httpClient } from "./httpClient";
import { MenuItem, MenuItemInput } from "../types";

export const getMenu = () => httpClient.get<MenuItem[]>("/menu").then((res) => res.data);

export const getMenuItem = (id: number) =>
  httpClient.get<MenuItem>(`/menu/${id}`).then((res) => res.data);

export const createMenuItem = (data: MenuItemInput) =>
  httpClient.post<MenuItem>("/menu", data).then((res) => res.data);

export const updateMenuItem = (id: number, data: MenuItemInput) =>
  httpClient.put<MenuItem>(`/menu/${id}`, data).then((res) => res.data);

export const deleteMenuItem = (id: number) => httpClient.delete(`/menu/${id}`);
