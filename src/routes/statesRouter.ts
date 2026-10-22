import { Router } from "express";
import { getCities, getStates } from "../controllers/sundataController";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/", asyncHandler(getStates));
router.get("/:state/cities", asyncHandler(getCities));

export { router as statesRouter };
