import { Router } from "express";
import * as controller from "./settings.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", controller.get);
router.post("/", controller.create);

export default router;
