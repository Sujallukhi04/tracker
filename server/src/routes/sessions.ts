import { Router } from "express";
import {
  getAllSessions,
  getSessionById,
} from "../controllers/sessionController";
import { validate } from "../middleware/validate";
import { getSessionParamsSchema } from "../schemas/eventSchemas";

const router = Router();

router.get("/", getAllSessions);
router.get("/:sessionId", validate(getSessionParamsSchema), getSessionById);

export default router;

