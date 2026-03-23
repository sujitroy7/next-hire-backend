import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest.js";
import {
  createJobSchema,
  updateJobSchema,
  getCandidateJobsSchema,
  updateJobStatusSchema,
  paginationSchema,
  jobTitleAutocompleteSchema,
} from "./jobs.schema.js";
import {
  createJobHandler,
  getJobsByRecruiterHandler,
  getJobDetailsHandler,
  updateJobDetailsHandler,
  getCandidateJobsHandler,
  getRecruiterJobDetailHandler,
  updateJobStatusHandler,
  getOrganizationJobsHandler,
  getOrganizationJobDetailHandler,
  getJobTitleAutocompleteHandler,
} from "./jobs.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

const router = Router();

// =========================
// PUBLIC (Candidate)
// =========================

// List all published jobs (public jobs page)
router.get(
  "/jobs",
  validateRequest(getCandidateJobsSchema),
  getCandidateJobsHandler,
);

// Get job title autocompletion
router.get(
  "/jobs/autocomplete/titles",
  validateRequest(jobTitleAutocompleteSchema),
  getJobTitleAutocompleteHandler,
);

// Get single published job detail
router.get("/jobs/:jobId", getJobDetailsHandler);

// =========================
// RECRUITER JOBS PAGE
// =========================

// List all jobs created by logged-in recruiter (draft, published, closed)
router.get(
  "/recruiter/jobs",
  authenticate(["RECRUITER"]),
  validateRequest(paginationSchema),
  getJobsByRecruiterHandler,
);

// Get recruiter job detail
router.get(
  "/recruiter/jobs/:jobId",
  authenticate(["RECRUITER"]),
  getRecruiterJobDetailHandler,
);

// Create new job (default status = DRAFT)
router.post(
  "/recruiter/jobs",
  authenticate(["RECRUITER"]),
  validateRequest(createJobSchema),
  createJobHandler,
);

// Update job details
router.patch(
  "/recruiter/jobs/:jobId",
  authenticate(["RECRUITER"]),
  validateRequest(updateJobSchema),
  updateJobDetailsHandler,
);

// Change job status (DRAFT, PUBLISHED, CLOSED)
router.patch(
  "/recruiter/jobs/:jobId/status",
  authenticate(["RECRUITER"]),
  validateRequest(updateJobStatusSchema),
  updateJobStatusHandler,
);

// =========================
// ORGANIZATION JOBS PAGE
// =========================

// List all jobs belonging to organization
router.get(
  "/organization/jobs",
  authenticate(["ORGANIZATION", "RECRUITER"]),
  validateRequest(paginationSchema),
  getOrganizationJobsHandler,
);

// Get organization job detail
router.get(
  "/organization/jobs/:jobId",
  authenticate(["ORGANIZATION"]),
  getOrganizationJobDetailHandler,
);

export default router;
