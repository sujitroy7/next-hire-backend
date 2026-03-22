import { Router } from "express";
import {
  createRecruiterUserHandler,
  createUserHandler,
  getAllUsersHandler,
  getMyUserDetailsHandler,
  getRecruitersHandler,
  deleteRecruiterHandler,
} from "./user.controller.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { createUserSchema, createRecruiterUserSchema } from "./user.schema.js";
import { authenticate } from "../../middleware/authenticate.js";

const router = Router();

// get all avilable user on the DB
router.get("/", getAllUsersHandler);

// create candidate and organization user | setup the profile with default data
router.post("/register", validateRequest(createUserSchema), createUserHandler);

// create recruiter user | setup the profile with default data
router.post(
  "/register/recruiter",
  authenticate(["ORGANIZATION"]),
  validateRequest(createRecruiterUserSchema),
  createRecruiterUserHandler,
);

// get list of recruiters for the org
router.get("/recruiters", authenticate(["ORGANIZATION"]), getRecruitersHandler);

// hard delete recruiter profile and user
router.delete(
  "/recruiter/:recruiterId",
  authenticate(["ORGANIZATION"]),
  deleteRecruiterHandler,
);

// get current logged in user details
router.get(
  "/me",
  authenticate(["ORGANIZATION", "RECRUITER", "CANDIDATE"]),
  getMyUserDetailsHandler,
);

export default router;
