import { prisma } from "../../config/prisma.js";

export const createJob = async (data) => {
  const {
    recruiterId,
    organizationId,
    title,
    description,
    employmentType,
    salaryMin,
    salaryMax,
    isActive,
    publishedAt,
  } = data;

  return await prisma.job.create({
    data: {
      recruiterId,
      organizationId,
      title,
      description,
      employmentType,
      salaryMin,
      salaryMax,
      isActive,
      publishedAt,
    },
  });
};

export const getAllJobsByRecruiter = async (recruiterId) => {
  return await prisma.job.findMany({
    where: {
      recruiterId,
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
