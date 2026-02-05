import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest.js";
import { authenticate } from "../../middleware/authenticate.js";
import {
  createJobApplicationSchema,
  getCandidateApplicationsSchema,
  getJobApplicationsSchema,
  updateJobApplicationStatusSchema,
} from "./job-application.schema.js";
import {
  applyForJobHandler,
  getCandidateApplicationsHandler,
  getJobApplicationsByJobHandler,
  updateJobApplicationStatusHandler,
} from "./job-application.controller.js";

const router = Router();

// candidate apply for a job
router.post(
  "/",
  authenticate(["CANDIDATE"]),
  validateRequest(createJobApplicationSchema),
  applyForJobHandler
);

// candidate get their job applications
router.get(
  "/candidate",
  authenticate(["CANDIDATE"]),
  validateRequest(getCandidateApplicationsSchema),
  getCandidateApplicationsHandler
);

// recruiter get applications for a job
router.get(
  "/job/:jobId",
  authenticate(["RECRUITER"]),
  validateRequest(getJobApplicationsSchema),
  getJobApplicationsByJobHandler
);

// recruiter update application status
router.patch(
  "/:applicationId/status",
  authenticate(["RECRUITER"]),
  validateRequest(updateJobApplicationStatusSchema),
  updateJobApplicationStatusHandler
);

export default router;
