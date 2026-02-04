import { Router } from "express";
import {
  getRecruiterProfileHandler,
  updateRecruiterProfileHandler,
} from "./recruiter-profile.controller.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { updateRecruiterProfileSchema } from "./recruiter-profile.schema.js";

const router = Router();

// get recruiter profile details
router.get("/:userId", getRecruiterProfileHandler);
// update recruiter profile
router.patch(
  "/:userId",
  validateRequest(updateRecruiterProfileSchema),
  updateRecruiterProfileHandler
);

export default router;
