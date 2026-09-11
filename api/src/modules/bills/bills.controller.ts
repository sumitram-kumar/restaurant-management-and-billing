import { Request, Response } from "express";
import { z } from "zod";
import * as billsService from "./bills.service";
import { createBillBodySchema } from "./bills.schemas";

type CreateBillBody = z.infer<typeof createBillBodySchema>;

export const createBill = async (
  req: Request<unknown, unknown, CreateBillBody>,
  res: Response
) => {
  const bill = await billsService.createBill({
    ...req.body,
    createdBySub: req.auth?.payload.sub,
  });
  res.status(201).json(bill);
};
