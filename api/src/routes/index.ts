import { Router } from "express";
import { menuRouter } from "../modules/menu/menu.routes";
import { taxRouter } from "../modules/tax/tax.routes";
import { billsRouter } from "../modules/bills/bills.routes";
import { statsRouter } from "../modules/stats/stats.routes";

export const apiRouter = Router();

apiRouter.use("/menu", menuRouter);
apiRouter.use("/tax", taxRouter);
apiRouter.use("/bills", billsRouter);
apiRouter.use("/stats", statsRouter);
