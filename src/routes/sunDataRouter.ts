import { Router } from "express";
import { GetSolarDataByStateController } from "../controllers/sundata/getSolarDataByStateController";
import { GetSolarDataOfAllStatesController } from "../controllers/sundata/getSolarDataOfAllStatesController";
import { GetSolarDataByCityController } from "../controllers/sundata/getSolarDataByCityController";

const router = Router();

router.get("/:state", GetSolarDataByStateController);
router.get("/:state/:city", GetSolarDataByCityController);
router.get("/", GetSolarDataOfAllStatesController);

export { router as sunDataRouter };
