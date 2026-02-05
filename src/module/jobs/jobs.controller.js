import {
  createJob,
  updateJob,
  getAllJobsByRecruiter,
  getJobDetailes,
} from "./jobs.service.js";

export const createJobHandler = async (req, res) => {
  const {
    organizationProfile,
    recruiterProfileId,
    title,
    description,
    employmentType,
    salaryMin,
    salaryMax,
    isActive,
    publishedAt,
  } = req.body;

  try {
    const newJob = await createJob({
      organizationProfile,
      recruiterProfileId,
      title,
      description,
      employmentType,
      salaryMin,
      salaryMax,
      isActive,
      publishedAt,
    });
    res.status(201).json({ status: "error", data: newJob });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export const getJobsByRecruiter = async (req, res) => {
  const recruiterId = req?.user?.sub;

  try {
    const jobs = await getAllJobsByRecruiter(recruiterId);
    return res.status(200).json({ status: "success", data: jobs });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export const getJobDetailsHandler = async (req, res) => {
  const { jobId } = req.params;

  try {
    const jobDetails = await getJobDetailes(jobId);

    return res.status(200).json({ status: "success", data: jobDetails });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateJobDetailsHandler = async (req, res) => {
  const { jobId } = req.params;
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
