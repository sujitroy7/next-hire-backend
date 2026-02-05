import { getRecruiterProfile } from "../recruiter-profile/recruiter-profile.service.js";
import {
  createJob,
  updateJob,
  getAllJobsByRecruiter,
  getJobDetailes,
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

export const getJobsByRecruiter = async (req, res) => {
  const recruiterId = req?.user?.sub;

  try {
    const jobs = await getAllJobsByRecruiter(recruiterId);
    return res.status(200).json({ status: "success", data: jobs });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export const getJobDetailsHandler = async (req, res) => {
  const { jobId } = req.params;

  try {
    const jobDetails = await getJobDetailes(jobId);

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
