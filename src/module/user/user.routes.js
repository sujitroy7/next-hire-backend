import { Router } from "express";
import {
  createRecruiterUserHandler,
  createUserHandler,
  getAllUsersHandler,
  getMyUserDetailsHandler,
} from "./user.controller.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { createUserSchema, createRecruiterUserSchema } from "./user.schema.js";
import { authenticate } from "../../middleware/authenticate.js";

const router = Router();

router.get("/", getAllUsersHandler);
router.post("/", validateRequest(createUserSchema), createUserHandler);
router.post(
  "/recruiter",
  authenticate(["ORGANIZATION"]),
  validateRequest(createRecruiterUserSchema),
  createRecruiterUserHandler,
);
router.get(
  "/me",
  authenticate(["ORGANIZATION", "RECRUITER", "CANDIDATE"]),
  getMyUserDetailsHandler,
);

// todo: update user password API
// router.post('/password', validateRequest(updateUserPasswordSchema), updateUserPasswordHandler)

export default router;
