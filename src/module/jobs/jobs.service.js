import { prisma } from "../../config/prisma.js";

export const createJob = async (data) => {
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
  } = data;

  return await prisma.job.create({
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
};

export const getAllJobsByRecruiter = async (recruiterId) => {
  return await prisma.job.findMany({
    where: {
      recruiterProfileId: recruiterId,
    },
  });
};

export const getJobDetailes = async (jobId) => {
  return await prisma.job.findFirst({
    where: {
      id: jobId,
    },
  });
};

export const updateJob = async (jobId, data) => {
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
  } = data;

  return await prisma.job.update({
    data: {
      organizationId,
      recruiterProfileId,
      title,
      description,
      employmentType,
      salaryMin,
      salaryMax,
      isActive,
      publishedAt,
    },
    where: {
      id: jobId,
    },
  });
};
