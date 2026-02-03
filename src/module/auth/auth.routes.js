import { Router } from "express";
import {
  loginHandler,
  logoutHandler,
  refreshHandler,
} from "./auth.controller.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { loginSchema } from "./auth.schema.js";

const router = Router();

router.post("/login", validateRequest(loginSchema), loginHandler);
router.post("/refresh", refreshHandler);
router.post("/logout", logoutHandler);

export default router;
