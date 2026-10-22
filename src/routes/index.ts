import { Router } from "express";
import { solarRouter } from "./solarRouter";
import { statesRouter } from "./statesRouter";
import { sunDataRouter } from "./sunDataRouter";

const apiRouter = Router();

apiRouter.use("/states", statesRouter);
apiRouter.use("/solar", solarRouter);

// Temporary compatibility layer for the previous frontend.
apiRouter.use("/sundata", sunDataRouter);

export { apiRouter };
