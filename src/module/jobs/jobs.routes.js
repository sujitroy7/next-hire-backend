import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest.js";
import {
  createJobSchema,
  updateJobSchema,
  getCandidateJobsSchema,
} from "./jobs.schema.js";
import {
  createJobHandler,
  getJobsByRecruiter,
  getJobDetailsHandler,
  updateJobDetailsHandler,
  getCandidateJobsHandler,
} from "./jobs.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

const router = Router();

// get all jobs by recruiter
router.get("/recruiter", authenticate(["RECRUITER"]), getJobsByRecruiter);
// get jobs for candidates (pagination + filters)
router.get(
  "/",
  validateRequest(getCandidateJobsSchema),
  getCandidateJobsHandler,
);
// get any job by id
router.get("/:jobId", getJobDetailsHandler);
// for recruiter creating new job for candidates
router.post(
  "/",
  authenticate(["RECRUITER"]),
  validateRequest(createJobSchema),
  createJobHandler,
);
// for recruiter updating existing job details
router.patch(
  "/:jobId",
  authenticate(["RECRUITER"]),
  validateRequest(updateJobSchema),
  updateJobDetailsHandler,
);
export default router;
