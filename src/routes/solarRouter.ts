import { Router } from "express";
import { getSolarData } from "../controllers/sundataController";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/", asyncHandler(getSolarData));

export { router as solarRouter };
