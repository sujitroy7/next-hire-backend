import { getRecruiterProfile } from "../recruiter-profile/recruiter-profile.service.js";
import {
  createJob,
  updateJob,
  getAllJobsByRecruiter,
  getJobDetailes,
  getCandidateJobs,
  getJobDetailsForRecruiter,
  updateJobStatus,
  getJobsByOrganization,
  getJobDetailsForOrganization,
  getJobTitlesForAutocomplete,
} from "./jobs.service.js";

export const createJobHandler = async (req, res) => {
  try {
    const {
      title,
      description,
      employmentType,
      salaryMin,
      salaryMax,
      isActive,
      publishedAt,
    } = req.body;

    const recruiterId = req.user.sub;
    const { organizationId } = await getRecruiterProfile(recruiterId);

    const newJob = await createJob({
      recruiterId,
      organizationId,
      title,
      description,
      employmentType,
      salaryMin,
      salaryMax,
      isActive,
      publishedAt,
    });
    res.status(201).json({ status: "success", data: newJob });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export const getJobsByRecruiterHandler = async (req, res) => {
  const recruiterId = req?.user?.sub;
  const { page, limit, search, status } = req.query;

  try {
    const {
      jobs,
      total,
      page: pageNumber,
      limit: limitNumber,
    } = await getAllJobsByRecruiter({
      recruiterId,
      page,
      limit,
      search,
      status,
    });

    const totalPages = Math.ceil(total / limitNumber);

    return res.status(200).json({
      status: "success",
      data: {
        data: jobs,
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

export const getJobDetailsHandler = async (req, res) => {
  const { jobId } = req.params;

  try {
    const jobDetails = await getJobDetailes(jobId);

    if (!jobDetails) {
      return res
        .status(404)
        .json({ status: "error", message: "Job not found" });
    }

    return res.status(200).json({ status: "success", data: jobDetails });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateJobDetailsHandler = async (req, res) => {
  const {
    organizationId,
    recruiterProfileId,
    title,
    description,
    employmentType,
    salaryMin,
    salaryMax,
    isActive,
    publishedAt,
  } = req.body;
  const { jobId } = req.params;

  try {
    const job = await updateJob(jobId, {
      organizationId,
      recruiterProfileId,
      title,
      description,
      employmentType,
      salaryMin,
      salaryMax,
      isActive,
      publishedAt,
    });
    return res.status(200).json({ status: "success", data: job });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export const getCandidateJobsHandler = async (req, res) => {
  const {
    page,
    limit,
    sortBy,
    sortOrder,
    employmentType,
    workplaceType,
    experienceLevel,
    isActive,
    organizationId,
    recruiterId,
    search,
    salaryMin,
    salaryMax,
    publishedFrom,
    publishedTo,
    createdFrom,
    createdTo,
  } = req.query;

  try {
    const {
      jobs,
      total,
      page: pageNumber,
      limit: limitNumber,
    } = await getCandidateJobs({
      page,
      limit,
      sortBy,
      sortOrder,
      employmentType,
      workplaceType,
      experienceLevel,
      isActive,
      organizationId,
      recruiterId,
      search,
      salaryMin,
      salaryMax,
      publishedFrom,
      publishedTo,
      createdFrom,
      createdTo,
    });

    const totalPages = Math.ceil(total / limitNumber);

    return res.status(200).json({
      status: "success",
      data: {
        data: jobs,
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

export const getRecruiterJobDetailHandler = async (req, res) => {
  const { jobId } = req.params;
  const recruiterId = req.user.sub;

  try {
    const jobDetails = await getJobDetailsForRecruiter(jobId, recruiterId);
    if (!jobDetails) {
      return res
        .status(404)
        .json({ status: "error", message: "Job not found or access denied" });
    }
    return res.status(200).json({ status: "success", data: jobDetails });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateJobStatusHandler = async (req, res) => {
  const { jobId } = req.params;
  const { status } = req.body;
  const recruiterId = req.user.sub;

  try {
    const job = await getJobDetailsForRecruiter(jobId, recruiterId);
    if (!job) {
      return res
        .status(404)
        .json({ status: "error", message: "Job not found or access denied" });
    }

    const updatedJob = await updateJobStatus(jobId, status);
    return res.status(200).json({ status: "success", data: updatedJob });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export const getOrganizationJobsHandler = async (req, res) => {
  let organizationId;

  if (req.user.role === "ORGANIZATION") {
    organizationId = req.user.sub;
  } else if (req.user.role === "RECRUITER") {
    const recruiter = await getRecruiterProfile(req.user.sub, {
      organizationId: true,
    });
    organizationId = recruiter.organizationId;
  }

  const { page, limit, search, status } = req.query;

  try {
    const {
      jobs,
      total,
      page: pageNumber,
      limit: limitNumber,
    } = await getJobsByOrganization(
      organizationId,
      page,
      limit,
      search,
      status,
    );

    const totalPages = Math.ceil(total / limitNumber);

    return res.status(200).json({
      status: "success",
      data: {
        data: jobs,
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

export const getOrganizationJobDetailHandler = async (req, res) => {
  const { jobId } = req.params;
  const organizationId = req.user.sub;

  try {
    const jobDetails = await getJobDetailsForOrganization(
      jobId,
      organizationId,
    );
    if (!jobDetails) {
      return res
        .status(404)
        .json({ status: "error", message: "Job not found or access denied" });
    }
    return res.status(200).json({ status: "success", data: jobDetails });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export const getJobTitleAutocompleteHandler = async (req, res) => {
  const { query, limit } = req.query;

  try {
    const titles = await getJobTitlesForAutocomplete(query, limit);

    return res.status(200).json({
      status: "success",
      data: titles,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: error.message });
  }
};
