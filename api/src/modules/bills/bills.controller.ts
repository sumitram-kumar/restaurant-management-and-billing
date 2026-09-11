import { Request, Response } from "express";
import * as billsService from "./bills.service";

export const createBill = async (req: Request, res: Response) => {
  const { paymentMode, discountPercent, lines } = req.body;
  const bill = await billsService.createBill({
    paymentMode,
    discountPercent: Number(discountPercent),
    lines,
  });
  res.status(201).json(bill);
};
