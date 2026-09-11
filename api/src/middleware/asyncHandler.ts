import { NextFunction, Request, Response } from "express";

type AsyncRouteHandler = (
  req: Request<any, any, any, any>,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const asyncHandler =
  (handler: AsyncRouteHandler) =>
  (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, next).catch(next);
  };
