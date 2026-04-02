import { Router } from "express";
import multer from "multer";
import {
  createCandidateProfileHandler,
  getCandidateProfileHandler,
  updateCandidateProfileHandler,
  extractPdfDataHandler,
} from "./candidate-profile.controller.js";
import {
  createCandidateProfileSchema,
  updateCandidateProfileSchema,
} from "./candidate-profile.schema.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { authenticate } from "../../middleware/authenticate.js";

const router = Router();

router.post(
  "/",
  authenticate(["CANDIDATE"]),
  validateRequest(createCandidateProfileSchema),
  createCandidateProfileHandler,
);

router.get("/:userId", getCandidateProfileHandler);

router.patch(
  "/:userId",
  authenticate(["CANDIDATE"]),
  validateRequest(updateCandidateProfileSchema),
  updateCandidateProfileHandler,
);

// add a route for extracting pdf data using the microservice
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/extract-resume",
  authenticate(["CANDIDATE"]),
  upload.single("resume"),
  extractPdfDataHandler,
);

export default router;
