import { Router } from "express";
import {
  createRecruiterUserHandler,
  createUserHandler,
  getAllUsersHandler,
} from "./user.controller.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { createUserSchema, createRecruiterUserSchema } from "./user.schema.js";

const router = Router();

router.get("/", getAllUsersHandler);
router.post("/", validateRequest(createUserSchema), createUserHandler);
router.post(
  "/recruiter",
  validateRequest(createRecruiterUserSchema),
  createRecruiterUserHandler
);

// todo: update user password API
// router.post('/password', validateRequest(updateUserPasswordSchema), updateUserPasswordHandler)

export default router;
