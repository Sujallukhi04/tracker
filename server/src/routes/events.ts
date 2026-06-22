import { Router } from "express";
import { createEvent } from "../controllers/eventController";
import { validate } from "../middleware/validate";
import { createEventSchema } from "../schemas/eventSchemas";

const router = Router();

router.post("/", validate(createEventSchema), createEvent);

export default router;

