import { Router } from "express";
import {
  getLegacyAll,
  getLegacyByCity,
  getLegacyByState
} from "../controllers/sundataController";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/", asyncHandler(getLegacyAll));
router.get("/:state", asyncHandler(getLegacyByState));
router.get("/:state/:city", asyncHandler(getLegacyByCity));

export { router as sunDataRouter };
