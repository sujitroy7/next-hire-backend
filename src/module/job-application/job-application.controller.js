import { getJobDetailes } from "../jobs/jobs.service.js";
import { getRecruiterProfile } from "../recruiter-profile/recruiter-profile.service.js";
import {
  createJobApplication,
  getCandidateApplications,
  getJobApplicationById,
  getApplicationsByJob,
  updateJobApplicationStatus,
  getOrganizationCandidates,
  getRecentActivityForOrganization,
  getRecentActivityForRecruiter,
} from "./job-application.service.js";

export const applyForJobHandler = async (req, res) => {
  const userId = req?.user?.sub;
  const { jobId, resumeUrl } = req.body;

  try {
    const application = await createJobApplication({
      jobId,
      candidateId: userId,
      resumeUrl,
    });

    return res.status(201).json({ status: "success", data: application });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export const getCandidateApplicationsHandler = async (req, res) => {
  const userId = req?.user?.sub;
  const { page, limit, sortBy, sortOrder, status, jobId } = req.query;

  try {
    const {
      applications,
      total,
      page: pageNumber,
      limit: limitNumber,
    } = await getCandidateApplications({
      candidateId: userId,
      page,
      limit,
      sortBy,
      sortOrder,
      status,
      jobId,
    });

    const totalPages = Math.ceil(total / limitNumber);

    return res.status(200).json({
      status: "success",
      data: applications,
      meta: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export const getJobApplicationsByJobHandler = async (req, res) => {
  const { jobId } = req.params;
  const recruiterId = req?.user?.sub;
  const { page, limit, sortBy, sortOrder, status } = req.query;

  try {
    const job = await getJobDetailes(jobId);
    if (!job) {
      return res
        .status(404)
        .json({ status: "error", message: "Job not found" });
    }

    if (job.recruiterId !== recruiterId) {
      return res.status(403).json({
        status: "error",
        message: "Access denied: insufficient permissions",
      });
    }

    const {
      applications,
      total,
      page: pageNumber,
      limit: limitNumber,
    } = await getApplicationsByJob({
      jobId,
      page,
      limit,
      sortBy,
      sortOrder,
      status,
    });

    const totalPages = Math.ceil(total / limitNumber);

    return res.status(200).json({
      status: "success",
      data: applications,
      meta: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateJobApplicationStatusHandler = async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;
  const recruiterId = req?.user?.sub;

  try {
    const application = await getJobApplicationById(applicationId);
    if (!application) {
      return res
        .status(404)
        .json({ status: "error", message: "Job application not found" });
    }

    const job = await getJobDetailes(application.jobId);
    if (!job) {
      return res
        .status(404)
        .json({ status: "error", message: "Job not found" });
    }

    if (job.recruiterId !== recruiterId) {
      return res.status(403).json({
        status: "error",
        message: "Access denied: insufficient permissions",
      });
    }

    const updatedApplication = await updateJobApplicationStatus(
      applicationId,
      status,
    );

    return res
      .status(200)
      .json({ status: "success", data: updatedApplication });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export const getOrganizationCandidatesHandler = async (req, res) => {
  const userId = req?.user?.sub;
  const userType = req?.user?.userType;
  const { page, limit, search, status, jobId } = req.query;

  try {
    let organizationId;

    if (userType === "ORGANIZATION") {
      organizationId = userId;
    } else {
      const recruiterProfile = await getRecruiterProfile(userId, {
        organizationId: true,
      });
      if (!recruiterProfile || !recruiterProfile.organizationId) {
        return res
          .status(404)
          .json({ status: "error", message: "Recruiter profile not found" });
      }
      organizationId = recruiterProfile.organizationId;
    }

    const {
      applications,
      total,
      page: pageNumber,
      limit: limitNumber,
    } = await getOrganizationCandidates({
      organizationId,
      page,
      limit,
      search,
      status,
      jobId,
    });

    const totalPages = Math.ceil(total / limitNumber);

    return res.status(200).json({
      status: "success",
      data: {
        data: applications,
        pagination: {
          total,
          page: pageNumber,
          limit: limitNumber,
          totalPages,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export const getRecentActivityHandler = async (req, res) => {
  const userId = req?.user?.sub;
  const userType = req?.user?.userType;

  try {
    let organizationId;

    if (userType === "ORGANIZATION") {
      organizationId = userId;
    } else {
      const recruiterProfile = await getRecruiterProfile(userId, {
        organizationId: true,
      });
      if (!recruiterProfile || !recruiterProfile.organizationId) {
        return res
          .status(404)
          .json({ status: "error", message: "Recruiter profile not found" });
      }
      organizationId = recruiterProfile.organizationId;
    }

    const activity = await getRecentActivityForOrganization(organizationId, 5);

    return res.status(200).json({
      status: "success",
      data: activity,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export const getRecruiterRecentActivityHandler = async (req, res) => {
  const recruiterId = req?.user?.sub;

  try {
    const activity = await getRecentActivityForRecruiter(recruiterId, 5);

    return res.status(200).json({
      status: "success",
      data: activity,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: error.message });
  }
};
