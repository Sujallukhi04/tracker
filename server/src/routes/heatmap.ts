import { Router } from "express";
import { getHeatmapData, getTrackedUrls } from "../controllers/heatmapController";
import { validate } from "../middleware/validate";
import { getHeatmapSchema } from "../schemas/eventSchemas";

const router = Router();

router.get("/", validate(getHeatmapSchema), getHeatmapData);
router.get("/urls", getTrackedUrls);

export default router;

