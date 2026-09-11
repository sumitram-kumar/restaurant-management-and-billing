import { NextFunction, Request, RequestHandler, Response } from "express";

// Express's own RequestHandler generics (Params/ResBody/ReqBody/ReqQuery) don't
// compose well across a chain of differently-typed middleware, so handlers here
// use Express's plain defaults and read/cast the already-validated req.body,
// req.params, req.query locally instead of threading generics through Router.
export const asyncHandler =
  (
    handler: (req: Request, res: Response, next: NextFunction) => Promise<void>
  ): RequestHandler =>
  (req, res, next) => {
    handler(req, res, next).catch(next);
  };
