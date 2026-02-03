import { Router } from "express";
import {
  createCandidateProfileHandler,
  getCandidateProfileHandler,
  updateCandidateProfileHandler,
} from "./candidate-profile.controller.js";
import {
  createCandidateProfileSchema,
  updateCandidateProfileSchema,
} from "./candidate-profile.schema.js";
import { validateRequest } from "../../middleware/validateRequest.js";

const router = Router();

router.post(
  "/",
  validateRequest(createCandidateProfileSchema),
  createCandidateProfileHandler
);

router.get("/:userId", getCandidateProfileHandler);

router.patch(
  "/:userId",
  validateRequest(updateCandidateProfileSchema),
  updateCandidateProfileHandler
);

export default router;
