import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest.js";
import { createJobSchema, updateJobSchema } from "./jobs.schema.js";
import {
  createJobHandler,
  getJobsByRecruiter,
  getJobDetailsHandler,
  updateJobDetailsHandler,
} from "./jobs.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

const router = Router();

// get all jobs by recruiter
router.get("/recruiter", authenticate(["RECRUITER"]), getJobsByRecruiter);
// get any job by id
router.get("/:jobId", getJobDetailsHandler);
// for recruiter creating new job for candidates
router.post(
  "/",
  authenticate(["RECRUITER"]),
  validateRequest(createJobSchema),
  createJobHandler
);
// for recruiter updating existing job details
router.patch(
  "/:jobId",
  authenticate(["RECRUITER"]),
  validateRequest(updateJobSchema),
  updateJobDetailsHandler
);
export default router;
