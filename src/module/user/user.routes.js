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

// get all avilable user on the DB
router.get("/", getAllUsersHandler);

// create candidate and organization user | setup the profile with default data
router.post("/", validateRequest(createUserSchema), createUserHandler);

// create recruiter user | setup the profile with default data
router.post(
  "/recruiter",
  authenticate(["ORGANIZATION"]),
  validateRequest(createRecruiterUserSchema),
  createRecruiterUserHandler,
);

// get current logged in user details
router.get(
  "/me",
  authenticate(["ORGANIZATION", "RECRUITER", "CANDIDATE"]),
  getMyUserDetailsHandler,
);

export default router;
